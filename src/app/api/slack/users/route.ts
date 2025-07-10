import { NextRequest, NextResponse } from 'next/server';
import { createSlackAPI } from '@/lib/slack';

// Slack ユーザー一覧の取得
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

    // ユーザー一覧を取得
    const users = await slackAPI.getUsers();

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total: users.length,
      },
    });
  } catch (error) {
    console.error('Slack ユーザー一覧取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SLACK_API_ERROR',
          message: 'Slack ユーザー一覧の取得に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// Slack ユーザー操作（招待・無効化）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, channels, firstName, lastName, userId } = body;

    const slackAPI = createSlackAPI();

    switch (action) {
      case 'invite':
        // ユーザー招待
        if (!email) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'メールアドレスが必要です',
              },
            },
            { status: 400 }
          );
        }

        const inviteResult = await slackAPI.inviteUser(
          email,
          channels || [],
          firstName,
          lastName
        );

        if (inviteResult.success) {
          return NextResponse.json({
            success: true,
            data: inviteResult.user,
            message: `${email} を Slack に招待しました`,
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'INVITE_FAILED',
                message: inviteResult.error || 'ユーザーの招待に失敗しました',
              },
            },
            { status: 400 }
          );
        }

      case 'deactivate':
        // ユーザー無効化
        if (!userId) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'VALIDATION_ERROR',
                message: 'ユーザーIDが必要です',
              },
            },
            { status: 400 }
          );
        }

        const deactivateResult = await slackAPI.deactivateUser(userId);

        if (deactivateResult.success) {
          return NextResponse.json({
            success: true,
            message: 'ユーザーを無効化しました',
          });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: 'DEACTIVATE_FAILED',
                message:
                  deactivateResult.error || 'ユーザーの無効化に失敗しました',
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
    console.error('Slack ユーザー操作エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SLACK_API_ERROR',
          message: 'Slack ユーザー操作に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
