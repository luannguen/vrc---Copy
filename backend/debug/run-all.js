// Run All Debug Scripts
console.log('🚀 Running All Debug Scripts...\n');

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const debugScripts = [
  { file: 'health-check.js', name: 'Health Check' },
  { file: 'api-test-all.js', name: 'API Test All' },
  { file: 'check-schemas.js', name: 'Schema Check' },
  { file: 'debug-relationship.js', name: 'Relationship Test' },
];

async function runScript(scriptFile, scriptName) {
  return new Promise((resolve) => {
    console.log(`\n🎯 === ${scriptName.toUpperCase()} ===`);
    console.log(`📄 Running: ${scriptFile}\n`);

    const scriptPath = path.join(__dirname, scriptFile);
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: __dirname
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`\n✅ ${scriptName} completed successfully`);
      } else {
        console.log(`\n❌ ${scriptName} failed with code ${code}`);
      }
      console.log('='.repeat(50));
      resolve(code);
    });

    child.on('error', (error) => {
      console.error(`\n💥 Error running ${scriptName}:`, error.message);
      console.log('='.repeat(50));
      resolve(1);
    });
  });
}

async function runAllScripts() {
  console.log('🔍 Debug Scripts Collection');
  console.log('=' * 50);
  console.log(`📊 Total scripts: ${debugScripts.length}`);
  console.log(`⏰ Started: ${new Date().toLocaleString()}`);
  console.log('=' * 50);

  const results = [];

  for (const script of debugScripts) {
    const result = await runScript(script.file, script.name);
    results.push({ name: script.name, success: result === 0 });
  }

  // Summary
  console.log('\n📋 === SUMMARY REPORT ===');
  console.log(`⏰ Completed: ${new Date().toLocaleString()}`);
  console.log('');

  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log('');
  console.log(`📊 Success Rate: ${successCount}/${results.length} (${Math.round(successCount/results.length*100)}%)`);

  if (successCount === results.length) {
    console.log('🎉 All debug scripts completed successfully!');
  } else {
    console.log('⚠️  Some scripts failed - check logs above for details');
  }
}

runAllScripts().catch(console.error);
