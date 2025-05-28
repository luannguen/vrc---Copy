# Hướng dẫn sửa lỗi API xóa post

## Vấn đề gặp phải

API xóa post đã gặp vấn đề khi được gọi từ giao diện Admin Panel của Payload CMS. Mặc dù API trả về mã HTTP 200, nhưng post không bị xóa khỏi cơ sở dữ liệu hoặc giao diện admin không cập nhật đúng để phản ánh thay đổi.

Các vấn đề cụ thể đã được xác định:

1. **Định dạng query phức tạp**: Admin Panel gửi yêu cầu xóa với định dạng query `where[and][1][id][in][0]=682d4bf298445d3db25d1f29` không được xử lý đúng cách.
2. **Xung đột API tùy chỉnh và API nội bộ**: API tùy chỉnh không xử lý đúng yêu cầu từ admin panel.
3. **Thiếu kích hoạt hooks**: Hooks `afterDelete` không được kích hoạt đúng khi xóa qua API tùy chỉnh.
4. **Định dạng phản hồi sai**: Phản hồi từ API tùy chỉnh không tuân thủ định dạng mà Payload CMS mong đợi.
5. **Lỗi xử lý post không tồn tại**: Khi post không tồn tại trong cơ sở dữ liệu (đã bị xóa trước đó), API vẫn báo lỗi thay vì trả về thành công.

## Giải pháp đã thực hiện

### 1. Cải thiện việc trích xuất ID từ query phức tạp

File: `src/app/(payload)/api/_shared/extractPostIds.ts`

```typescript
// Trường hợp 1: where[and][1][id][in][0]=123456
for (const [key, value] of url.searchParams.entries()) {
  if (key.match(/where\[\w+\]\[\d+\]\[id\]\[in\]\[\d+\]/) && value) {
    console.log(`Extracted post ID from admin panel query format: ${value}`);
    singleId = value;
    ids.add(value);
  }
}

// Trường hợp 2: where[id][in][0]=123456
for (const [key, value] of url.searchParams.entries()) {
  if (key.match(/where\[id\]\[in\]\[\d+\]/) && value) {
    console.log(`Extracted post ID from admin panel simplified query: ${value}`);
    singleId = value;
    ids.add(value);
  }
}

// Trường hợp 3: where[id][equals]=123456
for (const [key, value] of url.searchParams.entries()) {
  if (key === 'where[id][equals]' && value) {
    console.log(`Extracted post ID from equals query: ${value}`);
    singleId = value;
    ids.add(value);
  }
}
```

Điều này cải thiện việc xử lý định dạng query phức tạp từ admin panel bằng cách thêm các kiểm tra regex cụ thể cho các mẫu khác nhau.

### 2. Đảm bảo hooks được kích hoạt đúng và xử lý lỗi "Not Found"

File: `src/app/(payload)/api/posts/route.ts`

```typescript
// Cố gắng xóa post dù nó có tồn tại hay không
const deletedPost = await payload.delete({
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
```

Bằng cách truyền `context` phù hợp vào phương thức `delete` của Payload, chúng ta đảm bảo rằng hooks `afterDelete` sẽ được kích hoạt đúng cách. Đặc biệt, chúng ta cũng xử lý trường hợp post không tồn tại như một trường hợp xóa thành công, thay vì báo lỗi.

### 3. Tuân thủ định dạng phản hồi của Payload CMS

File: `src/app/(payload)/api/posts/route.ts`

```typescript
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
```

Đoạn code này đảm bảo rằng phản hồi được trả về cho admin panel có định dạng đúng để cập nhật UI.

### 4. Xác định rõ hơn yêu cầu từ admin panel

File: `src/app/(payload)/api/posts/route.ts`

```typescript
// Special handling for admin panel requests
const referer = req.headers.get('referer') || '';
const isAdminRequest = referer.includes('/admin');

if (isAdminRequest) {
  console.log('Detected admin panel request for post deletion');
}
```

Bằng cách phát hiện yêu cầu từ admin panel dựa trên header `referer`, chúng ta có thể áp dụng xử lý đặc biệt và tuân thủ các định dạng phản hồi cần thiết.

## Kiểm tra và xác minh

Để đảm bảo những thay đổi hoạt động đúng, một tệp kiểm tra đã được cập nhật:

File: `test/test-post-delete.js`

Các kiểm tra bao gồm:
1. Tạo các bài post thử nghiệm
2. Kiểm tra xóa đơn lẻ
3. **Kiểm tra xóa với định dạng query từ admin panel**
4. Kiểm tra xóa hàng loạt
5. Xác minh bài post đã bị xóa khỏi cơ sở dữ liệu

## Cách chạy kiểm tra

```bash
node test/test-post-delete.js
```

## Kết luận

Những thay đổi này đã giải quyết vấn đề API xóa post không hoạt động đúng khi được gọi từ admin panel. Giải pháp tập trung vào:

1. Xử lý đúng định dạng query phức tạp
2. Đảm bảo hooks được kích hoạt đúng cách
3. Tuân thủ định dạng phản hồi mà Payload CMS mong đợi
4. Cải thiện xử lý lỗi và logging
5. **Xử lý tốt trường hợp post không tồn tại**: Coi như xóa thành công khi post không tìm thấy, thay vì báo lỗi

Những cải tiến này giúp cho tính năng xóa post hoạt động mượt mà và đáng tin cậy, đồng thời cung cấp thông báo lỗi rõ ràng khi có vấn đề xảy ra.
