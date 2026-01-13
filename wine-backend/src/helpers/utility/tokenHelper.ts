import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { access_Key, refresh_Key } from '../../config/config';
// import { UserType } from '@prisma/client';

export const GenerateTokens = (id: string, email: string, role: string) => {
    const payload = { id, email, role };

    const token = jwt.sign(payload, access_Key!, { expiresIn: '7d' });
    const refreshToken = jwt.sign(payload, refresh_Key!, { expiresIn: '30d' });

    return { token, refreshToken };
};

export const verifyToken = (token: string, secret: Secret) => {
    try {
        return jwt.verify(token, secret) as JwtPayload;
    } catch {
        return null;
    }
};
export const VerifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, refresh_Key!) as { email: string; user_id: string, role: string };
    } catch {
        return null;
    }
};


export const VerifySocketToken = (token: string): any => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY as string);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
