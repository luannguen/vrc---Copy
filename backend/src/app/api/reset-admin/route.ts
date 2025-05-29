import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function POST(_req: NextRequest) {
  try {
    console.log('🔓 Resetting admin user...');

    const payload = await getPayload({ config });

    // Find any admin user (first user in system)
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    });

    if (users.docs.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin user not found'
        },
        { status: 404 }
      );
    }

    const adminUser = users.docs[0];
    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Admin user not found'
        },
        { status: 404 }
      );
    }

    console.log(`Found admin user: ${adminUser.email}`);

    // Reset login attempts and unlock the user
    const updatedUser = await payload.update({
      collection: 'users',
      id: adminUser.id,
      data: {
        loginAttempts: 0,
        lockUntil: null,
        // Reset password to default
        password: '123456a@Aa',
      },
    });

    console.log('✅ Admin user reset successfully');

    return NextResponse.json({
      success: true,
      message: 'Admin user reset successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        loginAttempts: updatedUser.loginAttempts,
      },
    });

  } catch (error) {
    console.error('❌ Error resetting admin user:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow CORS for this endpoint
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
