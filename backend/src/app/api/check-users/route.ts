import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(_req: NextRequest) {
  try {
    console.log('🔍 Checking all users...');

    const payload = await getPayload({ config });

    // Find all users
    const users = await payload.find({
      collection: 'users',
      limit: 100,
    });

    console.log(`Found ${users.docs.length} users`);

    const userList = users.docs.map(user => ({
      id: user.id,
      email: user.email,
      loginAttempts: user.loginAttempts,
      lockUntil: user.lockUntil,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({
      success: true,
      totalUsers: users.docs.length,
      users: userList,
    });

  } catch (error) {
    console.error('❌ Error checking users:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
