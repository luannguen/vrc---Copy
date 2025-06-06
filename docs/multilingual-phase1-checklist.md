# VRC Multilingual Implementation - Phase 1 Checklist

## 🎯 Phase 1: Backend Foundation (Tuần 1-2)

### ✅ Week 1 Tasks: PayloadCMS Localization Setup

#### 1. Install Dependencies
```bash
cd backend
pnpm install @payloadcms/translations
```

#### 2. Update payload.config.ts
- [ ] Import translation packages
- [ ] Add i18n configuration
- [ ] Add localization configuration  
- [ ] Test admin interface

#### 3. Files to Create/Modify

**New files:**
- [ ] `backend/src/config/multilingual.config.ts` - Centralized multilingual config
- [ ] `backend/src/translations/vi.ts` - Vietnamese custom translations
- [ ] `backend/src/translations/en.ts` - English custom translations
- [ ] `backend/src/translations/tr.ts` - Turkish custom translations

**Modified files:**
- [ ] `backend/src/payload.config.ts` - Add localization support
- [ ] `backend/package.json` - Add new dependencies

#### 4. Testing Checklist
- [ ] Admin interface shows language switcher
- [ ] Can switch between vi/en/tr in admin
- [ ] No console errors after changes
- [ ] Admin UI translations work correctly

---

### ✅ Week 2 Tasks: Core Collections Migration

#### 1. Products Collection
- [ ] Add `localized: true` to name field
- [ ] Add `localized: true` to description field
- [ ] Add `localized: true` to excerpt field
- [ ] Test API response with locale parameter

#### 2. Posts Collection  
- [ ] Add `localized: true` to title field
- [ ] Add `localized: true` to content field
- [ ] Add `localized: true` to excerpt field
- [ ] Update SEO fields for localization

#### 3. Services Collection
- [ ] Add `localized: true` to name field
- [ ] Add `localized: true` to description field
- [ ] Add `localized: true` to details field

#### 4. API Testing
- [ ] Test GET `/api/products?locale=vi`
- [ ] Test GET `/api/products?locale=en`
- [ ] Test GET `/api/products?locale=tr`
- [ ] Test fallback when translation missing
- [ ] Test API performance with localization

---

## 🔧 Implementation Commands

### 1. Install Dependencies
```bash
cd backend
pnpm install @payloadcms/translations
```

### 2. Start Development Server
```bash
cd backend
npm run dev
```

### 3. Test API Endpoints
```bash
# Test Vietnamese (default)
curl "http://localhost:3000/api/products?locale=vi"

# Test English  
curl "http://localhost:3000/api/products?locale=en"

# Test Turkish
curl "http://localhost:3000/api/products?locale=tr"
```

---

## ✅ Success Criteria

### Week 1 Success Criteria
- [x] @payloadcms/translations package installed successfully
- [ ] payload.config.ts updated with i18n and localization config
- [ ] Admin interface displays in Vietnamese (default)
- [ ] Can switch admin language to English/Turkish
- [ ] No breaking changes to existing functionality

### Week 2 Success Criteria  
- [ ] Products API returns localized content based on locale parameter
- [ ] Posts API returns localized content
- [ ] Services API returns localized content
- [ ] Fallback to Vietnamese when translation missing
- [ ] Database structure supports multilingual content

---

## 🚨 Common Issues & Solutions

### Issue 1: Package Installation Error
**Problem**: `@payloadcms/translations` not found
**Solution**: Check Payload CMS version compatibility, use correct package name

### Issue 2: Admin Interface Not Switching Languages
**Problem**: Language switcher not appearing
**Solution**: Verify i18n config is properly imported and configured

### Issue 3: API Not Returning Localized Content
**Problem**: Same content returned regardless of locale parameter  
**Solution**: Ensure collections have `localized: true` on appropriate fields

### Issue 4: Database Migration Issues
**Problem**: Existing data not compatible with localization
**Solution**: Run migration script to convert single-language data to multilingual structure

---

## 📝 Notes

- Always backup database before making structural changes
- Test each step thoroughly before moving to next
- Document any custom modifications for future reference
- Keep track of performance impact after each implementation

---

**Updated**: December 5, 2024  
**Phase**: 1 of 4  
**Status**: Ready to implement
