import { NextResponse } from 'next/server';
import { createCORSHeaders } from '../../_shared/cors';

/**
 * Format response for admin panel compatibility
 */
export function formatAdminResponse(data: any, isFromListView: boolean = false): NextResponse {
  if (isFromListView) {
    // List view format
    return NextResponse.json({
      docs: Array.isArray(data) ? data : [data],
      errors: [],
      message: null,
    }, {
      status: 200,
      headers: createCORSHeaders(),
    });
  } else {
    // Edit view format
    return NextResponse.json({
      message: null,
      doc: data,
      errors: [],
    }, {
      status: 200,
      headers: createCORSHeaders(),
    });
  }
}

/**
 * Format success response for API
 */
export function formatSuccessResponse(data: any, message?: string, status: number = 200): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    message: message || 'Operation completed successfully',
  }, {
    status,
    headers: createCORSHeaders(),
  });
}

/**
 * Format error response for API
 */
export function formatErrorResponse(
  error: string | Error,
  status: number = 500,
  details?: any
): NextResponse {
  const message = error instanceof Error ? error.message : error;
  
  return NextResponse.json({
    success: false,
    error: status >= 500 ? 'Internal server error' : 'Client error',
    message,
    details,
  }, {
    status,
    headers: createCORSHeaders(),
  });
}

/**
 * Format validation error response
 */
export function formatValidationError(
  message: string,
  field?: string,
  status: number = 400
): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Validation error',
    message,
    field,
  }, {
    status,
    headers: createCORSHeaders(),
  });
}

/**
 * Format paginated response
 */
export function formatPaginatedResponse(
  docs: any[],
  pagination: any,
  additionalData?: any
): NextResponse {
  return NextResponse.json({
    success: true,
    data: docs,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
      totalDocs: pagination.totalDocs,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
    },
    ...additionalData,
  }, {
    status: 200,
    headers: createCORSHeaders(),
  });
}
