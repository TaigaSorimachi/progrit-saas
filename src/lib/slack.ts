export interface SlackConfig {
  clientId: string;
  clientSecret: string;
  signingSecret: string;
  botToken: string;
  userToken: string;
  redirectUri: string;
}

export interface SlackUser {
  id: string;
  email: string;
  name: string;
  displayName: string;
  status: 'active' | 'deactivated' | 'deleted';
  isAdmin: boolean;
  lastSeen: string;
  timeZone: string;
  profile: {
    image: string;
    title: string;
    department: string;
  };
}

export interface SlackWorkspace {
  id: string;
  name: string;
  domain: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  memberCount: number;
  channelCount: number;
  adminCount: number;
}

export interface SlackChannel {
  id: string;
  name: string;
  isPrivate: boolean;
  memberCount: number;
  topic: string;
  purpose: string;
}

export class SlackAPI {
  private config: SlackConfig;
  private baseUrl = 'https://slack.com/api';

  constructor(config: SlackConfig) {
    this.config = config;
  }

  // 認証URL生成
  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      scope:
        'admin,users:read,users:write,channels:read,channels:write,im:read,im:write',
      redirect_uri: this.config.redirectUri,
      state: state,
    });

    return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
  }

  // OAuth トークン交換
  async exchangeCodeForToken(code: string): Promise<{
    access_token: string;
    team: { id: string; name: string };
    bot_user_id: string;
  }> {
    const response = await fetch(`${this.baseUrl}/oauth.v2.access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: code,
        redirect_uri: this.config.redirectUri,
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Slack OAuth error: ${data.error}`);
    }

    return {
      access_token: data.access_token,
      team: data.team,
      bot_user_id: data.bot_user_id,
    };
  }

  // ワークスペース情報の取得
  async getWorkspaceInfo(): Promise<SlackWorkspace> {
    const response = await this.apiCall('team.info');
    const team = response.team;

    // メンバー数とチャンネル数を取得
    const [usersResponse, channelsResponse] = await Promise.all([
      this.apiCall('users.list'),
      this.apiCall('conversations.list', {
        types: 'public_channel,private_channel',
      }),
    ]);

    const members = usersResponse.members || [];
    const channels = channelsResponse.channels || [];
    const admins = members.filter(
      (member: any) => member.is_admin || member.is_owner
    );

    return {
      id: team.id,
      name: team.name,
      domain: team.domain,
      status: 'connected',
      lastSync: new Date().toISOString(),
      memberCount: members.length,
      channelCount: channels.length,
      adminCount: admins.length,
    };
  }

  // ユーザー一覧の取得
  async getUsers(): Promise<SlackUser[]> {
    const response = await this.apiCall('users.list');
    const members = response.members || [];

    return members
      .filter((member: any) => !member.is_bot && !member.deleted)
      .map((member: any) => ({
        id: member.id,
        email: member.profile.email || '',
        name: member.name,
        displayName:
          member.profile.display_name ||
          member.profile.real_name ||
          member.name,
        status: member.deleted
          ? 'deleted'
          : member.is_restricted
            ? 'deactivated'
            : 'active',
        isAdmin: member.is_admin || member.is_owner,
        lastSeen: member.updated
          ? new Date(member.updated * 1000).toISOString()
          : new Date().toISOString(),
        timeZone: member.tz || 'UTC',
        profile: {
          image: member.profile.image_192 || member.profile.image_72 || '',
          title: member.profile.title || '',
          department: member.profile.fields?.department?.value || '',
        },
      }));
  }

  // ユーザー招待
  async inviteUser(
    email: string,
    channels: string[] = [],
    firstName?: string,
    lastName?: string
  ): Promise<{
    success: boolean;
    user?: any;
    error?: string;
  }> {
    try {
      const response = await this.apiCall('admin.users.invite', {
        email: email,
        channels: channels.join(','),
        first_name: firstName,
        last_name: lastName,
      });

      return {
        success: true,
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ユーザー無効化
  async deactivateUser(userId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.apiCall('admin.users.setInactive', {
        user_id: userId,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // チャンネル一覧の取得
  async getChannels(): Promise<SlackChannel[]> {
    const response = await this.apiCall('conversations.list', {
      types: 'public_channel,private_channel',
      limit: 200,
    });

    const channels = response.channels || [];

    return channels.map((channel: any) => ({
      id: channel.id,
      name: channel.name,
      isPrivate: channel.is_private,
      memberCount: channel.num_members || 0,
      topic: channel.topic?.value || '',
      purpose: channel.purpose?.value || '',
    }));
  }

  // チャンネル作成
  async createChannel(
    name: string,
    isPrivate: boolean = false
  ): Promise<{
    success: boolean;
    channel?: any;
    error?: string;
  }> {
    try {
      const response = await this.apiCall('conversations.create', {
        name: name,
        is_private: isPrivate,
      });

      return {
        success: true,
        channel: response.channel,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // ユーザーをチャンネルに追加
  async addUserToChannel(
    channelId: string,
    userId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.apiCall('conversations.invite', {
        channel: channelId,
        users: userId,
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // 基本的なAPI呼び出し
  private async apiCall(
    method: string,
    params: Record<string, any> = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/${method}`;
    const headers: HeadersInit = {
      Authorization: `Bearer ${this.config.botToken}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    return data;
  }
}

// Slack設定の取得
export function getSlackConfig(): SlackConfig {
  return {
    clientId: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    botToken: process.env.SLACK_BOT_TOKEN || '',
    userToken: process.env.SLACK_USER_TOKEN || '',
    redirectUri:
      process.env.SLACK_REDIRECT_URI ||
      `${process.env.NEXTAUTH_URL}/api/slack/callback`,
  };
}

// Slack API インスタンスの作成
export function createSlackAPI(): SlackAPI {
  const config = getSlackConfig();
  return new SlackAPI(config);
}
