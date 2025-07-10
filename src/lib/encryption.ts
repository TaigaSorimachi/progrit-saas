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

/**
 * SlackConfig専用の暗号化ヘルパー
 */
export class SlackConfigEncryption {
  private encryption: ConfigEncryption;

  constructor() {
    this.encryption = new ConfigEncryption();
  }

  /**
   * Slack設定オブジェクトを暗号化
   */
  encryptConfig(config: {
    clientId: string;
    clientSecret: string;
    signingSecret: string;
    botToken?: string;
    userToken?: string;
  }) {
    return {
      clientId: this.encryption.encrypt(config.clientId),
      clientSecret: this.encryption.encrypt(config.clientSecret),
      signingSecret: this.encryption.encrypt(config.signingSecret),
      botToken: config.botToken
        ? this.encryption.encrypt(config.botToken)
        : null,
      userToken: config.userToken
        ? this.encryption.encrypt(config.userToken)
        : null,
    };
  }

  /**
   * 暗号化されたSlack設定を復号化
   */
  decryptConfig(encryptedConfig: {
    clientId: string;
    clientSecret: string;
    signingSecret: string;
    botToken?: string | null;
    userToken?: string | null;
  }) {
    return {
      clientId: this.encryption.decrypt(encryptedConfig.clientId),
      clientSecret: this.encryption.decrypt(encryptedConfig.clientSecret),
      signingSecret: this.encryption.decrypt(encryptedConfig.signingSecret),
      botToken: encryptedConfig.botToken
        ? this.encryption.decrypt(encryptedConfig.botToken)
        : undefined,
      userToken: encryptedConfig.userToken
        ? this.encryption.decrypt(encryptedConfig.userToken)
        : undefined,
    };
  }
}

// シングルトンインスタンス
export const slackConfigEncryption = new SlackConfigEncryption();
