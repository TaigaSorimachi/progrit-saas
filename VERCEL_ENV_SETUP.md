# Environment Variables for Vercel Deployment

## Required Environment Variables

### Database
DATABASE_URL=postgresql://username:password@host:port/database_name

### NextAuth.js  
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-random-secret-key

### Slack Integration (Optional)
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret

### Encryption
ENCRYPTION_KEY=your-32-character-encryption-key

## Setup Instructions

1. Set up a PostgreSQL database (recommend Vercel Postgres or Supabase)
2. Add all environment variables to your Vercel project dashboard
3. Deploy your application


