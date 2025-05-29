// Debug script to check collections availability in Payload CMS
// Run this from the Next.js API endpoint

import { getPayload } from 'payload';
import config from '@/payload.config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    console.log('🔧 Starting collections debug...');

    // Initialize Payload
    const payload = await getPayload({ config });

    console.log('✅ Payload initialized');

    // Get all collections from config
    const collections = payload.config.collections;
      const debugInfo = {
      totalCollections: collections.length,
      collectionSlugs: collections.map(c => ({
        slug: c.slug,
        label: c.labels?.singular || 'No label',
        admin: c.admin?.useAsTitle || 'No title field'
      })),
      toolsFound: false,
      resourcesFound: false,
      accessTests: {} as Record<string, {
        accessible: boolean;
        count: number;
        error: string | null;
      }>
    };

    // Check for Tools and Resources specifically
    const toolsCollection = collections.find(c => c.slug === 'tools');
    const resourcesCollection = collections.find(c => c.slug === 'resources');

    debugInfo.toolsFound = !!toolsCollection;
    debugInfo.resourcesFound = !!resourcesCollection;

    // Test access to each collection
    const testCollections = ['tools', 'resources', 'users', 'products', 'services'];    for (const collectionSlug of testCollections) {
      try {
        const result = await payload.find({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          collection: collectionSlug as any,
          limit: 1
        });
        debugInfo.accessTests[collectionSlug] = {
          accessible: true,
          count: result.totalDocs,
          error: null
        };
      } catch (error) {
        debugInfo.accessTests[collectionSlug] = {
          accessible: false,
          count: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    console.log('🔍 Debug results:', debugInfo);

    return NextResponse.json({
      success: true,
      debug: debugInfo
    });

  } catch (error) {
    console.error('❌ Debug error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}
