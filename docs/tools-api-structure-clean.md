# Tools API Structure - Cleaned Up

## **Tình trạng trước khi clean up:**
❌ **MESSY** - Có 5+ API routes duplicate cho tools:
- `/api/tools` - PayloadCMS admin API
- `/api/public-tools` - Public tools API (DUPLICATE)
- `/api/debug-tools` - Debug/seeding API (CHỈ DÙNG DEV)
- `/api/search/tools-resources` - Search tools và resources
- `/api/related-tools` - Related tools cho admin form

## **Sau khi clean up:**
✅ **CLEAN** - Còn lại 3 API routes với mục đích rõ ràng:

### 1. **Main Tools API** - `/api/tools`
**File:** `backend/src/app/(payload)/api/tools/route.ts`
**Mục đích:** API chính cho CRUD tools, hỗ trợ cả admin và public
**Methods:** GET, POST, DELETE, OPTIONS
**Features:**
- Auto-detect admin vs public requests
- Full CRUD operations
- Advanced filtering (category, featured, toolType, difficulty)
- Search functionality
- Pagination
- Sorting
- Single tool by ID hoặc slug

**Examples:**
```
GET /api/tools                          # List all tools (public: published only)
GET /api/tools?admin=true               # Admin: all tools including drafts
GET /api/tools?id=123                   # Single tool by ID
GET /api/tools?slug=example-tool        # Single tool by slug
GET /api/tools?category=development     # Filter by category
GET /api/tools?featured=true            # Featured tools only
GET /api/tools?search=keyword           # Search tools
GET /api/tools?page=2&limit=20          # Pagination
POST /api/tools                         # Create new tool (admin)
DELETE /api/tools?id=123                # Delete tool (admin)
```

### 2. **Search API** - `/api/search/tools-resources`
**File:** `backend/src/app/api/search/tools-resources/route.ts`
**Mục đích:** Combined search cho tools VÀ resources
**Methods:** GET
**Features:**
- Search across tools and resources collections
- Type filtering ('tools', 'resources', 'all')
- Unified search results

**Examples:**
```
GET /api/search/tools-resources?q=keyword&type=tools     # Search tools only
GET /api/search/tools-resources?q=keyword&type=all       # Search both
```

### 3. **Related Tools API** - `/api/related-tools`
**File:** `backend/src/app/(payload)/api/related-tools/route.ts`
**Mục đích:** Lấy related tools cho admin form (relationship field)
**Methods:** GET, OPTIONS
**Features:**
- Exclude current tool
- Search by name
- Pagination for large datasets

**Examples:**
```
GET /api/related-tools?excludeId=123    # All tools except ID 123
GET /api/related-tools?search=keyword   # Search related tools
```

## **Đã xóa (DUPLICATE/UNNECESSARY):**
❌ `backend/src/app/api/public-tools/` - DUPLICATE với main tools API
❌ `backend/src/app/api/debug-tools/` - Chỉ dùng development, không cần production
❌ `backend/src/app/(payload)/api/admin/tools/` - DUPLICATE, đã xóa trước đó

## **Benefits của structure mới:**
1. **DRY Principle** - Không duplicate code
2. **Single Responsibility** - Mỗi API có mục đích rõ ràng
3. **Maintainable** - Dễ maintain và extend
4. **Consistent** - Unified response format
5. **Flexible** - Main API handle cả admin và public use cases

## **Frontend Integration:**
- **Frontend public pages:** Sử dụng `/api/tools` (auto-detects public mode)
- **Admin panel:** Sử dụng `/api/tools` (auto-detects admin mode)
- **Search functionality:** Sử dụng `/api/search/tools-resources`
- **Admin relationship fields:** Sử dụng `/api/related-tools`

## **Next Steps:**
1. ✅ Clean up duplicate APIs
2. ⏳ Test PayloadCMS admin panel saving tools
3. ⏳ Update frontend references if needed
4. ⏳ Update documentation
