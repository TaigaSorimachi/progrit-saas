import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || 'default-dev-key-32-characters';

// 32バイトのキーを生成
function getKey(): Buffer {
  if (ENCRYPTION_KEY.length >= 32) {
    return Buffer.from(ENCRYPTION_KEY.substring(0, 32), 'utf8');
  }
  // キーが短い場合は0で埋める
  const key = Buffer.alloc(32);
  Buffer.from(ENCRYPTION_KEY, 'utf8').copy(key);
  return key;
}

export function encrypt(text: string): string {
  try {
    const key = getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(ALGORITHM, key);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // IVと暗号化テキストを結合
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('データの暗号化に失敗しました');
  }
}

export function decrypt(encryptedText: string): string {
  try {
    const key = getKey();
    const [ivHex, encrypted] = encryptedText.split(':');

    if (!ivHex || !encrypted) {
      throw new Error('Invalid encrypted format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipher(ALGORITHM, key);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('データの復号化に失敗しました');
  }
}

// Slack設定用の暗号化クラス（互換性のため）
export class SlackConfigEncryption {
  encrypt(text: string): string {
    return encrypt(text);
  }

  decrypt(encryptedText: string): string {
    return decrypt(encryptedText);
  }
}
