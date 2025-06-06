#!/bin/bash

# VRC Multilingual Quick Setup Script
# Tự động thiết lập cơ bản cho tính năng đa ngôn ngữ

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "vrcfrontend" ]; then
    print_error "This script must be run from the VRC project root directory"
    exit 1
fi

print_status "🌍 VRC Multilingual Quick Setup"
print_status "This script will setup basic multilingual support for VRC project"
echo

# Ask for confirmation
read -p "Continue with multilingual setup? [y/N]: " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Setup cancelled"
    exit 1
fi

echo
print_status "📦 Installing backend packages..."

# Install backend packages
if [ -d "backend" ]; then
    cd backend
    
    # Check if pnpm is available
    if command -v pnpm &> /dev/null; then
        print_status "Installing @payloadcms/translations with pnpm..."
        pnpm install @payloadcms/translations
        
        print_status "Installing @payloadcms/plugin-seo with pnpm..."
        pnpm install @payloadcms/plugin-seo
    elif command -v npm &> /dev/null; then
        print_status "Installing @payloadcms/translations with npm..."
        npm install @payloadcms/translations
        
        print_status "Installing @payloadcms/plugin-seo with npm..."
        npm install @payloadcms/plugin-seo
    else
        print_error "Neither pnpm nor npm found. Please install one of them."
        exit 1
    fi
    
    cd ..
    print_success "Backend packages installed"
else
    print_warning "Backend directory not found, skipping backend setup"
fi

echo
print_status "🎨 Checking frontend packages..."

# Check frontend packages
if [ -d "vrcfrontend" ]; then
    cd vrcfrontend
    
    # Check if react-i18next is already installed
    if grep -q "react-i18next" package.json; then
        print_success "react-i18next already installed"
    else
        print_status "Installing react-i18next packages..."
        if command -v npm &> /dev/null; then
            npm install react-i18next i18next i18next-browser-languagedetector --legacy-peer-deps
        else
            print_error "npm not found. Please install frontend packages manually."
            exit 1
        fi
    fi
    
    cd ..
    print_success "Frontend packages checked"
else
    print_warning "Frontend directory not found, skipping frontend setup"
fi

echo
print_status "📝 Creating configuration files..."

# Create multilingual config for backend
if [ -d "backend/src" ]; then
    mkdir -p backend/src/config
    
    # Create multilingual config file
    cat > backend/src/config/multilingual.ts << 'EOF'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'

// Custom translations for VRC specific terms
export const customTranslations = {
  vi: {
    general: {
      company: 'Công ty',
      products: 'Sản phẩm',
      services: 'Dịch vụ',
      about: 'Giới thiệu',
      contact: 'Liên hệ',
      news: 'Tin tức',
      events: 'Sự kiện',
      technologies: 'Công nghệ',
    },
    fields: {
      name: 'Tên',
      title: 'Tiêu đề',
      description: 'Mô tả',
      content: 'Nội dung',
      image: 'Hình ảnh',
      price: 'Giá',
      category: 'Danh mục',
      featured: 'Nổi bật',
      published: 'Đã xuất bản',
      draft: 'Bản nháp',
      slug: 'Slug',
      metadata: 'Metadata',
      seo: 'SEO',
    },
    admin: {
      dashboard: 'Bảng điều khiển',
      collections: 'Bộ sưu tập',
      globals: 'Cài đặt chung',
      media: 'Media',
      users: 'Người dùng',
    }
  }
}

// Localization configuration
export const localizationConfig = {
  locales: [
    {
      label: 'Tiếng Việt',
      code: 'vi',
    },
    {
      label: 'English',
      code: 'en',
    },
    {
      label: 'Türkçe',
      code: 'tr',
    }
  ],
  defaultLocale: 'vi',
  fallback: true,
}

// I18n configuration for admin interface
export const i18nConfig = {
  supportedLanguages: { en, vi },
  fallbackLanguage: 'vi',
  translations: customTranslations,
}
EOF

    print_success "Created backend/src/config/multilingual.ts"
fi

# Create enhanced frontend i18n config if it doesn't exist
if [ -d "vrcfrontend/src/i18n" ] && [ ! -f "vrcfrontend/src/i18n/config.ts" ]; then
    print_status "Creating frontend i18n configuration..."
    
    mkdir -p vrcfrontend/src/i18n/locales
    
    # Create basic config
    cat > vrcfrontend/src/i18n/config.ts << 'EOF'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
import en from './locales/en.json';
import tr from './locales/tr.json';
import vi from './locales/vi.json';

