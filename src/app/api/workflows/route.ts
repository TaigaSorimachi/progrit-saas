import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ワークフロー一覧取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // フィルター条件の構築
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (type && type !== 'all') {
      where.type = type;
    }

    // ワークフロー取得
    const [workflows, total] = await Promise.all([
      prisma.workflowRequest.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.workflowRequest.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: workflows,
      meta: {
        total,
        limit,
        offset,
        hasNext: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('ワークフロー取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'WORKFLOWS_FETCH_ERROR',
          message: 'ワークフローの取得に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// ワークフロー作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, requesterId, targetUserId, data } = body;

    // バリデーション
    if (!type || !requesterId || !targetUserId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '必須フィールドが不足しています',
          },
        },
        { status: 400 }
      );
    }

    // ワークフロー作成
    const workflow = await prisma.workflowRequest.create({
      data: {
        type,
        requesterId,
        targetUserId,
        status: 'PENDING',
        data: JSON.stringify(data || {}),
      },
    });

    // 監査ログ記録
    await prisma.auditLog.create({
      data: {
        userId: requesterId,
        action: 'WORKFLOW_CREATED',
        resource: `workflow:${workflow.id}`,
        metadata: JSON.stringify({
          workflowType: type,
          targetUserId,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      data: workflow,
    });
  } catch (error) {
    console.error('ワークフロー作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'WORKFLOW_CREATE_ERROR',
          message: 'ワークフローの作成に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
