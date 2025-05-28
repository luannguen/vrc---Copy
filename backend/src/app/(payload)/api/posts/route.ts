import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSResponse,
  handleApiError,
  createCorsHeaders,
  withCORS,
  checkAuth
} from '../_shared/cors'
import { extractPostIds, extractPostIdsSync } from '../_shared/extractPostIds'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']);
}

export const GET = withCORS(async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    })
    
    const url = new URL(req.url)
    
    // Parse query parameters
    const { postId } = extractPostIdsSync(req);
    const slug = url.searchParams.get('slug')
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 10
    const search = url.searchParams.get('search')
    const category = url.searchParams.get('category')
    const sort = url.searchParams.get('sort') || 'createdAt'
    const order = url.searchParams.get('order') || 'desc'
    
    // Extract post ID from path if present (e.g. /api/posts/123456) when not found in query
    let pathId = null;
    if (!postId) {
      const path = url.pathname
      const pathSegments = path.split('/')
      pathId = pathSegments[pathSegments.length - 1]
      
      // Only treat as ID if not "posts" (route name)
      if (pathId && pathId !== 'posts') {
        try {
          const post = await payload.findByID({
            collection: 'posts',
            id: pathId,
            depth: 1, // Populate references 1 level deep
          })
          
          return createCORSResponse({
            success: true,
            data: post,
          }, 200)
        } catch (error) {
          console.error(`Error fetching post with ID ${pathId}:`, error)
          return handleApiError(error, `Không tìm thấy bài viết với ID: ${pathId}`, 404)
        }
      }
    }
    
    // If fetching a single post by ID
    if (postId) {
      try {
        const post = await payload.findByID({
          collection: 'posts',
          id: postId,
          depth: 1, // Populate references 1 level deep
        })
        
        return createCORSResponse({
          success: true,
          data: post,
        }, 200)
      } catch (error) {
        console.error(`Error fetching post with ID ${postId}:`, error)
        return handleApiError(error, `Không tìm thấy bài viết với ID: ${postId}`, 404)
      }
    }
    
    // If fetching a single post by slug
    if (slug) {
      try {
        const result = await payload.find({
          collection: 'posts',
          where: {
            slug: {
              equals: slug
            }
          },
          depth: 1,
        })
        
        if (result.docs.length > 0) {
          return createCORSResponse({
            success: true,
            data: result.docs[0],
          }, 200)
        } else {
          return createCORSResponse({
            success: false,
            message: `Không tìm thấy bài viết với slug: ${slug}`,
          }, 404)
        }
      } catch (error) {
        console.error(`Error fetching post with slug ${slug}:`, error)
        return handleApiError(error, `Không tìm thấy bài viết với slug: ${slug}`, 404)
      }
    }
      // Otherwise fetch a list of posts with advanced filtering
    const query: any = {}
    
    // Handle status filter - allow filtering by any status if specified, default to published
    const statusParam = url.searchParams.get('status') || 'published'
    if (statusParam !== 'all') {
      query.status = {
        equals: statusParam
      }
    }
    
    // Add search filter - can search in title and content
    if (search) {
      // Use OR to search in both title and content
      query.or = [
        {
          title: {
            like: search
          }
        },
        {
          content: {
            like: search
          }
        }
      ]
    }
    
    // Add category filter
    if (category) {
      query.categories = {
        contains: category
      }
    }
    
    // Add date range filter if provided
    const fromDate = url.searchParams.get('fromDate')
    const toDate = url.searchParams.get('toDate')
    
    if (fromDate || toDate) {
      query.createdAt = {}
      
      if (fromDate) {
        query.createdAt.greater_than_equal = new Date(fromDate).toISOString()
      }
      
      if (toDate) {
        query.createdAt.less_than_equal = new Date(toDate).toISOString()
      }
    }
    
    console.log('Posts query:', JSON.stringify(query, null, 2))
    
    // Default sort by createdAt in descending order, unless specified otherwise
    const posts = await payload.find({
      collection: 'posts',
      where: query,
      page,
      limit,
      depth: 1,
      sort: sort ? (order === 'asc' ? sort : `-${sort}`) : '-createdAt',
    })
    
    return createCORSResponse({
      success: true,
      data: posts.docs,
      totalDocs: posts.totalDocs,
      totalPages: posts.totalPages,
      page: posts.page,
      hasNextPage: posts.hasNextPage,
      hasPrevPage: posts.hasPrevPage,
    }, 200)
  } catch (error) {
    console.error('Posts API Error:', error);
    return handleApiError(error, 'Có lỗi xảy ra khi tải dữ liệu bài viết', 500);
  }
});

