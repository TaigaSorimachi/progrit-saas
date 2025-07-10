import { NextRequest, NextResponse } from 'next/server';
import { SlackAPI, SlackConfig } from '@/lib/slack';

export interface SlackTestRequest {
  clientId: string;
  clientSecret: string;
  signingSecret: string;
  botToken?: string;
  userToken?: string;
}

export interface SlackTestResponse {
  success: boolean;
  tests: {
    authTest: {
      success: boolean;
      message: string;
      data?: any;
    };
    teamInfo: {
      success: boolean;
      message: string;
      data?: any;
    };
    usersList: {
      success: boolean;
      message: string;
      data?: any;
    };
  };
  overallResult: 'success' | 'partial' | 'failed';
}

// POST: Slack設定のテスト
export async function POST(request: NextRequest) {
  try {
    const body: SlackTestRequest = await request.json();

    // 必須フィールドの検証
    if (!body.clientId || !body.clientSecret || !body.signingSecret) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Client ID、Client Secret、Signing Secretは必須です',
          },
        },
        { status: 400 }
      );
    }

    // Bot Tokenが設定されていない場合は基本認証情報のみテスト
    if (!body.botToken) {
      return NextResponse.json({
        success: true,
        data: {
          tests: {
            authTest: {
              success: false,
              message:
                'Bot Tokenが設定されていません。OAuth認証を完了してください。',
            },
            teamInfo: {
              success: false,
              message: 'Bot Tokenが必要です',
            },
            usersList: {
              success: false,
              message: 'Bot Tokenが必要です',
            },
          },
          overallResult: 'partial',
          message: '基本設定は有効ですが、OAuth認証が必要です',
        },
      });
    }

    // Slack API設定を作成
    const slackConfig: SlackConfig = {
      clientId: body.clientId,
      clientSecret: body.clientSecret,
      signingSecret: body.signingSecret,
      botToken: body.botToken,
      userToken: body.userToken || '',
      redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/slack/oauth/callback`,
    };

    const slackAPI = new SlackAPI(slackConfig);

    const testResults: SlackTestResponse['tests'] = {
      authTest: { success: false, message: '' },
      teamInfo: { success: false, message: '' },
      usersList: { success: false, message: '' },
    };

    let successCount = 0;

    // 1. 認証テスト
    try {
      const authResult = await slackAPI.apiCall('auth.test');
      testResults.authTest = {
        success: true,
        message: `認証成功: ${authResult.user}@${authResult.team}`,
        data: {
          user: authResult.user,
          team: authResult.team,
          userId: authResult.user_id,
          teamId: authResult.team_id,
        },
      };
      successCount++;
    } catch (error) {
      testResults.authTest = {
        success: false,
        message: `認証失敗: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    // 2. チーム情報取得テスト
    try {
      const teamInfo = await slackAPI.getWorkspaceInfo();
      testResults.teamInfo = {
        success: true,
        message: `チーム情報取得成功: ${teamInfo.name}`,
        data: {
          name: teamInfo.name,
          domain: teamInfo.domain,
          memberCount: teamInfo.memberCount,
          channelCount: teamInfo.channelCount,
        },
      };
      successCount++;
    } catch (error) {
      testResults.teamInfo = {
        success: false,
        message: `チーム情報取得失敗: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    // 3. ユーザー一覧取得テスト
    try {
      const users = await slackAPI.getUsers();
      testResults.usersList = {
        success: true,
        message: `ユーザー一覧取得成功: ${users.length}人のユーザー`,
        data: {
          userCount: users.length,
          sampleUsers: users.slice(0, 3).map(user => ({
            name: user.name,
            displayName: user.displayName,
            email: user.email,
          })),
        },
      };
      successCount++;
    } catch (error) {
      testResults.usersList = {
        success: false,
        message: `ユーザー一覧取得失敗: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }

    // 全体結果の判定
    let overallResult: SlackTestResponse['overallResult'];
    if (successCount === 3) {
      overallResult = 'success';
    } else if (successCount > 0) {
      overallResult = 'partial';
    } else {
      overallResult = 'failed';
    }

    const response: SlackTestResponse = {
      success: true,
      tests: testResults,
      overallResult,
    };

    return NextResponse.json({
      success: true,
      data: response,
      message: `テスト完了: ${successCount}/3項目が成功しました`,
    });
  } catch (error) {
    console.error('Slack設定テストエラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'Slack設定のテストに失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
