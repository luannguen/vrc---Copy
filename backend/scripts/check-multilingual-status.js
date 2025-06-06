#!/usr/bin/env node

/**
 * VRC Multilingual Status Checker
 * Kiểm tra trạng thái hiện tại của hệ thống đa ngôn ngữ
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VRC Multilingual Status Check');
console.log('================================');

// Check configuration files
const checkFiles = [
  { path: 'src/payload.config.ts', name: 'PayloadCMS Config' },
  { path: 'src/collections/Products.ts', name: 'Products Collection' },
  { path: 'src/collections/Services.ts', name: 'Services Collection' },
  { path: 'src/collections/Projects.ts', name: 'Projects Collection' },
  { path: 'src/collections/Events.ts', name: 'Events Collection' },
  { path: 'src/collections/Posts/index.ts', name: 'Posts Collection' },
  { path: 'src/globals/CompanyInfo.ts', name: 'CompanyInfo Global' },
  { path: 'src/globals/HomepageSettings.ts', name: 'HomepageSettings Global' },
  { path: 'src/globals/AboutPageSettings.ts', name: 'AboutPageSettings Global' },
  { path: 'src/globals/ProjectsPageSettings.ts', name: 'ProjectsPageSettings Global' },
];

let passedChecks = 0;
const totalChecks = checkFiles.length;

console.log('\n📁 Checking Backend Files:');
console.log('-------------------------');

checkFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file.path);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');

    // Check for localized fields
    const hasLocalized = content.includes('localized: true');
    const hasI18nConfig = content.includes('localization') || content.includes('i18n') || hasLocalized;

    if (hasI18nConfig) {
      console.log(`✅ ${file.name}`);
      passedChecks++;
    } else {
      console.log(`❌ ${file.name} - Missing i18n configuration`);
    }
  } else {
    console.log(`⚠️  ${file.name} - File not found`);
  }
});

// Check frontend files
console.log('\n🎨 Checking Frontend Files:');
console.log('---------------------------');

const frontendFiles = [
  { path: '../vrcfrontend/src/i18n/config.ts', name: 'Frontend i18n Config' },
  { path: '../vrcfrontend/src/components/header/LanguageSwitcher.tsx', name: 'Language Switcher' },
  { path: '../vrcfrontend/src/components/MultilingualContent.tsx', name: 'Multilingual Content' },
  { path: '../vrcfrontend/src/hooks/useMultilingualAPI.ts', name: 'Multilingual API Hook' },
  { path: '../vrcfrontend/src/types/multilingual.ts', name: 'Multilingual Types' },
];

let frontendPassed = 0;
const frontendTotal = frontendFiles.length;

frontendFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file.path);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file.name}`);
    frontendPassed++;
  } else {
    console.log(`❌ ${file.name} - File not found`);
  }
});

// Summary
console.log('\n📊 Status Summary:');
console.log('==================');
console.log(`Backend Configuration: ${passedChecks}/${totalChecks} (${Math.round(passedChecks/totalChecks*100)}%)`);
console.log(`Frontend Configuration: ${frontendPassed}/${frontendTotal} (${Math.round(frontendPassed/frontendTotal*100)}%)`);

const overallPercentage = Math.round(((passedChecks + frontendPassed) / (totalChecks + frontendTotal)) * 100);
console.log(`Overall Completion: ${overallPercentage}%`);

if (overallPercentage >= 80) {
  console.log('\n🎉 System is ready for Phase 2 implementation!');
  console.log('Next steps: SEO optimization, performance features, content management UI');
} else {
  console.log('\n⚠️  Please complete Phase 1 setup first');
}

console.log('\n🚀 Phase 2 Ready Features:');
console.log('- SEO optimization (hreflang, sitemaps)');
console.log('- Performance (lazy loading, caching)');
console.log('- Content management UI');
console.log('- User experience enhancements');

process.exit(0);
