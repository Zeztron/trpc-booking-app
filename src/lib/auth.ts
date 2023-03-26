import { jwtVerify } from 'jose';

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret || secret.length === 0) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

  return secret;
}

export async function verifyAuth(token: string): Promise<UserJwtPayload> {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );
    return verified.payload as UserJwtPayload;
  } catch (error) {
    throw new Error('Your token is invalid');
  }
}
