# Debug Scripts Collection

Tập hợp các script debug cho VRC Backend API

## 📁 **CÁC FILE DEBUG**

### 🔗 **debug-relationship.js**
- **Mục đích**: Test relationship field trong Technologies collection
- **Chức năng**: Kiểm tra API Technologies, Products và test update relationship
- **Sử dụng**: `node debug/debug-relationship.js`

### 🧪 **api-test-all.js**
- **Mục đích**: Test tất cả API endpoints
- **Chức năng**: Kiểm tra toàn bộ collections và globals APIs
- **Sử dụng**: `node debug/api-test-all.js`

### 📋 **check-schemas.js**
- **Mục đích**: Kiểm tra cấu hình collection schemas
- **Chức năng**: Verify các collection configs và relationship fields
- **Sử dụng**: `node debug/check-schemas.js`

### 🏥 **health-check.js**
- **Mục đích**: Kiểm tra tình trạng server và database
- **Chức năng**: Health check cho server, MongoDB, và critical APIs
- **Sử dụng**: `node debug/health-check.js`

## 🚀 **CÁCH SỬ DỤNG**

### **Chạy từng script riêng lẻ:**
```bash
# Test relationship fields
node debug/debug-relationship.js

# Test all APIs
node debug/api-test-all.js

# Check collection schemas
node debug/check-schemas.js

# Health check
node debug/health-check.js
```

### **Chạy tất cả debug scripts:**
```bash
# Tạo script chạy tất cả (sẽ tạo sau)
node debug/run-all.js
```

## 📊 **OUTPUT MẪU**

### **Khi API hoạt động bình thường:**
```
✅ Server is running
📊 Products: 2 records
🔗 Technologies: 3 records
✅ All relationship fields working
```

### **Khi có vấn đề:**
```
❌ Server not accessible
💥 Database connection error
⚠️  API endpoint not responding
```

## 🎯 **KHI NÀO SỬ DỤNG**

- **Sau khi thay đổi collection config**: Chạy `check-schemas.js`
- **Khi API có vấn đề**: Chạy `health-check.js`
- **Test tính năng relationship**: Chạy `debug-relationship.js`
- **Kiểm tra tổng quát**: Chạy `api-test-all.js`

## 💡 **LƯU Ý**

- Server phải đang chạy ở `localhost:3000`
- Các script sử dụng `fetch()` API (Node.js 18+)
- Output có màu sắc và emoji để dễ đọc
- Tự động handle lỗi và network issues
