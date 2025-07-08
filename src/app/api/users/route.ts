import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ユーザー一覧取得
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        saasAccounts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      meta: {
        total: users.length,
      },
    });
  } catch (error) {
    console.error('ユーザー一覧取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'USER_FETCH_ERROR',
          message: 'ユーザー一覧の取得に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}

// ユーザー作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, employeeId, department, position, hireDate, manager } =
      body;

    // バリデーション
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '名前とメールアドレスは必須です',
          },
        },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'EMAIL_ALREADY_EXISTS',
            message: 'このメールアドレスは既に登録されています',
          },
        },
        { status: 409 }
      );
    }

    // ユーザー作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        employeeId,
        department,
        position,
        hireDate: hireDate ? new Date(hireDate) : null,
        manager,
      },
      include: {
        saasAccounts: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: 'ユーザーが正常に作成されました',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('ユーザー作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'USER_CREATE_ERROR',
          message: 'ユーザーの作成に失敗しました',
        },
      },
      { status: 500 }
    );
  }
}
