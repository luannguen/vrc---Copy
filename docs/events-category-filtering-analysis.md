# VRC Events Category Filtering Analysis

## 📊 **HIỆN TRẠNG FRONTEND:**

### **Events.tsx (Line 95-120):**
- Có **categories data** với count hardcoded:
```typescript
const categories = [
  { name: "Triển lãm", count: 8 },
  { name: "Hội thảo", count: 12 },
  { name: "Đào tạo", count: 15 },
  { name: "Ra mắt sản phẩm", count: 6 },
  { name: "Diễn đàn", count: 5 },
  { name: "Hội nghị", count: 10 }
];
```

### **useEventsFilters Hook:**
- Có `filters` state và `updateFilter` function
- Nhưng **CHƯA có filter theo category**
- EventsApiParams **CHƯA có field category**

### **EventsApi.getEvents():**
- Chỉ support: `limit`, `page`, `status`, `featured`, `eventType`
- **THIẾU category filtering**

## 🔍 **VẤN ĐỀ CẦN FIX:**

### **1. Backend API:**
- ❌ Events API chưa hỗ trợ filter theo category
- ❌ Không có endpoint để count events per category
- ❌ Payload CMS filtering chưa được implement

### **2. Frontend:**
- ❌ EventsApiParams thiếu field `category`
- ❌ EventsApi.getEvents() chưa pass category param
- ❌ useEventsFilters chưa có category state
- ❌ UI chưa có category selector/filter

### **3. Logic counting:**
- ❌ Categories count hiện tại là hardcoded
- ❌ Không sync với database thực tế

## 🎯 **CẦN IMPLEMENT:**

### **Backend:**
1. **Custom Events API endpoint** với category filtering
2. **Events count per category** endpoint
3. **Query optimization** cho filtering

### **Frontend:**
1. **Category filtering UI** trong Events page
2. **Dynamic category counts** từ API
3. **Filter state management** cho category
4. **URL params** để maintain filter state

## 📝 **IMPLEMENTATION PLAN:**

### **Phase 1: Backend API Enhancement**
- Thêm category filtering vào Events API
- Tạo endpoint `/api/events/count-by-category`
- Test filtering functionality

### **Phase 2: Frontend Integration**
- Update EventsApiParams interface
- Add category filter to useEventsFilters hook
- Implement category selector UI
- Connect với dynamic counts

### **Phase 3: UX Enhancement**
- URL state management
- Loading states
- Empty states for filtered results
- Category-based deep linking
