import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { slackConfigEncryption } from '@/lib/encryption';

export interface SlackConfigRequest {
  clientId: string;
  clientSecret: string;
  signingSecret: string;
  botToken?: string;
  userToken?: string;
  workspaceName?: string;
  workspaceId?: string;
  workspaceDomain?: string;
}

export interface SlackConfigResponse {
  id: string;
  clientId: string; // 復号化済み
  clientSecret: string; // 復号化済み
  signingSecret: string; // 復号化済み
  botToken?: string; // 復号化済み
  userToken?: string; // 復号化済み
  workspaceName?: string;
  workspaceId?: string;
  workspaceDomain?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET: 現在の設定状況を取得
export async function GET() {
  try {
    const configs = await prisma.slackConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // 設定がない場合
    if (configs.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Slack設定が見つかりません',
      });
    }

    // 最新の設定を取得して復号化
    const latestConfig = configs[0];

    try {
      const decryptedConfig = slackConfigEncryption.decryptConfig({
        clientId: latestConfig.clientId,
        clientSecret: latestConfig.clientSecret,
        signingSecret: latestConfig.signingSecret,
        botToken: latestConfig.botToken,
        userToken: latestConfig.userToken,
      });

      const response: SlackConfigResponse = {
        id: latestConfig.id,
        clientId: decryptedConfig.clientId,
        clientSecret: decryptedConfig.clientSecret,
        signingSecret: decryptedConfig.signingSecret,
        botToken: decryptedConfig.botToken,
        userToken: decryptedConfig.userToken,
        workspaceName: latestConfig.workspaceName,
        workspaceId: latestConfig.workspaceId,
        workspaceDomain: latestConfig.workspaceDomain,
        isActive: latestConfig.isActive,
        createdAt: latestConfig.createdAt.toISOString(),
        updatedAt: latestConfig.updatedAt.toISOString(),
      };

      return NextResponse.json({
        success: true,
        data: response,
      });
    } catch (decryptionError) {
      console.error('設定の復号化エラー:', decryptionError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'DECRYPTION_ERROR',
            message: '設定データの復号化に失敗しました',
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Slack設定取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: '設定の取得に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}

// POST: 新しい設定を保存
export async function POST(request: NextRequest) {
  try {
    const body: SlackConfigRequest = await request.json();

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

    // 設定データを暗号化
    let encryptedConfig;
    try {
      encryptedConfig = slackConfigEncryption.encryptConfig({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        signingSecret: body.signingSecret,
        botToken: body.botToken,
        userToken: body.userToken,
      });
    } catch (encryptionError) {
      console.error('設定の暗号化エラー:', encryptionError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ENCRYPTION_ERROR',
            message: '設定データの暗号化に失敗しました',
          },
        },
        { status: 500 }
      );
    }

    // 既存の設定を無効化
    await prisma.slackConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // 新しい設定を保存
    const newConfig = await prisma.slackConfig.create({
      data: {
        clientId: encryptedConfig.clientId,
        clientSecret: encryptedConfig.clientSecret,
        signingSecret: encryptedConfig.signingSecret,
        botToken: encryptedConfig.botToken,
        userToken: encryptedConfig.userToken,
        workspaceName: body.workspaceName,
        workspaceId: body.workspaceId,
        workspaceDomain: body.workspaceDomain,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newConfig.id,
        isActive: newConfig.isActive,
        createdAt: newConfig.createdAt.toISOString(),
      },
      message: 'Slack設定を保存しました',
    });
  } catch (error) {
    console.error('Slack設定保存エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: '設定の保存に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}

// PUT: 設定を更新
export async function PUT(request: NextRequest) {
  try {
    const body: SlackConfigRequest & { id: string } = await request.json();

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '設定IDは必須です',
          },
        },
        { status: 400 }
      );
    }

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

    // 設定の存在確認
    const existingConfig = await prisma.slackConfig.findUnique({
      where: { id: body.id },
    });

    if (!existingConfig) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '指定された設定が見つかりません',
          },
        },
        { status: 404 }
      );
    }

    // 設定データを暗号化
    let encryptedConfig;
    try {
      encryptedConfig = slackConfigEncryption.encryptConfig({
        clientId: body.clientId,
        clientSecret: body.clientSecret,
        signingSecret: body.signingSecret,
        botToken: body.botToken,
        userToken: body.userToken,
      });
    } catch (encryptionError) {
      console.error('設定の暗号化エラー:', encryptionError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ENCRYPTION_ERROR',
            message: '設定データの暗号化に失敗しました',
          },
        },
        { status: 500 }
      );
    }

    // 設定を更新
    const updatedConfig = await prisma.slackConfig.update({
      where: { id: body.id },
      data: {
        clientId: encryptedConfig.clientId,
        clientSecret: encryptedConfig.clientSecret,
        signingSecret: encryptedConfig.signingSecret,
        botToken: encryptedConfig.botToken,
        userToken: encryptedConfig.userToken,
        workspaceName: body.workspaceName,
        workspaceId: body.workspaceId,
        workspaceDomain: body.workspaceDomain,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedConfig.id,
        isActive: updatedConfig.isActive,
        updatedAt: updatedConfig.updatedAt.toISOString(),
      },
      message: 'Slack設定を更新しました',
    });
  } catch (error) {
    console.error('Slack設定更新エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: '設定の更新に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}

// DELETE: 設定を削除
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const configId = searchParams.get('id');

    if (!configId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '設定IDは必須です',
          },
        },
        { status: 400 }
      );
    }

    // 設定の存在確認
    const existingConfig = await prisma.slackConfig.findUnique({
      where: { id: configId },
    });

    if (!existingConfig) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: '指定された設定が見つかりません',
          },
        },
        { status: 404 }
      );
    }

    // 設定を削除
    await prisma.slackConfig.delete({
      where: { id: configId },
    });

    return NextResponse.json({
      success: true,
      message: 'Slack設定を削除しました',
    });
  } catch (error) {
    console.error('Slack設定削除エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: '設定の削除に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}
