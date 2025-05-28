import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config });
    
    // Get all project categories from Categories collection
    const categories = await payload.find({
      collection: 'categories',
      where: {
        type: { equals: 'project_category' }
      },
      limit: 100,
    });

    // Clear existing project-categories
    await payload.delete({
      collection: 'project-categories',
      where: {},
    });    // Create matching records in project-categories collection
    const syncedCategories = [];
    for (const category of categories.docs) {
      try {
        const categoryData = category as any; // Type assertion for additional fields
        
        const newCategory = await payload.create({
          collection: 'project-categories',
          data: {
            title: categoryData.title,
            slug: categoryData.slug,
            description: categoryData.description || '',
            color: categoryData.color || '',
            icon: categoryData.icon || '',
            showInMenu: true,
            orderNumber: 0,
            isActive: true,
          },
        });
        syncedCategories.push(newCategory);
      } catch (error) {
        console.error(`Failed to sync category ${category.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCategories.length} project categories`,
      synced: syncedCategories.length,
      total: categories.totalDocs,
    });
    
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
