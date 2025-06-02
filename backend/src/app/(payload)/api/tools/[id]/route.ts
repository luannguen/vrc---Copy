/**
 * API Route for Individual Tools
 *
 * This route handles single tool operations for the Payload admin panel.
 * It provides GET, PUT, PATCH, and DELETE operations for individual tools by ID.
 *
 * @path /(payload)/api/tools/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleGET } from '../handlers/get';
import { handlePUT } from '../handlers/put';
import { handlePatch } from '../handlers/patch';
import { handleDELETE } from '../handlers/delete';

/**
 * GET /api/tools/[id] - Get a single tool by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    // Convert id from params to query parameter format expected by the handler
    const url = new URL(request.url);
    url.searchParams.set('id', id);

    // Create a new request with the modified URL
    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return await handleGET(modifiedRequest);
  } catch (error) {
    console.error('Error in GET /api/tools/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tools/[id] - Update a tool (full replacement)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    // Convert id from params to query parameter format expected by the handler
    const url = new URL(request.url);
    url.searchParams.set('id', id);

    // Create a new request with the modified URL
    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return await handlePUT(modifiedRequest);
  } catch (error) {
    console.error('Error in PUT /api/tools/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tools/[id] - Update a tool (partial update)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    // Convert id from params to query parameter format expected by the handler
    const url = new URL(request.url);
    url.searchParams.set('id', id);

    // Create a new request with the modified URL
    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return await handlePatch(modifiedRequest);
  } catch (error) {
    console.error('Error in PATCH /api/tools/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tools/[id] - Delete a tool
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    // Convert id from params to query parameter format expected by the handler
    const url = new URL(request.url);
    url.searchParams.set('id', id);

    // Create a new request with the modified URL
    const modifiedRequest = new NextRequest(url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return await handleDELETE(modifiedRequest);
  } catch (error) {
    console.error('Error in DELETE /api/tools/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/tools/[id] - CORS preflight
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
