import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // データベース接続のテストは環境変数がある場合のみ実行
    if (process.env.DATABASE_URL) {
      const { prisma } = await import('@/lib/prisma');
      await prisma.$queryRaw`SELECT 1`;
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: process.env.DATABASE_URL ? 'connected' : 'not_configured',
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'connection_failed',
      },
      { status: 500 }
    );
  }
}
