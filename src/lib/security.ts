import { createHash } from 'crypto';

export function generateDailyToken(): string {
    const secretKey = process.env.JWT_SECRET!;
    const today = new Date().toISOString().split('T')[0];
    const seed = `${today}-${secretKey}`;

    const hash = createHash('sha256')
        .update(seed)
        .digest('hex');

    return hash.substring(0, 8).toUpperCase();
}