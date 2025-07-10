import { NextRequest, NextResponse } from 'next/server';
import { createSlackAPI } from '@/lib/slack';

// Slack チャンネル一覧の取得
export async function GET() {
  try {
    const slackAPI = createSlackAPI();

    // 設定が不完全な場合
    if (!process.env.SLACK_BOT_TOKEN) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'SLACK_NOT_CONFIGURED',
          message: 'Slack連携が設定されていません。',
        },
      });
    }

    // チャンネル一覧を取得
    const channels = await slackAPI.getChannels();

    return NextResponse.json({
      success: true,
      data: channels,
      meta: {
        total: channels.length,
      },
    });
  } catch (error) {
    console.error('Slack チャンネル一覧取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SLACK_API_ERROR',
          message: 'Slack チャンネル一覧の取得に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// Slack チャンネル操作（作成・メンバー追加）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, name, isPrivate, channelId, userId } = body;

    const slackAPI = createSlackAPI();

    switch (action) {
      case 'create':
        // チャンネル作成
        if (!name) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'チャンネル名が必要です',
              },
            },
            { status: 400 }
          );
        }

        const createResult = await slackAPI.createChannel(
          name,
          isPrivate || false
        );

        if (createResult.success) {
          return NextResponse.json({
            success: true,
            data: createResult.channel,
            message: `チャンネル「${name}」を作成しました`,
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'CREATE_FAILED',
                message: createResult.error || 'チャンネルの作成に失敗しました',
              },
            },
            { status: 400 }
          );
        }

      case 'add_user':
        // ユーザーをチャンネルに追加
        if (!channelId || !userId) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'チャンネルIDとユーザーIDが必要です',
              },
            },
            { status: 400 }
          );
        }

        const addResult = await slackAPI.addUserToChannel(channelId, userId);

        if (addResult.success) {
          return NextResponse.json({
            success: true,
            message: 'ユーザーをチャンネルに追加しました',
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'ADD_USER_FAILED',
                message: addResult.error || 'ユーザーの追加に失敗しました',
              },
            },
            { status: 400 }
          );
        }

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
    console.error('Slack チャンネル操作エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SLACK_API_ERROR',
          message: 'Slack チャンネル操作に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
