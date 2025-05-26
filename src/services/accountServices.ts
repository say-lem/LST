import crypto from 'crypto';
import User from '../models/userModel';
import EncryptData from '../models/encryptedModel';
import { VirtualCardModel } from '../models/virtualCardModel';
import { generateAccountNumber } from '../utils/generateAccount';
import { generateVirtualCard } from '../utils/generateVirtualCard';
import { RSAUtils } from '../utils/encryption';
import { NotFoundError, BadRequestError } from '../utils/errorClasses';
import { CreateUserRequest } from '../interfaces/userInterface';
import { rsaKeys } from '../config/keys';

if (!rsaKeys.publicKey || !rsaKeys.privateKey) {
  throw new Error('RSA key pair is not configured in environment variables');
}

function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

function encryptFields(fields: Record<string, string>): Record<string, string> {
  const encrypted: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    encrypted[key] = RSAUtils.encrypt(rsaKeys.publicKey, value).toString('base64');
  }
  return encrypted;
}

function decryptFields(fields: Record<string, string>): Record<string, string> {
  const decrypted: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    decrypted[key] = RSAUtils.decrypt(rsaKeys.privateKey, Buffer.from(value, 'base64')).toString();
  }
  return decrypted;
}

export async function registerAccount(userData: CreateUserRequest): Promise<any> {
  const { firstName, surname, email, phoneNumber, dateOfBirth } = userData;

  const phoneHash = hashPhone(phoneNumber);

  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber: phoneHash }],
  });
  if (existingUser) {
    throw new BadRequestError('User already exists with this email or phone number');
  }

  const accountNumber = generateAccountNumber();
  const card = generateVirtualCard();

  const encryptedFields = encryptFields({
    cardNumber: card.cardNumber,
    cvv: card.cvv,
    expiryDate: card.expiry,
    phoneNumber,
    dateOfBirth: dateOfBirth.toString(),
  });

  const user = await User.create({
    firstName,
    surname,
    email,
    phoneNumber: phoneHash,
    accountNumber,
    dateOfBirth,
  });

  await EncryptData.create({
    userId: user._id,
    ...encryptedFields,
  });

  await VirtualCardModel.create({
    customerId: user._id,
    cardNumber: encryptedFields.cardNumber,
    cvv: encryptedFields.cvv,
    expiryDate: new Date(card.expiry),
    status: 'ACTIVE',
  });

  const decryptedData = decryptFields(encryptedFields);

  return {
    user: {
      _id: user._id,
      firstName,
      surname,
      email,
      accountNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    encryptedData: encryptedFields,
    decryptedData, 
    message: 'Registration successful',
  };
}

export const getAllAccounts = async (): Promise<any[]> => {
  const users = await User.find({});
  const data: any[] = [];

  for (const user of users) {
    const [cardDetails, encryptedData] = await Promise.all([
      VirtualCardModel.findOne({ customerId: user._id }),
      EncryptData.findOne({ userId: user._id }),
    ]);

    if (!cardDetails || !encryptedData) {
      throw new NotFoundError(`Data not found for user ${user._id}`);
    }

    const decryptedData = decryptFields({
      cardNumber: encryptedData.cardNumber,
      cvv: encryptedData.cvv,
      expiryDate: encryptedData.expiryDate,
      phoneNumber: encryptedData.phoneNumber,
      dateOfBirth: encryptedData.dateOfBirth,
    });

    data.push({
      user: {
        userId: user._id,
        fullName: `${user.firstName} ${user.surname}`,
        accountNumber: user.accountNumber,
      },
      encryptedData,
      decryptedData, 
    });
  }

  return data;
};
