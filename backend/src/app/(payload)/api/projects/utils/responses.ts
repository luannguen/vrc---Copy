import { NextRequest, NextResponse } from 'next/server';

// Common CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-HTTP-Method-Override',
};

// Utility functions for consistent response formatting
export function formatAdminResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json(data, { 
    status, 
    headers: corsHeaders 
  });
}

export function formatAdminErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({
    message: message,
    errors: [{ message }]
  }, { 
    status, 
    headers: corsHeaders 
  });
}

export function formatAdminListResponse(docs: any[], totalDocs: number, limit: number, page: number, totalPages: number, hasNextPage: boolean, hasPrevPage: boolean): NextResponse {
  return NextResponse.json({
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    message: null,
    errors: []
  }, { 
    status: 200, 
    headers: corsHeaders 
  });
}

export function formatApiResponse(data: any, message: string = 'Thành công', status: number = 200): NextResponse {
  return NextResponse.json({
    success: true,
    message,
    data,
  }, { 
    status, 
    headers: corsHeaders 
  });
}

export function formatApiErrorResponse(message: string, status: number = 500): NextResponse {
  return NextResponse.json({
    success: false,
    message,
    error: message
  }, { 
    status, 
    headers: corsHeaders 
  });
}

// Helper function to detect admin requests
export function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

// Helper function to detect list view vs edit view for delete operations
export function isListViewRequest(req: NextRequest, collection: string): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes(`/admin/collections/${collection}`) && !referer.includes('/edit');
}

// Helper function to preprocess relationship fields
export function preprocessRelationshipField(fieldValue: any): any {
  if (!fieldValue) return fieldValue;
  
  if (Array.isArray(fieldValue)) {
    return fieldValue.map((item: any) => {
      if (typeof item === 'object' && item.id) {
        return item.id;
      }
      return item;
    });
  }
  
  if (typeof fieldValue === 'object' && fieldValue.id) {
    return fieldValue.id;
  }
  
  return fieldValue;
}
