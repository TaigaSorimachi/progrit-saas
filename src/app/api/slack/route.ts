import { NextRequest, NextResponse } from 'next/server';
import { createSlackAPI } from '@/lib/slack';

// Slack ワークスペース情報の取得
export async function GET() {
  try {
    const slackAPI = createSlackAPI();

    // 設定が不完全な場合
    if (!process.env.SLACK_BOT_TOKEN) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'SLACK_NOT_CONFIGURED',
          message:
            'Slack連携が設定されていません。環境変数を確認してください。',
        },
      });
    }

    // ワークスペース情報を取得
    const workspace = await slackAPI.getWorkspaceInfo();

    return NextResponse.json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error('Slack ワークスペース情報取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SLACK_API_ERROR',
          message: 'Slack ワークスペース情報の取得に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// Slack 設定の更新
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const slackAPI = createSlackAPI();

    switch (action) {
      case 'sync':
        // 同期処理
        const workspace = await slackAPI.getWorkspaceInfo();
        return NextResponse.json({
          success: true,
          data: workspace,
          message: '同期が完了しました',
        });

      case 'test_connection':
        // 接続テスト
        const testResult = await slackAPI.getWorkspaceInfo();
        return NextResponse.json({
          success: true,
          data: testResult,
          message: 'Slack連携の接続テストが成功しました',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INVALID_ACTION',
              message: '無効なアクションです',
            },
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Slack API エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SLACK_API_ERROR',
          message: 'Slack API操作に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
