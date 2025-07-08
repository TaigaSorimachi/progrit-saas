import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // データベース接続テスト
    const userCount = await prisma.user.count();
    const saasAccountCount = await prisma.saaSAccount.count();
    const workflowCount = await prisma.workflowRequest.count();

    return NextResponse.json({
      success: true,
      message: 'API接続テスト成功',
      data: {
        database: 'connected',
        counts: {
          users: userCount,
          saasAccounts: saasAccountCount,
          workflows: workflowCount,
        },
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('API テストエラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEST_ERROR',
          message: 'APIテストに失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// 初期データ作成（テスト用）
export async function POST() {
  try {
    // テストユーザーの作成
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        name: 'テストユーザー',
        email: 'test@example.com',
        employeeId: 'EMP001',
        department: '開発部',
        position: 'シニアエンジニア',
        hireDate: new Date('2024-01-01'),
        manager: '佐藤太郎',
      },
    });

    // テストSaaS連携の作成
    const testSaasAccounts = await Promise.all([
      prisma.saaSAccount.upsert({
        where: {
          userId_provider_accountId: {
            userId: testUser.id,
            provider: 'google',
            accountId: 'test@company.com',
          },
        },
        update: {},
        create: {
          userId: testUser.id,
          provider: 'google',
          accountId: 'test@company.com',
          status: 'ACTIVE',
          metadata: JSON.stringify({
            domain: 'company.com',
            orgUnit: '/departments/development',
          }),
        },
      }),
      prisma.saaSAccount.upsert({
        where: {
          userId_provider_accountId: {
            userId: testUser.id,
            provider: 'slack',
            accountId: 'test@company.com',
          },
        },
        update: {},
        create: {
          userId: testUser.id,
          provider: 'slack',
          accountId: 'test@company.com',
          status: 'ACTIVE',
          metadata: JSON.stringify({
            userId: 'U123456789',
            channels: ['#general', '#development'],
          }),
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'テストデータを作成しました',
      data: {
        user: testUser,
        saasAccounts: testSaasAccounts,
      },
    });
  } catch (error) {
    console.error('テストデータ作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TEST_DATA_ERROR',
          message: 'テストデータの作成に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
