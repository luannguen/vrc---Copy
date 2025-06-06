#!/usr/bin/env node
/**
 * VRC Multilingual Status Check
 * Simple script to check the current implementation status
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

class StatusChecker {
  constructor() {
    this.baseDir = process.cwd();
    this.backendDir = resolve(this.baseDir, 'backend');
    this.frontendDir = resolve(this.baseDir, 'vrcfrontend');
  }

  async checkStatus() {
    console.log('🌍 VRC Multilingual Implementation Status\n');

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
    const multilingualHooks = existsSync(resolve(this.frontendDir, 'src/hooks/useMultilingualAPI.ts'));

    console.log('🔧 Backend Status:');
    console.log(`  ${backendStatus.translations ? '✅' : '❌'} @payloadcms/translations package`);
    console.log(`  ${backendStatus.seo ? '✅' : '❌'} @payloadcms/plugin-seo package`);
    console.log(`  ${payloadConfig ? '✅' : '❌'} PayloadCMS config file`);

    console.log('\n🎨 Frontend Status:');
    console.log(`  ${frontendStatus.i18next ? '✅' : '❌'} react-i18next package`);
    console.log(`  ${frontendStatus.detector ? '✅' : '❌'} language detector package`);
    console.log(`  ${i18nConfig ? '✅' : '❌'} i18n configuration`);
    console.log(`  ${languageSwitcher ? '✅' : '❌'} LanguageSwitcher component`);
    console.log(`  ${multilingualHooks ? '✅' : '❌'} Multilingual API hooks`);

    // Calculate completion percentage
    const completed = [
      backendStatus.translations,
      backendStatus.seo,
      payloadConfig,
      frontendStatus.i18next,
      frontendStatus.detector,
      i18nConfig,
      languageSwitcher,
      multilingualHooks
    ].filter(Boolean).length;

    const percentage = Math.round((completed / 8) * 100);
    console.log(`\n📈 Overall Progress: ${percentage}% complete`);

    if (percentage < 100) {
      console.log('\n💡 Next steps:');
      if (!backendStatus.translations) console.log('  - Install @payloadcms/translations package');
      if (!frontendStatus.i18next) console.log('  - Install react-i18next packages');
      if (!multilingualHooks) console.log('  - Generate multilingual API hooks');
      if (!payloadConfig) console.log('  - Setup PayloadCMS localization config');
    } else {
      console.log('\n🎉 Basic setup is complete! Ready for advanced features.');
    }

    return {
      percentage,
      backend: backendStatus,
      frontend: frontendStatus,
      config: { payloadConfig, i18nConfig, languageSwitcher, multilingualHooks }
    };
  }
}

const checker = new StatusChecker();
checker.checkStatus().then(status => {
  console.log('\n📊 Status check completed.');
}).catch(console.error);