/**
 * Delete a post or multiple posts
 * 
 * DELETE /api/posts?id=123456
 * DELETE /api/posts?ids=123456,789012
 * DELETE /api/posts?where[and][1][id][in][0]=123456 (format từ admin panel)
 */
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('DELETE /api/posts: Request received');
    console.log('Request URL:', req.url);
    console.log('Referer:', req.headers.get('referer'));
    
    // Special handling for admin panel requests
    const referer = req.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');
    
    if (isAdminRequest) {
      console.log('Detected admin panel request for post deletion');
    }
    
    // Yêu cầu xác thực với bypass cho admin
    const isAuthenticated = await checkAuth(req, !isAdminRequest) // Chỉ yêu cầu nghiêm ngặt xác thực cho các yêu cầu không từ admin
    if (!isAuthenticated && !isAdminRequest) {
      const headers = createCorsHeaders()
      return NextResponse.json(
        {
          success: false,
          message: 'Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.',
          errorType: 'authentication',
        },
        {
          status: 401,
          headers,
        }
      )
    }
    
    // Khởi tạo Payload
    const payload = await getPayload({
      config,
    })

    // Trích xuất ID post sử dụng hàm helper đã được cải thiện
    const { postId, postIds } = await extractPostIds(req);
    console.log('Extracted postId:', postId);
    console.log('Extracted postIds:', postIds);

    const headers = createCorsHeaders()
    
    // Xử lý xóa hàng loạt với nhiều ID
    if (postIds && postIds.length > 0) {
      const idsArray = postIds;
      
      if (idsArray.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Không có ID bài viết được cung cấp',
            errorType: 'validation',
          },
          {
            status: 400,
            headers,
          }
        )
      }
      
      // Xóa nhiều bài viết
      const results = [];
      const errors = [];
      
      // Bỏ qua việc kiểm tra post tồn tại trước khi xóa
      // Thay vào đó, sử dụng try-catch để xử lý lỗi cho từng ID riêng lẻ
      for (const id of idsArray) {        try {
          // Cố gắng xóa post dù nó có tồn tại hay không
          const _deletedPost = await payload.delete({
            collection: 'posts',
            id,
            // Đảm bảo hooks afterDelete được kích hoạt đúng cách
            context: {
              disableRevalidate: false, // Đảm bảo revalidation xảy ra
              isFromAPI: true, // Đánh dấu rằng request đến từ API tùy chỉnh
            }
          }).catch(error => {
            // Xử lý lỗi NotFound một cách đặc biệt - coi là xóa thành công
            if (error?.status === 404) {
              console.log(`Post with ID ${id} already not exists, considering deletion successful`);
              return { id, success: true, status: 'not_found_but_success' };
            }
            throw error; // Ném lại các lỗi khác
          });
          
          // Ghi log thành công
          console.log(`Successfully deleted post with ID: ${id}`);
          results.push({ id, success: true });
        } catch (err: any) {
          console.error(`Error deleting post ${id}:`, err);
          errors.push({ 
            id, 
            error: err.message || 'Lỗi không xác định',
            errorDetail: err.toString() 
          });
        }
      }
      
      // Tạo thông báo trạng thái chi tiết hơn về kết quả xóa
      let statusMessage;
      if (results.length === 0) {
        statusMessage = `Không thể xóa bất kỳ bài viết nào. ${errors.length} lỗi xảy ra.`;
      } else if (errors.length === 0) {
        statusMessage = `Đã xóa thành công tất cả ${results.length} bài viết.`;
      } else {
        statusMessage = `Đã xóa ${results.length}/${idsArray.length} bài viết. ${errors.length} lỗi xảy ra.`;
      }

      // Kiểm tra nếu yêu cầu đến từ admin panel và định dạng phản hồi phù hợp
      if (isAdminRequest) {
        // Đảm bảo định dạng phản hồi tuân thủ cấu trúc mà Payload CMS mong đợi
        if (errors.length === 0) {
          // Trả về định dạng thành công của Payload CMS 
          return NextResponse.json({
            docs: results.map(result => ({ id: result.id })),
            errors: [],
            message: statusMessage,
            // Các trường khác Payload mong đợi
            status: 200,
          }, {
            status: 200,
            headers,
          });
        } else {
          // Nếu có lỗi, tuân thủ định dạng lỗi của Payload
          return NextResponse.json({
            errors: errors.map(err => ({
              message: err.error || 'Lỗi khi xóa bài viết',
              name: 'DeleteError',
            })),
          }, {
            status: 400,
            headers
          });
        }
      }

      // Định dạng API tiêu chuẩn cho các yêu cầu không từ admin
      return NextResponse.json(
        {
          success: errors.length === 0,
          message: statusMessage,
          results,
          errors: errors.length > 0 ? errors : undefined,
        },
        {
          status: errors.length === 0 ? 200 : 207, // Sử dụng 207 Multi-Status cho thành công một phần
          headers,
        }
      )
    }

    // Xử lý xóa đơn lẻ
    if (!postId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể xác định ID bài viết từ yêu cầu',
          errorType: 'validation',
        },
        {
          status: 400,
          headers,
        }
      )
    }
    
    try {
      // Bỏ qua việc kiểm tra post tồn tại trước khi xóa
      // Thay vào đó, cố gắng xóa trực tiếp và xử lý lỗi nếu có
      try {
        const deletedPost = await payload.delete({
          collection: 'posts',
          id: postId,
          // Đảm bảo hooks afterDelete được kích hoạt đúng cách
          context: {
            disableRevalidate: false, // Đảm bảo revalidation xảy ra
            isFromAPI: true, // Đánh dấu rằng request đến từ API tùy chỉnh
          }
        }).catch(error => {
          // Xử lý lỗi NotFound một cách đặc biệt - coi là xóa thành công
          if (error?.status === 404) {
            console.log(`Post with ID ${postId} already not exists, considering deletion successful`);
            return { id: postId, success: true, status: 'not_found_but_success' };
          }
          throw error; // Ném lại các lỗi khác
        });

        // Ghi log xóa thành công
        console.log(`Successfully deleted post with ID: ${postId}`);

        // Kiểm tra nếu yêu cầu từ admin panel và định dạng phản hồi phù hợp
        if (isAdminRequest) {
          // Định dạng phản hồi tương tự cấu trúc mong đợi của Payload CMS cho admin
          console.log('Returning admin-compatible response format');
          return NextResponse.json(
            { 
              ...deletedPost,
              message: `Đã xóa bài viết thành công với ID: ${postId}`
            },
            {
              status: 200,
              headers,
            }
          );
        }
        
        // Phản hồi API tiêu chuẩn cho các yêu cầu không từ admin
        return NextResponse.json(
          {
            success: true,
            message: `Đã xóa bài viết thành công với ID: ${postId}`,
            data: { id: postId }
          },
          {
            status: 200,
            headers,
          }
        );
      } catch (err: any) {
        // Xử lý lỗi khi xóa
        throw err;
      }
    } catch (err: any) {
      console.error(`Error deleting post ${postId}:`, err);
      
      // Kiểm tra nếu yêu cầu từ admin panel và định dạng phản hồi lỗi phù hợp
      if (isAdminRequest) {
        // Định dạng lỗi tương thích với admin
        console.log('Returning admin-compatible error format');
        // Admin panel thường mong đợi cấu trúc này
        return NextResponse.json(
          {
            errors: [
              {
                message: err.message || 'Lỗi khi xóa bài viết',
                name: 'DeleteError',
              }
            ],
          },
          {
            status: 400, // Admin UI có xu hướng xử lý 400 tốt hơn 500
            headers,
          }
        );
      }
      
      // Phản hồi lỗi API tiêu chuẩn
      return NextResponse.json(
        {
          success: false,
          message: `Lỗi khi xóa bài viết với ID: ${postId}`,
          error: err.message || 'Lỗi không xác định',
          errorDetail: err.toString(),
          errorType: 'serverError',
        },
        {
          status: 500,
          headers,
        }
      );
    }
  } catch (error) {
    console.error('Posts DELETE API Error:', error);
    const headers = createCorsHeaders();
    
    // Kiểm tra nếu yêu cầu từ admin panel
    const referer = req.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');
    
    if (isAdminRequest) {
      // Định dạng lỗi tương thích với admin
      console.log('Returning admin-compatible general error format');
      return NextResponse.json(
        {
          errors: [
            {
              message: (error as any)?.message || 'Lỗi khi xóa bài viết',
              name: 'GeneralError',
            }
          ],
        },
        {
          status: 400,
          headers,
        }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi xử lý yêu cầu xoá bài viết',
        error: (error as any)?.message || 'Lỗi không xác định',
        errorType: 'serverError',
      },
      {
        status: 500,
        headers,
      }
    );
  }
}

