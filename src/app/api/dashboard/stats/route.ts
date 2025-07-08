import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 並列でデータを取得
    const [
      totalUsers,
      activeUsers,
      totalSaasAccounts,
      activeSaasAccounts,
      totalWorkflows,
      pendingWorkflows,
      todayLogs,
      recentWorkflows,
      recentAuditLogs,
      saasProviderStats,
      departmentStats,
    ] = await Promise.all([
      // ユーザー統計
      prisma.user.count(),
      prisma.user.count({
        where: {
          terminationDate: null,
        },
      }),

      // SaaS連携統計
      prisma.saaSAccount.count(),
      prisma.saaSAccount.count({
        where: {
          status: 'ACTIVE',
        },
      }),

      // ワークフロー統計
      prisma.workflowRequest.count(),
      prisma.workflowRequest.count({
        where: {
          status: 'PENDING',
        },
      }),

      // 今日のログ数
      prisma.auditLog.count({
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // 最近のワークフロー（5件）
      prisma.workflowRequest.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      // 最近のアクティビティ（監査ログから取得）
      prisma.auditLog.findMany({
        take: 5,
        orderBy: {
          timestamp: 'desc',
        },
      }),

      // SaaSプロバイダー別統計
      prisma.saaSAccount.groupBy({
        by: ['provider'],
        _count: {
          provider: true,
        },
        where: {
          status: 'ACTIVE',
        },
      }),

      // 部署別ユーザー統計
      prisma.user.groupBy({
        by: ['department'],
        _count: {
          department: true,
        },
        where: {
          department: {
            not: null,
          },
          terminationDate: null,
        },
      }),
    ]);

    // 最近のユーザー（5件）
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        saasAccounts: {
          where: {
            status: 'ACTIVE',
          },
        },
      },
    });

    // システムヘルス計算
    const healthScore = calculateSystemHealth(
      activeUsers,
      activeSaasAccounts,
      pendingWorkflows
    );

    // 最近のアクティビティ処理
    const recentActivity = recentAuditLogs.map(log => ({
      id: log.id,
      type: getActivityTypeLabel(log.action),
      description: getActivityDescription(log),
      timestamp: log.timestamp,
      status: getActivityStatus(log.action),
      userName: '不明', // ユーザー情報は別途取得が必要
    }));

    // 統計データの構築
    const stats = {
      totalUsers,
      activeUsers,
      totalSaasAccounts,
      activeSaasAccounts,
      totalWorkflows,
      pendingWorkflows,
      todayLogs,
      systemHealth: healthScore,
      saasProviderStats: saasProviderStats.map(stat => ({
        provider: stat.provider,
        count: stat._count.provider,
      })),
      departmentStats: departmentStats.map(stat => ({
        department: stat.department || '未設定',
        count: stat._count.department,
      })),
      recentWorkflows: recentWorkflows.map(workflow => ({
        id: workflow.id,
        type: workflow.type,
        status: workflow.status,
        createdAt: workflow.createdAt,
      })),
      recentActivity,
      recentUsers: recentUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        position: user.position,
        saasAccountCount: user.saasAccounts.length,
        lastLoginTime: null, // 実際のログイン時間は別途実装
        status: user.terminationDate ? 'inactive' : 'active',
        createdAt: user.createdAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ダッシュボード統計取得エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'STATS_FETCH_ERROR',
          message: 'ダッシュボード統計の取得に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// アクティビティタイプのラベル取得
function getActivityTypeLabel(action: string): string {
  const labels: { [key: string]: string } = {
    USER_CREATED: 'ユーザー作成',
    USER_UPDATED: 'ユーザー更新',
    USER_DELETED: 'ユーザー削除',
    SAAS_ACCOUNT_CREATED: 'SaaSアカウント作成',
    SAAS_ACCOUNT_UPDATED: 'SaaSアカウント更新',
    SAAS_ACCOUNT_DELETED: 'SaaSアカウント削除',
    WORKFLOW_CREATED: 'ワークフロー作成',
    WORKFLOW_APPROVED: 'ワークフロー承認',
    WORKFLOW_REJECTED: 'ワークフロー却下',
    LOGIN: 'ログイン',
    LOGOUT: 'ログアウト',
  };
  return labels[action] || action;
}

// アクティビティの説明文生成
function getActivityDescription(log: any): string {
  const userName = log.user?.name || '不明なユーザー';

  switch (log.action) {
    case 'USER_CREATED':
      return `${userName}さんが追加されました`;
    case 'USER_UPDATED':
      return `${userName}さんの情報が更新されました`;
    case 'USER_DELETED':
      return `${userName}さんが削除されました`;
    case 'SAAS_ACCOUNT_CREATED':
      return `${userName}さんのSaaSアカウントが作成されました`;
    case 'SAAS_ACCOUNT_UPDATED':
      return `${userName}さんのSaaSアカウントが更新されました`;
    case 'SAAS_ACCOUNT_DELETED':
      return `${userName}さんのSaaSアカウントが削除されました`;
    case 'WORKFLOW_CREATED':
      return `${userName}さんがワークフローを作成しました`;
    case 'WORKFLOW_APPROVED':
      return `${userName}さんがワークフローを承認しました`;
    case 'WORKFLOW_REJECTED':
      return `${userName}さんがワークフローを却下しました`;
    case 'LOGIN':
      return `${userName}さんがログインしました`;
    case 'LOGOUT':
      return `${userName}さんがログアウトしました`;
    default:
      return `${userName}さんが${log.action}を実行しました`;
  }
}

// アクティビティステータス取得
function getActivityStatus(
  action: string
): 'success' | 'warning' | 'error' | 'info' {
  if (
    action.includes('CREATED') ||
    action.includes('APPROVED') ||
    action === 'LOGIN'
  ) {
    return 'success';
  }
  if (
    action.includes('DELETED') ||
    action.includes('REJECTED') ||
    action === 'LOGOUT'
  ) {
    return 'warning';
  }
  if (action.includes('FAILED') || action.includes('ERROR')) {
    return 'error';
  }
  return 'info';
}

// システムヘルススコア計算
function calculateSystemHealth(
  activeUsers: number,
  activeSaasAccounts: number,
  pendingWorkflows: number
): {
  score: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
} {
  let score = 100;

  // ペンディングワークフローが多い場合は減点
  if (pendingWorkflows > 10) score -= 20;
  else if (pendingWorkflows > 5) score -= 10;

  // SaaS連携が少ない場合は減点
  if (activeUsers > 0) {
    const saasPerUser = activeSaasAccounts / activeUsers;
    if (saasPerUser < 2) score -= 15;
    else if (saasPerUser < 3) score -= 5;
  }

  // ステータス判定
  let status: 'excellent' | 'good' | 'warning' | 'critical';
  if (score >= 90) status = 'excellent';
  else if (score >= 75) status = 'good';
  else if (score >= 60) status = 'warning';
  else status = 'critical';

  return { score, status };
}