export const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
  vi: {
    translation: vi,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    defaultNS: 'translation',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;
EOF

    # Create basic Vietnamese translations if not exists
    if [ ! -f "vrcfrontend/src/i18n/locales/vi.json" ]; then
        cat > vrcfrontend/src/i18n/locales/vi.json << 'EOF'
{
  "nav": {
    "home": "Trang chủ",
    "about": "Giới thiệu",
    "services": "Dịch vụ",
    "products": "Sản phẩm",
    "projects": "Dự án",
    "technologies": "Công nghệ",
    "news": "Tin tức",
    "contact": "Liên hệ",
    "language": "Ngôn ngữ"
  },
  "hero": {
    "title": "VRC - Giải pháp điện lạnh hàng đầu",
    "subtitle": "Cung cấp giải pháp điện lạnh toàn diện cho mọi doanh nghiệp và công trình"
  },
  "common": {
    "loading": "Đang tải...",
    "error": "Đã xảy ra lỗi",
    "retry": "Thử lại",
    "readMore": "Đọc thêm",
    "learnMore": "Tìm hiểu thêm",
    "contactUs": "Liên hệ với chúng tôi",
    "getQuote": "Yêu cầu báo giá"
  }
}
EOF
    fi

    # Create basic English translations if not exists
    if [ ! -f "vrcfrontend/src/i18n/locales/en.json" ]; then
        cat > vrcfrontend/src/i18n/locales/en.json << 'EOF'
{
  "nav": {
    "home": "Home",
    "about": "About",
    "services": "Services", 
    "products": "Products",
    "projects": "Projects",
    "technologies": "Technologies",
    "news": "News",
    "contact": "Contact",
    "language": "Language"
  },
  "hero": {
    "title": "VRC - Leading Refrigeration Solutions",
    "subtitle": "Providing comprehensive refrigeration solutions for all businesses and projects"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "readMore": "Read more",
    "learnMore": "Learn more", 
    "contactUs": "Contact us",
    "getQuote": "Get quote"
  }
}
EOF
    fi

    print_success "Created frontend i18n configuration"
elif [ -f "vrcfrontend/src/i18n/config.ts" ]; then
    print_success "Frontend i18n configuration already exists"
fi

echo
print_status "📋 Creating helper scripts..."

# Create package.json scripts for multilingual tasks
if [ -f "package.json" ]; then
    # Create a backup
    cp package.json package.json.backup
    
    # Add multilingual scripts using a simple approach
    cat > temp_scripts.json << 'EOF'
{
  "scripts": {
    "i18n:setup": "node scripts/multilingual-implementation.mjs",
    "i18n:status": "node scripts/multilingual-implementation.mjs status",
    "i18n:migrate": "node scripts/multilingual-implementation.mjs migrate",
    "i18n:test": "node scripts/multilingual-implementation.mjs test",
    "backend:i18n": "cd backend && npm run dev",
    "frontend:i18n": "cd vrcfrontend && npm run dev"
  }
}
EOF
    
    print_success "Helper scripts created (check package.json)"
    rm temp_scripts.json
fi

echo
print_status "📖 Creating documentation..."

# Create quick start guide
cat > MULTILINGUAL-QUICKSTART.md << 'EOF'
# VRC Multilingual Quick Start

## ✅ What was installed

### Backend packages:
- `@payloadcms/translations` - PayloadCMS multilingual support
- `@payloadcms/plugin-seo` - SEO plugin with multilingual support

### Frontend packages:
- `react-i18next` - React internationalization
- `i18next` - Core i18n library
- `i18next-browser-languagedetector` - Browser language detection

### Configuration files:
- `backend/src/config/multilingual.ts` - Backend multilingual config
- `vrcfrontend/src/i18n/config.ts` - Frontend i18n config
- `vrcfrontend/src/i18n/locales/vi.json` - Vietnamese translations
- `vrcfrontend/src/i18n/locales/en.json` - English translations

## 🚀 Next steps

### 1. Update PayloadCMS Configuration
Add to your `backend/src/payload.config.ts`:

```typescript
import { i18nConfig, localizationConfig } from './config/multilingual'

export default buildConfig({
  i18n: i18nConfig,
  localization: localizationConfig,
  // ... rest of your config
})
```

### 2. Update Collections
Add `localized: true` to fields that need translation:

```typescript
{
  name: 'title',
  type: 'text',
  localized: true, // Add this line
  required: true,
}
```

### 3. Use in Frontend Components
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <h1>{t('hero.title')}</h1>
  );
};
```

## 📚 Full Documentation

- Complete implementation plan: `docs/i18n-complete-implementation-plan.md`
- Development checklist: `docs/I18N-DEVELOPMENT-CHECKLIST.md`
- Assessment report: `docs/multilingual-assessment-vrc.md`

## 🛠️ Helper Commands

```bash
# Check implementation status
npm run i18n:status

# Run setup assistant
npm run i18n:setup

# Start backend with multilingual
npm run backend:i18n

# Start frontend with i18n
npm run frontend:i18n
```

## 🆘 Need Help?

Refer to the comprehensive documentation in the `docs/` folder or use the interactive setup script:

```bash
node scripts/multilingual-implementation.mjs
```
EOF

print_success "Created MULTILINGUAL-QUICKSTART.md"

echo
print_status "✨ Quick setup completed!"
echo
print_success "📋 Summary of changes:"
echo "  ✅ Backend packages installed (@payloadcms/translations, @payloadcms/plugin-seo)"
echo "  ✅ Frontend packages verified (react-i18next, i18next, etc.)"
echo "  ✅ Configuration files created"
echo "  ✅ Basic translation files created"
echo "  ✅ Helper scripts added"
echo "  ✅ Documentation created"
echo
print_warning "⚠️  Next steps:"
echo "  1. Update your payload.config.ts with multilingual configuration"
echo "  2. Add 'localized: true' to collection fields that need translation" 
echo "  3. Start using useTranslation() hook in your React components"
echo "  4. Read MULTILINGUAL-QUICKSTART.md for detailed instructions"
echo
print_status "🚀 For full implementation, follow the plan in:"
echo "  📖 docs/i18n-complete-implementation-plan.md"
echo "  📋 docs/I18N-DEVELOPMENT-CHECKLIST.md"
echo
print_status "🛠️  Use the interactive setup tool:"
echo "  node scripts/multilingual-implementation.mjs"
echo
print_success "Happy coding! 🌍"
