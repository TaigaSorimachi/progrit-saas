import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface BulkCreateRequest {
  userIds: string[];
  saasProviders: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: BulkCreateRequest = await request.json();
    const { userIds, saasProviders } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'ユーザーIDが必要です',
          },
        },
        { status: 400 }
      );
    }

    if (
      !saasProviders ||
      !Array.isArray(saasProviders) ||
      saasProviders.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'SaaSプロバイダーが必要です',
          },
        },
        { status: 400 }
      );
    }

    const results: any[] = [];
    const errors: any[] = [];

    // 各ユーザーについて処理
    for (const userId of userIds) {
      // ユーザーの存在確認
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        errors.push({
          userId,
          error: `ユーザーが見つかりません: ${userId}`,
        });
        continue;
      }

      // 各SaaSプロバイダーについて処理
      for (const provider of saasProviders) {
        try {
          // 既存のアカウントをチェック
          const existingAccount = await prisma.saaSAccount.findFirst({
            where: {
              userId: userId,
              provider: provider,
            },
          });

          if (existingAccount) {
            errors.push({
              userId,
              provider,
              error: `${provider}のアカウントは既に存在します`,
            });
            continue;
          }

          // SaaSアカウントを作成
          const accountResult = await createSaaSAccount(user, provider);

          if (accountResult.success) {
            // データベースにSaaSアカウントを保存
            const saasAccount = await prisma.saaSAccount.create({
              data: {
                userId: userId,
                provider: provider,
                accountId: accountResult.accountId,
                status: 'ACTIVE',
                metadata: JSON.stringify(accountResult.metadata || {}),
              },
            });

            // 監査ログ記録
            await prisma.auditLog.create({
              data: {
                userId: 'system',
                action: 'SAAS_ACCOUNT_CREATED',
                resource: `saas_account:${saasAccount.id}`,
                metadata: JSON.stringify({
                  provider,
                  accountId: accountResult.accountId,
                  targetUser: user.email,
                }),
              },
            });

            results.push({
              userId,
              provider,
              success: true,
              accountId: accountResult.accountId,
              saasAccountId: saasAccount.id,
            });
          } else {
            errors.push({
              userId,
              provider,
              success: false,
              error: accountResult.error,
            });
          }
        } catch (error) {
          errors.push({
            userId,
            provider,
            success: false,
            error: `処理中にエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
          });
        }
      }
    }

    // ワークフローリクエストとしてログ記録
    await prisma.workflowRequest.create({
      data: {
        type: 'BULK_ONBOARDING',
        requesterId: 'system',
        targetUserId: userIds[0], // 最初のユーザーを代表として使用
        status:
          errors.length === 0
            ? 'COMPLETED'
            : errors.length < results.length
              ? 'PARTIAL_SUCCESS'
              : 'FAILED',
        data: JSON.stringify({
          userIds,
          saasProviders,
          results,
          errors,
          totalOperations: userIds.length * saasProviders.length,
          successCount: results.length,
          errorCount: errors.length,
        }),
      },
    });

    const totalOperations = userIds.length * saasProviders.length;
    const successRate =
      totalOperations > 0
        ? ((results.length / totalOperations) * 100).toFixed(1)
        : '0';

    return NextResponse.json({
      success: true,
      data: {
        results,
        errors,
        summary: {
          totalUsers: userIds.length,
          totalProviders: saasProviders.length,
          totalOperations,
          successCount: results.length,
          errorCount: errors.length,
          successRate: successRate + '%',
        },
      },
      message: `${results.length}個のSaaSアカウントが正常に作成されました`,
    });
  } catch (error) {
    console.error('一括SaaSアカウント作成エラー:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'BULK_CREATE_ERROR',
          message: '一括アカウント作成に失敗しました',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

// SaaSアカウント作成（実際のデータベース操作のみ）
async function createSaaSAccount(user: any, provider: string) {
  try {
    // プロバイダーごとの基本設定
    const providerConfig = getProviderConfig(provider);

    // アカウントIDの生成（通常は外部APIから取得）
    const accountId = generateAccountId(user, provider);

    // メタデータの生成
    const metadata = generateAccountMetadata(user, provider);

    return {
      success: true,
      accountId,
      metadata,
    };
  } catch (error) {
    return {
      success: false,
      error: `${provider}アカウント作成に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// プロバイダー設定の取得
function getProviderConfig(provider: string) {
  const configs: { [key: string]: any } = {
    google: {
      domain: 'company.com',
      features: ['Email', 'Drive', 'Calendar', 'Meet'],
    },
    google_workspace: {
      domain: 'company.com',
      features: ['Email', 'Drive', 'Calendar', 'Meet'],
    },
    microsoft: {
      tenantId: 'company-tenant-id',
      features: ['Outlook', 'OneDrive', 'Teams', 'SharePoint'],
    },
    microsoft_365: {
      tenantId: 'company-tenant-id',
      features: ['Outlook', 'OneDrive', 'Teams', 'SharePoint'],
    },
    slack: {
      workspaceId: 'T1234567890',
      features: ['Messaging', 'Channels', 'Apps'],
    },
    github: {
      organization: 'company-org',
      features: ['Repositories', 'Issues', 'Actions'],
    },
    zoom: {
      accountId: 'company-zoom-account',
      features: ['Meetings', 'Webinars', 'Phone'],
    },
    aws_iam: {
      accountId: 'company-aws-account',
      features: ['Access Management', 'Policies', 'Roles'],
    },
    gitlab: {
      groupId: 'company-group',
      features: ['Git', 'CI/CD', 'Issues'],
    },
    salesforce: {
      orgId: 'company-salesforce-org',
      features: ['CRM', 'Sales', 'Marketing'],
    },
  };

  return configs[provider] || {};
}

// アカウントIDの生成
function generateAccountId(user: any, provider: string): string {
  switch (provider.toLowerCase()) {
    case 'google':
    case 'google_workspace':
    case 'microsoft':
    case 'microsoft_365':
    case 'slack':
      return user.email;
    case 'github':
    case 'gitlab':
      return user.email.split('@')[0]; // username style
    case 'zoom':
    case 'aws_iam':
    case 'salesforce':
      return `${user.employeeId}-${provider}`;
    default:
      return `${user.employeeId}-${provider}-${Date.now()}`;
  }
}

// アカウントメタデータの生成
function generateAccountMetadata(user: any, provider: string) {
  const config = getProviderConfig(provider);

  const baseMetadata = {
    createdAt: new Date().toISOString(),
    department: user.department,
    position: user.position,
    manager: user.manager,
    ...config,
  };

  switch (provider.toLowerCase()) {
    case 'google':
    case 'google_workspace':
      return {
        ...baseMetadata,
        orgUnit: `/departments/${user.department?.toLowerCase() || 'general'}`,
        licenses: ['workspace-business'],
        primaryEmail: user.email,
      };

    case 'microsoft':
    case 'microsoft_365':
      return {
        ...baseMetadata,
        userPrincipalName: user.email,
        licenses: ['Office365_Business'],
        displayName: user.name,
      };

    case 'slack':
      return {
        ...baseMetadata,
        userId: `U${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
        channels: ['#general', `#${user.department?.toLowerCase() || 'team'}`],
        displayName: user.name,
      };

    case 'github':
      return {
        ...baseMetadata,
        username: user.email.split('@')[0],
        teams: [user.department?.toLowerCase() || 'developers'],
        accessLevel: user.position?.includes('マネージャー')
          ? 'admin'
          : 'member',
      };

    case 'zoom':
      return {
        ...baseMetadata,
        userType: 'Basic',
        license: 'Pro',
        department: user.department,
      };

    case 'aws_iam':
      return {
        ...baseMetadata,
        username: `${user.employeeId}`,
        groups: [`${user.department?.toLowerCase() || 'general'}-group`],
        policies: ['ReadOnlyAccess'],
      };

    case 'gitlab':
      return {
        ...baseMetadata,
        username: user.email.split('@')[0],
        accessLevel: user.position?.includes('マネージャー')
          ? 'maintainer'
          : 'developer',
        groups: [`${user.department?.toLowerCase() || 'general'}-team`],
      };

    case 'salesforce':
      return {
        ...baseMetadata,
        username: user.email,
        profileId: user.position?.includes('営業')
          ? 'sales-profile'
          : 'standard-profile',
        role: user.position,
      };

    default:
      return baseMetadata;
  }
}