/**
 * Handle PATCH requests for publishing/unpublishing posts
 * 
 * PATCH /api/posts?id=123456
 * PATCH /api/posts?where[and][0][_status][not_equals]=draft&where[and][1][id][in][0]=123456
 * PATCH /api/posts?where[and][0][_status][not_equals]=published&where[and][1][id][in][0]=123456&draft=true
 */
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  console.log('PATCH /api/posts: Request received');
  console.log('Request URL:', req.url);
  console.log('Referer:', req.headers.get('referer'));
  
  try {
    // Special handling for admin panel requests
    const referer = req.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');
    
    if (isAdminRequest) {
      console.log('Detected admin panel request for post status update');
    }
    
    // Require authentication with bypass for admin
    const isAuthenticated = await checkAuth(req, !isAdminRequest);
    if (!isAuthenticated && !isAdminRequest) {
      const headers = createCorsHeaders();
      return NextResponse.json(
        {
          success: false,
          message: 'Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.',
          errorType: 'authentication',
        },
        {
          status: 401,
          headers,
        }
      );
    }
    
    // Initialize Payload
    const payload = await getPayload({
      config,
    });
    
    const headers = createCorsHeaders();
    
    // Extract post ID using the helper function
    const { postId, postIds } = await extractPostIds(req);
    
    // Parse the request body for update data
    const json = await req.json().catch(() => ({}));
    
    // Check if we're dealing with a publish/unpublish operation
    const url = new URL(req.url);
    const isDraftParam = url.searchParams.get('draft');
    const isDraft = isDraftParam === 'true';
    
    // Check for complex status query param patterns
    const isPublishOperation = url.toString().includes('_status%5D%5Bnot_equals%5D=draft');
    const isUnpublishOperation = url.toString().includes('_status%5D%5Bnot_equals%5D=published');
    
    console.log('Status operation details:', { 
      isDraft, 
      isPublishOperation, 
      isUnpublishOperation,
      postId,
      postIds: postIds.length > 0 ? postIds : undefined
    });
    
    // Determine the target post ID
    let targetId = postId;
      // If no direct ID, check complex query patterns
    if (!targetId && postIds.length > 0) {
      targetId = postIds[0] || null;
    }
    
    if (!targetId && isAdminRequest) {
      // Try to extract ID from complex query params that Payload admin might use
      for (const [key, value] of url.searchParams.entries()) {
        if (key.includes('id') && key.includes('in')) {
          targetId = value;
          console.log(`Extracted post ID from complex query: ${value}`);
          break;
        }
      }
    }
    
    // If still no ID found, return error
    if (!targetId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không thể xác định ID bài viết từ yêu cầu',
          errorType: 'validation',
        },
        {
          status: 400,
          headers,
        }
      );
    }
    
    // Find the post first to get current status
    try {
      const post = await payload.findByID({
        collection: 'posts',
        id: targetId,
        depth: 0
      }).catch(() => null);
      
      if (!post) {
        return NextResponse.json(
          {
            success: false,
            message: `Không tìm thấy bài viết với ID: ${targetId}`,
            errorType: 'notFound',
          },
          {
            status: 404,
            headers,
          }
        );
      }
      
      // Determine status update operation
      const statusUpdate = json.status || (isDraft ? 'draft' : (isPublishOperation ? 'published' : undefined));
      console.log('Status update:', statusUpdate);
      
      // Prepare update data
      const updateData: Record<string, any> = { 
        ...json
      };
      
      if (statusUpdate) {
        updateData.status = statusUpdate;
      }
      
      // Execute the update
      const updatedPost = await payload.update({
        collection: 'posts',
        id: targetId,
        data: updateData,
      });
      
      // Log successful update
      const statusMessage = statusUpdate === 'published' ? 'xuất bản' : 
                          (statusUpdate === 'draft' ? 'lưu nháp' : 'cập nhật');
      console.log(`Successfully ${statusMessage} post: ${updatedPost.title || targetId}`);
      
      // Format response depending on the source of the request
      if (isAdminRequest) {
        console.log('Returning admin-compatible response format');
        return NextResponse.json(
          updatedPost,
          {
            status: 200,
            headers,
          }
        );
      }
      
      // Standard API response for non-admin requests
      return NextResponse.json(
        {
          success: true,
          message: `Đã ${statusMessage} bài viết thành công: ${updatedPost.title || targetId}`,
          data: updatedPost
        },
        {
          status: 200,
          headers,
        }
      );
    } catch (err: any) {
      console.error(`Error updating post ${targetId}:`, err);
      
      // Check if request is from admin panel and format response accordingly
      if (isAdminRequest) {
        console.log('Returning admin-compatible error format');
        return NextResponse.json(
          {
            errors: [
              {
                message: err.message || 'Lỗi khi cập nhật bài viết',
                name: 'UpdateError',
              }
            ],
          },
          {
            status: 400, // Admin UI tends to handle 400 better than 500
            headers,
          }
        );
      }
      
      // Standard API error response
      return NextResponse.json(
        {
          success: false,
          message: `Lỗi khi cập nhật bài viết với ID: ${targetId}`,
          error: err.message || 'Lỗi không xác định',
          errorType: 'serverError',
        },
        {
          status: 500,
          headers,
        }
      );
    }
  } catch (error) {
    console.error('Posts PATCH API Error:', error);
    const headers = createCorsHeaders();
    
    // Check if request is from admin panel
    const referer = req.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');
    
    if (isAdminRequest) {
      // Format admin compatible error
      console.log('Returning admin-compatible general error format');
      return NextResponse.json(
        {
          errors: [
            {
              message: (error as any)?.message || 'Lỗi khi cập nhật bài viết',
              name: 'GeneralError',
            }
          ],
        },
        {
          status: 400,
          headers,
        }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi xử lý yêu cầu cập nhật bài viết',
        error: (error as any)?.message || 'Lỗi không xác định',
        errorType: 'serverError',
      },
      {
        status: 500,
        headers,
      }
    );
  }
}

