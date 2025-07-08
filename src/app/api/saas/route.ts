import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// SaaS連携一覧取得
export async function GET() {
  try {
    const saasAccounts = await prisma.saaSAccount.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: saasAccounts,
      meta: {
        total: saasAccounts.length,
      },
    });
  } catch (error) {
    console.error('SaaS連携一覧取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SAAS_FETCH_ERROR',
          message: 'SaaS連携一覧の取得に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}

// SaaS連携作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      provider,
      accountId,
      status = 'ACTIVE',
      permissions,
      metadata,
    } = body;

    // バリデーション
    if (!userId || !provider || !accountId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'ユーザーID、プロバイダー、アカウントIDは必須です',
          },
        },
        { status: 400 }
      );
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: '指定されたユーザーが見つかりません',
          },
        },
        { status: 404 }
      );
    }

    // 重複チェック
    const existingSaasAccount = await prisma.saaSAccount.findFirst({
      where: {
        userId,
        provider,
        accountId,
      },
    });

    if (existingSaasAccount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SAAS_ACCOUNT_ALREADY_EXISTS',
            message: 'このSaaSアカウントは既に登録されています',
          },
        },
        { status: 409 }
      );
    }

    // SaaS連携作成
    const saasAccount = await prisma.saaSAccount.create({
      data: {
        userId,
        provider,
        accountId,
        status,
        permissions: permissions ? JSON.stringify(permissions) : null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: saasAccount,
        message: 'SaaS連携が正常に作成されました',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('SaaS連携作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SAAS_CREATE_ERROR',
          message: 'SaaS連携の作成に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}
