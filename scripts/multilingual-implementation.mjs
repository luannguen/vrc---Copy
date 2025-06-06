#!/usr/bin/env node
/**
 * VRC Multilingual Implementation Assistant
 * Script hỗ trợ triển khai từng bước tính năng đa ngôn ngữ
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';

const PHASES = {
  1: 'Backend Foundation (Weeks 1-3)',
  2: 'Frontend Enhancement (Weeks 4-6)', 
  3: 'Content Migration & Testing (Weeks 7-8)',
  4: 'Advanced Features (Weeks 9-10)',
  5: 'Production & Monitoring (Weeks 11-12)'
};

const TASKS = {
  'install-backend-packages': {
    phase: 1,
    title: 'Install PayloadCMS multilingual packages',
    commands: [
      'cd backend && pnpm install @payloadcms/translations',
      'cd backend && pnpm install @payloadcms/plugin-seo'
    ],
    files: ['backend/package.json']
  },
  'setup-payload-config': {
    phase: 1,
    title: 'Setup PayloadCMS localization config',
    template: 'payload-config-multilingual.template.ts',
    target: 'backend/src/payload.config.ts',
    backup: true
  },
  'create-multilingual-collections': {
    phase: 1,
    title: 'Update collections with localization',
    collections: ['Products', 'Posts', 'Services', 'Pages'],
    template: 'collection-multilingual.template.ts'
  },
  'setup-frontend-hooks': {
    phase: 2,
    title: 'Create multilingual API hooks',
    files: [
      'vrcfrontend/src/hooks/useMultilingualAPI.ts',
      'vrcfrontend/src/hooks/useMultilingualSEO.ts'
    ]
  },
  'enhance-components': {
    phase: 2,
    title: 'Enhance multilingual components',
    files: [
      'vrcfrontend/src/components/LanguageProvider.tsx',
      'vrcfrontend/src/components/MultilingualContent.tsx'
    ]
  },
  'migration-scripts': {
    phase: 3,
    title: 'Create data migration scripts',
    files: [
      'backend/scripts/migrate-products.ts',
      'backend/scripts/migrate-posts.ts',
      'backend/scripts/migrate-globals.ts'
    ]
  },
  'testing-setup': {
    phase: 3,
    title: 'Setup multilingual testing',
    files: [
      'tests/multilingual/api.test.ts',
      'tests/multilingual/components.test.tsx'
    ]
  }
};

class MultilingualImplementation {
  constructor() {
    this.baseDir = process.cwd();
    this.backendDir = resolve(this.baseDir, 'backend');
    this.frontendDir = resolve(this.baseDir, 'vrcfrontend');
  }

  async run() {
    console.log(chalk.blue.bold('🌍 VRC Multilingual Implementation Assistant'));
    console.log(chalk.gray('This tool will help you implement multilingual features step by step.\n'));

    const action = await this.selectAction();
    
    switch (action) {
      case 'status':
        await this.showStatus();
        break;
      case 'install':
        await this.installPhase();
        break;
      case 'generate':
        await this.generateFiles();
        break;
      case 'migrate':
        await this.runMigration();
        break;
      case 'test':
        await this.runTests();
        break;
      default:
        console.log(chalk.red('Invalid action selected.'));
    }
  }

  async selectAction() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '📊 Check implementation status', value: 'status' },
          { name: '📦 Install packages & setup', value: 'install' },
          { name: '🔧 Generate template files', value: 'generate' },
          { name: '🔄 Run data migration', value: 'migrate' },
          { name: '🧪 Run multilingual tests', value: 'test' },
        ]
      }
    ]);
    return action;
  }

  async showStatus() {
    console.log(chalk.yellow.bold('\n📊 Implementation Status\n'));

    // Check backend packages
    const backendPackageJson = resolve(this.backendDir, 'package.json');
    let backendStatus = { translations: false, seo: false };
    
    if (existsSync(backendPackageJson)) {
      const pkg = JSON.parse(readFileSync(backendPackageJson, 'utf8'));
      backendStatus.translations = !!(pkg.dependencies?.['@payloadcms/translations'] || pkg.devDependencies?.['@payloadcms/translations']);
      backendStatus.seo = !!(pkg.dependencies?.['@payloadcms/plugin-seo'] || pkg.devDependencies?.['@payloadcms/plugin-seo']);
    }

    // Check frontend packages
    const frontendPackageJson = resolve(this.frontendDir, 'package.json');
    let frontendStatus = { i18next: false, detector: false };
    
    if (existsSync(frontendPackageJson)) {
      const pkg = JSON.parse(readFileSync(frontendPackageJson, 'utf8'));
      frontendStatus.i18next = !!(pkg.dependencies?.['react-i18next'] || pkg.devDependencies?.['react-i18next']);
      frontendStatus.detector = !!(pkg.dependencies?.['i18next-browser-languagedetector'] || pkg.devDependencies?.['i18next-browser-languagedetector']);
    }

    // Check configuration files
    const payloadConfig = existsSync(resolve(this.backendDir, 'src/payload.config.ts'));
    const i18nConfig = existsSync(resolve(this.frontendDir, 'src/i18n/config.ts'));
    const languageSwitcher = existsSync(resolve(this.frontendDir, 'src/components/header/LanguageSwitcher.tsx'));

    console.log('🔧 Backend Status:');
    console.log(`  ${backendStatus.translations ? '✅' : '❌'} @payloadcms/translations package`);
    console.log(`  ${backendStatus.seo ? '✅' : '❌'} @payloadcms/plugin-seo package`);
    console.log(`  ${payloadConfig ? '✅' : '❌'} PayloadCMS config file`);

    console.log('\n🎨 Frontend Status:');
    console.log(`  ${frontendStatus.i18next ? '✅' : '❌'} react-i18next package`);
    console.log(`  ${frontendStatus.detector ? '✅' : '❌'} language detector package`);
    console.log(`  ${i18nConfig ? '✅' : '❌'} i18n configuration`);
    console.log(`  ${languageSwitcher ? '✅' : '❌'} LanguageSwitcher component`);

    // Calculate completion percentage
    const completed = [
      backendStatus.translations,
      backendStatus.seo,
      payloadConfig,
      frontendStatus.i18next,
      frontendStatus.detector,
      i18nConfig,
      languageSwitcher
    ].filter(Boolean).length;

    const percentage = Math.round((completed / 7) * 100);
    console.log(`\n📈 Overall Progress: ${percentage}% complete`);

    if (percentage < 100) {
      console.log(chalk.yellow('\n💡 Next steps:'));
      if (!backendStatus.translations) console.log('  - Install @payloadcms/translations package');
      if (!frontendStatus.i18next) console.log('  - Install react-i18next packages');
      if (!payloadConfig) console.log('  - Setup PayloadCMS localization config');
    } else {
      console.log(chalk.green('\n🎉 Basic setup is complete! Ready for advanced features.'));
    }
  }

  async installPhase() {
    const { phase } = await inquirer.prompt([
      {
        type: 'list',
        name: 'phase',
        message: 'Which phase would you like to install?',
        choices: Object.entries(PHASES).map(([key, value]) => ({
          name: `Phase ${key}: ${value}`,
          value: parseInt(key)
        }))
      }
    ]);

    await this.executePhase(phase);
  }

  async executePhase(phase) {
    console.log(chalk.blue.bold(`\n🚀 Executing Phase ${phase}: ${PHASES[phase]}\n`));

    const phaseTasks = Object.entries(TASKS).filter(([_, task]) => task.phase === phase);

    for (const [taskId, task] of phaseTasks) {
      console.log(chalk.yellow(`📋 ${task.title}...`));
      
      try {
        await this.executeTask(taskId, task);
        console.log(chalk.green('✅ Completed\n'));
      } catch (error) {
        console.log(chalk.red(`❌ Error: ${error.message}\n`));
      }
    }

    console.log(chalk.green.bold(`🎉 Phase ${phase} completed!`));
  }

  async executeTask(taskId, task) {
    switch (taskId) {
      case 'install-backend-packages':
        for (const cmd of task.commands) {
          console.log(chalk.gray(`Running: ${cmd}`));
          execSync(cmd, { stdio: 'inherit' });
        }
        break;
        
      case 'setup-payload-config':
        await this.generatePayloadConfig();
        break;
        
      case 'create-multilingual-collections':
        await this.generateCollectionTemplates();
        break;
        
      default:
        console.log(chalk.gray(`Generating templates for ${taskId}...`));
        await this.generateTaskFiles(task);
    }
  }

  async generatePayloadConfig() {
    const configPath = resolve(this.backendDir, 'src/payload.config.ts');
    
    if (existsSync(configPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: 'PayloadCMS config exists. Add multilingual configuration?',
          default: true
        }
      ]);
      
      if (!overwrite) return;
    }

    const template = this.getPayloadConfigTemplate();
    writeFileSync(configPath, template);
    console.log(chalk.green(`Generated: ${configPath}`));
  }

  getPayloadConfigTemplate() {
    return `import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'
import { tr } from '@payloadcms/translations/languages/tr'

// Import your existing config
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

// Import collections (update these imports as needed)
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Services } from './collections/Services'
import { Pages } from './collections/Pages'

// Import globals
import { Header } from './Header/config'
import { Footer } from './Footer/config'
import { CompanyInfo } from './globals/CompanyInfo'

export default buildConfig({
  // Admin interface multilingual support
  i18n: {
    supportedLanguages: { en, vi, tr },
    fallbackLanguage: 'vi',
    translations: {
      vi: {
        general: {
          dashboard: 'Bảng điều khiển',
          collections: 'Bộ sưu tập',
          globals: 'Cài đặt chung',
        }
      }
    }
  },
  
  // Content localization
  localization: {
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
  },

  admin: {
    user: 'users',
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- VRC Admin',
      favicon: '/favicon.ico',
    },
  },
  
  collections: [
    Posts,
    Products,
    Services,
    Pages,
    // Add other collections here
  ],
  
  globals: [
    Header,
    Footer,
    CompanyInfo,
    // Add other globals here
  ],
  
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  
  editor: defaultLexical,
  
  secret: process.env.PAYLOAD_SECRET,
  
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})`;
  }

  async generateFiles() {
    const { fileType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'fileType',
        message: 'What type of files would you like to generate?',
        choices: [
          { name: '🔧 Multilingual API Hooks', value: 'hooks' },
          { name: '🎨 Enhanced Components', value: 'components' },
          { name: '🗄️ Migration Scripts', value: 'migration' },
          { name: '🧪 Test Files', value: 'tests' },
          { name: '📝 Collection Templates', value: 'collections' },
        ]
      }
    ]);

    await this.generateFilesByType(fileType);
  }

  async generateFilesByType(type) {
    switch (type) {
      case 'hooks':
        await this.generateMultilingualHooks();
        break;
      case 'components':
        await this.generateEnhancedComponents();
        break;
      case 'migration':
        await this.generateMigrationScripts();
        break;
      case 'tests':
        await this.generateTestFiles();
        break;
      case 'collections':
        await this.generateCollectionTemplates();
        break;
    }
  }

  async generateMultilingualHooks() {
    const hooksDir = resolve(this.frontendDir, 'src/hooks');
      // useMultilingualAPI.ts
    const apiHookContent = `import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:3000';

export const useMultilingualProducts = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['products', currentLocale],
    queryFn: async () => {
      const response = await fetch(\`\${API_BASE}/api/products?locale=\${currentLocale}\`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMultilingualPosts = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['posts', currentLocale],
    queryFn: async () => {
      const response = await fetch(\`\${API_BASE}/api/posts?locale=\${currentLocale}\`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMultilingualServices = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['services', currentLocale],
    queryFn: async () => {
      const response = await fetch(\`\${API_BASE}/api/services?locale=\${currentLocale}\`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMultilingualGlobal = (slug: string, locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['global', slug, currentLocale],
    queryFn: async () => {
      const response = await fetch(\`\${API_BASE}/api/globals/\${slug}?locale=\${currentLocale}\`);
      if (!response.ok) throw new Error(\`Failed to fetch global \${slug}\`);
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
  });
};`;

    writeFileSync(resolve(hooksDir, 'useMultilingualAPI.ts'), apiHookContent);
    console.log(chalk.green('Generated: useMultilingualAPI.ts'));    // useMultilingualSEO.ts
    const seoHookContent = `import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOOptions {
  title?: Record<string, string> | string;
  description?: Record<string, string> | string;
  keywords?: Record<string, string> | string;
  canonical?: string;
  hreflang?: Record<string, string>;
}

export const useMultilingualSEO = (options: SEOOptions) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  useEffect(() => {
    // Update document title
    if (options.title) {
      const title = typeof options.title === 'string' 
        ? options.title 
        : options.title[currentLang] || options.title.vi || options.title.en;
      if (title) document.title = title;
    }

    // Update meta description
    if (options.description) {
      const description = typeof options.description === 'string'
        ? options.description
        : options.description[currentLang] || options.description.vi || options.description.en;
      
      if (description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', description);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = description;
          document.head.appendChild(meta);
        }
      }
    }

    // Update meta keywords
    if (options.keywords) {
      const keywords = typeof options.keywords === 'string'
        ? options.keywords
        : options.keywords[currentLang] || options.keywords.vi || options.keywords.en;
      
      if (keywords) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', keywords);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'keywords';
          meta.content = keywords;
          document.head.appendChild(meta);
        }
      }
    }

    // Update hreflang tags
    if (options.hreflang) {
      // Remove existing hreflang tags
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
      
      // Add new hreflang tags
      Object.entries(options.hreflang).forEach(([lang, url]) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        link.href = url;
        document.head.appendChild(link);
      });
    }

    // Update canonical URL
    if (options.canonical) {
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', options.canonical);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = options.canonical;
        document.head.appendChild(link);
      }
    }

    // Update lang attribute on html element
    document.documentElement.lang = currentLang;
    
  }, [currentLang, options]);
};`;

    writeFileSync(resolve(hooksDir, 'useMultilingualSEO.ts'), seoHookContent);
    console.log(chalk.green('Generated: useMultilingualSEO.ts'));
  }

  async runMigration() {
    console.log(chalk.blue.bold('\n🔄 Running Data Migration\n'));
    
    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: chalk.red('This will modify your database. Make sure you have a backup. Continue?'),
        default: false
      }
    ]);

    if (!confirmed) {
      console.log(chalk.yellow('Migration cancelled.'));
      return;
    }

    // Run migration scripts
    console.log(chalk.yellow('📋 Running migration scripts...'));
    
    try {
      execSync('cd backend && npm run migrate:multilingual', { stdio: 'inherit' });
      console.log(chalk.green('✅ Migration completed successfully!'));
    } catch (error) {
      console.log(chalk.red(`❌ Migration failed: ${error.message}`));
    }
  }

  async runTests() {
    console.log(chalk.blue.bold('\n🧪 Running Multilingual Tests\n'));
    
    const { testType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'testType',
        message: 'What type of tests would you like to run?',
        choices: [
          { name: '🔧 API Tests', value: 'api' },
          { name: '🎨 Component Tests', value: 'components' },
          { name: '🔗 Integration Tests', value: 'integration' },
          { name: '🌐 E2E Tests', value: 'e2e' },
          { name: '🏃 All Tests', value: 'all' },
        ]
      }
    ]);

    try {
      switch (testType) {
        case 'api':
          execSync('npm run test:multilingual:api', { stdio: 'inherit' });
          break;
        case 'components':
          execSync('npm run test:multilingual:components', { stdio: 'inherit' });
          break;
        case 'integration':
          execSync('npm run test:multilingual:integration', { stdio: 'inherit' });
          break;
        case 'e2e':
          execSync('npm run test:multilingual:e2e', { stdio: 'inherit' });
          break;
        case 'all':
          execSync('npm run test:multilingual', { stdio: 'inherit' });
          break;
      }
      console.log(chalk.green('✅ Tests completed successfully!'));
    } catch (error) {
      console.log(chalk.red(`❌ Tests failed: ${error.message}`));
    }
  }
}

// Run the tool
if (import.meta.url === `file://${process.argv[1]}`) {
  const tool = new MultilingualImplementation();
  tool.run().catch(console.error);
}

export default MultilingualImplementation;
