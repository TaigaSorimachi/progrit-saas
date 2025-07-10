import { NextRequest, NextResponse } from 'next/server';
import { createSlackAPI } from '@/lib/slack';

// OAuth 認証URLの生成
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state =
      searchParams.get('state') || Math.random().toString(36).substring(2, 15);

    const slackAPI = createSlackAPI();
    const authUrl = slackAPI.generateAuthUrl(state);

    return NextResponse.json({
      success: true,
      data: {
        authUrl,
        state,
      },
    });
  } catch (error) {
    console.error('OAuth URL生成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'OAUTH_URL_ERROR',
          message: 'OAuth認証URLの生成に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// OAuth コールバック処理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state } = body;

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '認証コードが必要です',
          },
        },
        { status: 400 }
      );
    }

    const slackAPI = createSlackAPI();
    const tokenData = await slackAPI.exchangeCodeForToken(code);

    // トークンデータを保存（実際の実装では、データベースに保存）
    // 今回は環境変数として設定することを想定
    console.log('Slack OAuth Success:', {
      team: tokenData.team,
      access_token: tokenData.access_token,
      bot_user_id: tokenData.bot_user_id,
    });

    return NextResponse.json({
      success: true,
      data: {
        team: tokenData.team,
        message: 'Slack連携が正常に設定されました',
      },
    });
  } catch (error) {
    console.error('OAuth コールバックエラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'OAUTH_CALLBACK_ERROR',
          message: 'OAuth認証に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
