import crypto from 'crypto';

/**
 * データ暗号化・復号化ユーティリティ
 * AES-256-GCMを使用してSlack設定データを安全に保存
 */
export class ConfigEncryption {
  private algorithm = 'aes-256-gcm';
  private encryptionKey: Buffer;

  constructor() {
    // 環境変数から暗号化キーを取得、なければ生成
    const keyString = process.env.ENCRYPTION_KEY || this.generateKey();

    if (!process.env.ENCRYPTION_KEY) {
      console.warn(
        '⚠️ ENCRYPTION_KEY環境変数が設定されていません。一時的なキーを使用しています。'
      );
      console.warn('本番環境では必ず固定のENCRYPTION_KEYを設定してください。');
    }

    this.encryptionKey = Buffer.from(keyString, 'hex');
  }

  /**
   * データを暗号化
   */
  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipherGCM(
        this.algorithm,
        this.encryptionKey,
        iv
      );
      cipher.setAAD(Buffer.from('slack-config', 'utf8'));

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const authTag = cipher.getAuthTag();

      // IV + AuthTag + 暗号化データを結合
      return (
        iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
      );
    } catch (error) {
      console.error('暗号化エラー:', error);
      throw new Error('データの暗号化に失敗しました');
    }
  }

  /**
   * データを復号化
   */
  decrypt(encryptedData: string): string {
    try {
      const parts = encryptedData.split(':');
      if (parts.length !== 3) {
        throw new Error('無効な暗号化データ形式');
      }

      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];

      const decipher = crypto.createDecipherGCM(
        this.algorithm,
        this.encryptionKey,
        iv
      );
      decipher.setAAD(Buffer.from('slack-config', 'utf8'));
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('復号化エラー:', error);
      throw new Error('データの復号化に失敗しました');
    }
  }

  /**
   * ランダムな暗号化キーを生成
   */
  private generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * 新しい暗号化キーを生成（設定用）
   */
  static generateNewKey(): string {
    return crypto.randomBytes(32).toString('hex');
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