/**
 * Create a new post
 * 
 * POST /api/posts
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/posts: Request received');
  const _url = new URL(req.url); 
  const referer = req.headers.get('referer') || '';
  const isAdminRequest = referer.includes('/admin');
  const headers = createCorsHeaders();

  try {
    const payload = await getPayload({ config });

    const isAuthenticated = await checkAuth(req, !isAdminRequest);
    if (!isAuthenticated && !isAdminRequest) {
      return NextResponse.json(
        {
          success: false,
          message: 'Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.',
          errorType: 'authentication',
        },
        { status: 401, headers },
      );
    }

    if (isAdminRequest) {
      console.log('Detected admin panel request for POST /api/posts');
      let requestBody;      try {
        requestBody = await req.json();
      } catch (_e) {
        requestBody = null; 
        console.log('Admin request: JSON parsing failed or body is empty/malformed.');
      }

      const isQueryOperation =
        requestBody === null ||
        (requestBody &&
          (typeof requestBody.where !== 'undefined' ||
            typeof requestBody.page !== 'undefined' ||
            typeof requestBody.limit !== 'undefined' ||
            typeof requestBody.sort !== 'undefined') &&
          typeof requestBody.title === 'undefined'); // Assuming 'title' is mandatory for create

      if (isQueryOperation) {
        console.log('Admin POST request identified as a query operation for relationship options.');
        const page = Number(requestBody?.page) || 1;
        const limit = Number(requestBody?.limit) || 30; 
        const sortField = typeof requestBody?.sort === 'string' ? requestBody.sort.trim() : 'createdAt';        const sortOrder = typeof requestBody?.order === 'string' && requestBody.order.toLowerCase() === 'desc' ? 'desc' : 'asc';
        const sort = sortOrder === 'desc' ? `-${sortField.replace(/^-/, '')}` : sortField.replace(/^-/, '');
        
        const query: any = requestBody?.where || {};

        if (typeof requestBody?.search === 'string' && requestBody.search.trim() !== '') {
          query.or = query.or || [];
          query.or.push({ title: { like: requestBody.search.trim() } });
        }
        
        console.log('Admin query object for posts lookup:', JSON.stringify({ where: query, page, limit, sort }, null, 2));

        try {
          const results = await payload.find({
            collection: 'posts',
            where: query,
            page,
            limit,
            depth: 1, 
            sort,
          });
          return NextResponse.json(results, { status: 200, headers });
        } catch (error) {
          console.error('Admin POST (as query) Error:', error);
          return NextResponse.json(
            { errors: [{ message: `Error fetching posts for lookup: ${(error as Error).message}` }] },
            { status: 500, headers },
          );
        }
      } else { 
        console.log('Admin POST request identified as a create operation.');
        if (!requestBody) {
          return NextResponse.json(
            { errors: [{ message: 'Missing request body for post creation.', name: 'ValidationError' }] },
            { status: 400, headers },
          );
        }
        if (!requestBody.title) {
          return NextResponse.json(
            { errors: [{ message: 'Tiêu đề bài viết là bắt buộc.', name: 'ValidationError' }] },
            { status: 400, headers },
          );
        }
        
        const newPost = await payload.create({
          collection: 'posts',
          data: requestBody,
          context: { isFromAPI: true, isAdminRequest: true },
        });
        console.log(`Admin successfully created post with ID: ${newPost.id}`);
        return NextResponse.json(newPost, { status: 201, headers });
      }
    } else { 
      console.log('Client API POST request for post creation.');
      const clientJsonPayload = await req.json().catch(() => {
        throw new Error('Invalid JSON in request body'); 
      });

      if (!clientJsonPayload) {
        return NextResponse.json(
          { success: false, message: 'Dữ liệu bài viết không hợp lệ hoặc thiếu', errorType: 'validation' },
          { status: 400, headers },
        );
      }
      if (!clientJsonPayload.title) {
        return NextResponse.json(
          { success: false, message: 'Tiêu đề bài viết là bắt buộc', errorType: 'validation' },
          { status: 400, headers },
        );
      }
      
      const newPost = await payload.create({
        collection: 'posts',
        data: clientJsonPayload,
        context: { isFromAPI: true },
      });
      console.log(`Client API successfully created post with ID: ${newPost.id}`);
      return NextResponse.json(
        { success: true, message: 'Đã tạo bài viết thành công', data: newPost },
        { status: 201, headers },
      );
    }
  } catch (error: any) { 
    console.error('Posts POST API General Error:', error);

    if (error.message === 'Invalid JSON in request body' && !isAdminRequest) {
        return NextResponse.json(
            { success: false, message: 'Invalid JSON in request body', errorType: 'validation' },
            { status: 400, headers }
          );
    }

    if (isAdminRequest) {
      return NextResponse.json(
        { errors: [{ message: error.message || 'Lỗi máy chủ nội bộ khi xử lý yêu cầu POST.', name: 'ServerError' }] },
        { status: (error as any).status || 500, headers },
      );
    }
    return NextResponse.json(
      { success: false, message: 'Lỗi máy chủ nội bộ', error: error.message, errorType: 'serverError' },
      { status: 500, headers },
    );
  }
}
