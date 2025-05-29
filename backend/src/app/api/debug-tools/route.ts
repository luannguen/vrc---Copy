import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { simpleToolsData } from '../../../seed/simple-tools';

export async function POST(_request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    console.log('🔍 Debug Tools Seeding...');
    console.log(`📊 Total tools data: ${simpleToolsData.length}`);

    // Log first tool structure
    if (simpleToolsData.length > 0) {
      console.log('📋 First tool data structure:');
      console.log(JSON.stringify(simpleToolsData[0], null, 2));
    }

    // Check tools collection schema
    const toolsCollection = payload.collections['tools'];
    console.log('📚 Tools collection exists:', !!toolsCollection);

    // Try to create just one tool for testing
    if (simpleToolsData.length > 0) {
      console.log('🧪 Testing single tool creation...');

      try {        const testTool = await payload.create({
          collection: 'tools',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: simpleToolsData[0] as any,
        });

        console.log('✅ Test tool created successfully:', testTool.id);

        // Verify it exists
        const verifyTool = await payload.findByID({
          collection: 'tools',
          id: testTool.id,
        });

        console.log('✅ Test tool verified:', verifyTool.name);

        return NextResponse.json({
          success: true,
          message: 'Test tool created successfully',
          toolId: testTool.id,
          toolName: testTool.name,
        });

      } catch (createError) {
        console.error('❌ Error creating test tool:', createError);
        return NextResponse.json({
          success: false,
          error: 'Failed to create test tool',
          details: createError instanceof Error ? createError.message : String(createError),
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'No tools data available',
    });

  } catch (error) {
    console.error('❌ Debug tools error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug tools failed',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
