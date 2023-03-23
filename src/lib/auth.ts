export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET_KEY;
  
  if (!secret || secret.length === 0) {
    throw new Error('JWT_SECRET_KEY is not defined');
  }

  return secret;
}
