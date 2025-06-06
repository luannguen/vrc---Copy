#!/usr/bin/env node
/**
 * VRC Multilingual Testing Script
 * Tests the multilingual implementation across frontend and backend
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class MultilingualTester {
  constructor() {
    this.baseDir = process.cwd();
    this.backendDir = resolve(this.baseDir, 'backend');
    this.frontendDir = resolve(this.baseDir, 'vrcfrontend');
    this.results = {
      backend: {},
      frontend: {},
      api: {},
      overall: 'pending'
    };
  }

  async runTests() {
    console.log('🧪 VRC Multilingual Implementation Tests\n');

    try {
      await this.testBackendConfig();
      await this.testFrontendSetup();
      await this.testAPIEndpoints();
      await this.generateTestReport();
      
      console.log('\n✅ All tests completed!');
      console.log('📊 Check test-results.json for detailed results');
      
    } catch (error) {
      console.error('❌ Testing failed:', error);
      this.results.overall = 'failed';
      this.results.error = error.message;
    }
  }

  async testBackendConfig() {
    console.log('🔧 Testing Backend Configuration...');
    
    // Test 1: Check PayloadCMS config
    const payloadConfigPath = resolve(this.backendDir, 'src/payload.config.ts');
    const payloadConfigExists = existsSync(payloadConfigPath);
    this.results.backend.payloadConfig = payloadConfigExists;
    
    if (payloadConfigExists) {
      const configContent = readFileSync(payloadConfigPath, 'utf8');
      const hasLocalization = configContent.includes('localization:');
      const hasI18n = configContent.includes('i18n:');
      const hasTranslations = configContent.includes('@payloadcms/translations');
      
      this.results.backend.localizationEnabled = hasLocalization;
      this.results.backend.i18nEnabled = hasI18n;
      this.results.backend.translationsImported = hasTranslations;
      
      console.log(`  ✅ PayloadCMS config found`);
      console.log(`  ${hasLocalization ? '✅' : '❌'} Localization enabled`);
      console.log(`  ${hasI18n ? '✅' : '❌'} i18n configured`);
      console.log(`  ${hasTranslations ? '✅' : '❌'} Translations imported`);
    } else {
      console.log('  ❌ PayloadCMS config not found');
    }    // Test 2: Check collection configurations
    const collectionsToCheck = ['Products', 'Services'];
    this.results.backend.collections = {};
    
    for (const collection of collectionsToCheck) {
      const collectionPath = resolve(this.backendDir, `src/collections/${collection}.ts`);
      if (existsSync(collectionPath)) {
        const content = readFileSync(collectionPath, 'utf8');
        const hasLocalizedFields = content.includes('localized: true');
        this.results.backend.collections[collection] = hasLocalizedFields;
        console.log(`  ${hasLocalizedFields ? '✅' : '❌'} ${collection} has localized fields`);
      } else {
        this.results.backend.collections[collection] = false;
        console.log(`  ❌ ${collection} collection not found`);
      }
    }

    // Check Posts collection (special path)
    const postsPath = resolve(this.backendDir, 'src/collections/Posts/index.ts');
    if (existsSync(postsPath)) {
      const content = readFileSync(postsPath, 'utf8');
      const hasLocalizedFields = content.includes('localized: true');
      this.results.backend.collections.Posts = hasLocalizedFields;
      console.log(`  ${hasLocalizedFields ? '✅' : '❌'} Posts has localized fields`);
    } else {
      this.results.backend.collections.Posts = false;
      console.log(`  ❌ Posts collection not found`);
    }

    // Test 3: Check globals configuration
    const globalsToCheck = ['CompanyInfo'];
    this.results.backend.globals = {};
    
    for (const global of globalsToCheck) {
      const globalPath = resolve(this.backendDir, `src/globals/${global}.ts`);
      if (existsSync(globalPath)) {
        const content = readFileSync(globalPath, 'utf8');
        const hasLocalizedFields = content.includes('localized: true');
        this.results.backend.globals[global] = hasLocalizedFields;
        console.log(`  ${hasLocalizedFields ? '✅' : '❌'} ${global} has localized fields`);
      } else {
        this.results.backend.globals[global] = false;
        console.log(`  ❌ ${global} global not found`);
      }
    }
  }

  async testFrontendSetup() {
    console.log('\n🎨 Testing Frontend Setup...');
    
    // Test 1: Check i18n configuration
    const i18nConfigPath = resolve(this.frontendDir, 'src/i18n/config.ts');
    const i18nConfigExists = existsSync(i18nConfigPath);
    this.results.frontend.i18nConfig = i18nConfigExists;
    
    if (i18nConfigExists) {
      const configContent = readFileSync(i18nConfigPath, 'utf8');
      const hasLanguages = configContent.includes('vi') && configContent.includes('en') && configContent.includes('tr');
      this.results.frontend.multiLanguageSupport = hasLanguages;
      console.log(`  ✅ i18n config found`);
      console.log(`  ${hasLanguages ? '✅' : '❌'} Multiple languages configured`);
    } else {
      console.log('  ❌ i18n config not found');
    }

    // Test 2: Check translation files
    const languages = ['vi', 'en', 'tr'];
    this.results.frontend.translationFiles = {};
    
    for (const lang of languages) {
      const translationPath = resolve(this.frontendDir, `src/i18n/locales/${lang}.json`);
      const exists = existsSync(translationPath);
      this.results.frontend.translationFiles[lang] = exists;
      
      if (exists) {
        try {
          const content = JSON.parse(readFileSync(translationPath, 'utf8'));
          const hasCommonTranslations = content.common && Object.keys(content.common).length > 0;
          const hasNavigationTranslations = content.navigation && Object.keys(content.navigation).length > 0;
          this.results.frontend.translationFiles[`${lang}_quality`] = hasCommonTranslations && hasNavigationTranslations;
          console.log(`  ${exists ? '✅' : '❌'} ${lang}.json exists`);
          console.log(`    ${hasCommonTranslations && hasNavigationTranslations ? '✅' : '❌'} Has essential translations`);
        } catch (error) {
          console.log(`  ❌ ${lang}.json is invalid JSON`);
          this.results.frontend.translationFiles[`${lang}_quality`] = false;
        }
      } else {
        console.log(`  ❌ ${lang}.json not found`);
      }
    }

    // Test 3: Check multilingual hooks
    const hooksPath = resolve(this.frontendDir, 'src/hooks/useMultilingualAPI.ts');
    const hooksExist = existsSync(hooksPath);
    this.results.frontend.multilingualHooks = hooksExist;
    
    if (hooksExist) {
      const hooksContent = readFileSync(hooksPath, 'utf8');
      const hasProductsHook = hooksContent.includes('useMultilingualProducts');
      const hasServicesHook = hooksContent.includes('useMultilingualServices');
      const hasGlobalHook = hooksContent.includes('useMultilingualGlobal');
      
      this.results.frontend.hooksComplete = hasProductsHook && hasServicesHook && hasGlobalHook;
      console.log(`  ✅ Multilingual hooks found`);
      console.log(`  ${hasProductsHook ? '✅' : '❌'} Products hook available`);
      console.log(`  ${hasServicesHook ? '✅' : '❌'} Services hook available`);
      console.log(`  ${hasGlobalHook ? '✅' : '❌'} Global hook available`);
    } else {
      console.log('  ❌ Multilingual hooks not found');
    }

    // Test 4: Check components
    const componentsToCheck = ['LanguageSwitcher', 'MultilingualContent'];
    this.results.frontend.components = {};
    
    for (const component of componentsToCheck) {
      let componentPath = resolve(this.frontendDir, `src/components/${component}.tsx`);
      if (!existsSync(componentPath)) {
        componentPath = resolve(this.frontendDir, `src/components/header/${component}.tsx`);
      }
      
      const exists = existsSync(componentPath);
      this.results.frontend.components[component] = exists;
      console.log(`  ${exists ? '✅' : '❌'} ${component} component found`);
    }
  }

  async testAPIEndpoints() {
    console.log('\n🔗 Testing API Endpoints...');
    
    // Create test script for API endpoints
    const apiTestScript = `
# API Endpoint Tests
# Run these manually to test your multilingual API

# Test 1: Products endpoint with different locales
echo "Testing Products API..."
curl -H "Accept: application/json" "http://localhost:3000/api/products?locale=vi" || echo "❌ Products VI failed"
curl -H "Accept: application/json" "http://localhost:3000/api/products?locale=en" || echo "❌ Products EN failed"
curl -H "Accept: application/json" "http://localhost:3000/api/products?locale=tr" || echo "❌ Products TR failed"

# Test 2: Services endpoint with different locales
echo "Testing Services API..."
curl -H "Accept: application/json" "http://localhost:3000/api/services?locale=vi" || echo "❌ Services VI failed"
curl -H "Accept: application/json" "http://localhost:3000/api/services?locale=en" || echo "❌ Services EN failed"
curl -H "Accept: application/json" "http://localhost:3000/api/services?locale=tr" || echo "❌ Services TR failed"

# Test 3: Company Info global endpoint
echo "Testing Company Info API..."
curl -H "Accept: application/json" "http://localhost:3000/api/globals/company-info?locale=vi" || echo "❌ Company Info VI failed"
curl -H "Accept: application/json" "http://localhost:3000/api/globals/company-info?locale=en" || echo "❌ Company Info EN failed"
curl -H "Accept: application/json" "http://localhost:3000/api/globals/company-info?locale=tr" || echo "❌ Company Info TR failed"

echo "✅ API tests completed. Check responses for multilingual content."
`;

    writeFileSync(resolve(this.baseDir, 'test-api-endpoints.sh'), apiTestScript);
    console.log('  ✅ API test script generated: test-api-endpoints.sh');
    console.log('  📝 Run the script manually to test API endpoints');
    
    this.results.api.testScriptGenerated = true;
    this.results.api.note = 'Manual testing required - run test-api-endpoints.sh';
  }

  async generateTestReport() {
    console.log('\n📊 Generating Test Report...');
    
    // Calculate overall score
    let passedTests = 0;
    let totalTests = 0;
    
    // Backend tests
    const backendTests = [
      this.results.backend.payloadConfig,
      this.results.backend.localizationEnabled,
      this.results.backend.i18nEnabled,
      this.results.backend.translationsImported,
      ...Object.values(this.results.backend.collections || {}),
      ...Object.values(this.results.backend.globals || {})
    ];
    
    // Frontend tests
    const frontendTests = [
      this.results.frontend.i18nConfig,
      this.results.frontend.multiLanguageSupport,
      this.results.frontend.multilingualHooks,
      this.results.frontend.hooksComplete,
      ...Object.values(this.results.frontend.translationFiles || {}),
      ...Object.values(this.results.frontend.components || {})
    ];
    
    passedTests = [...backendTests, ...frontendTests].filter(Boolean).length;
    totalTests = backendTests.length + frontendTests.length;
    
    const score = Math.round((passedTests / totalTests) * 100);
    this.results.overall = score >= 80 ? 'passed' : score >= 60 ? 'warning' : 'failed';
    this.results.score = score;
    this.results.passedTests = passedTests;
    this.results.totalTests = totalTests;
    
    // Generate detailed report
    const report = {
      timestamp: new Date().toISOString(),
      score: `${score}% (${passedTests}/${totalTests})`,
      status: this.results.overall,
      details: this.results,
      recommendations: []
    };
    
    // Add recommendations
    if (score < 100) {
      report.recommendations.push('🔧 Complete missing backend configurations');
      report.recommendations.push('🎨 Ensure all frontend components are properly set up');
      report.recommendations.push('📝 Update translation files with actual content');
      report.recommendations.push('🧪 Run API endpoint tests manually');
      report.recommendations.push('🚀 Deploy and test in production environment');
    } else {
      report.recommendations.push('🎉 Great job! Consider adding advanced features:');
      report.recommendations.push('  - SEO optimization with hreflang tags');
      report.recommendations.push('  - Dynamic language detection');
      report.recommendations.push('  - Translation management UI');
      report.recommendations.push('  - Performance optimization with lazy loading');
    }
    
    writeFileSync(resolve(this.baseDir, 'test-results.json'), JSON.stringify(report, null, 2));
    
    console.log(`\\n📈 Overall Score: ${score}% (${this.results.overall.toUpperCase()})`);
    console.log(`🎯 Tests Passed: ${passedTests}/${totalTests}`);
    console.log('\\n💡 Next Steps:');
    report.recommendations.forEach(rec => console.log(`  ${rec}`));
  }
}

const tester = new MultilingualTester();
tester.runTests().catch(console.error);
