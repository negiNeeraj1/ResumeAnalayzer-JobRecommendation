/**
 * Script to check if .env.local is properly configured
 * Run: node check_env.js
 */

const fs = require('fs');
const path = require('path');

console.log('============================================================');
console.log('🔍 Checking Environment Configuration');
console.log('============================================================\n');

const envPath = path.join(__dirname, '.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('❌ ERROR: .env.local file not found!');
  console.log('📍 Expected location:', envPath);
  console.log('\n📝 Please create .env.local with the following variables:');
  console.log('   - MONGODB_URI');
  console.log('   - JWT_SECRET');
  console.log('   - ML_SERVICE_URL');
  console.log('   - NEXT_PUBLIC_API_URL');
  console.log('\n📚 See ENV_SETUP.md for details\n');
  process.exit(1);
}

console.log('✅ .env.local file exists\n');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Required variables
const required = [
  'MONGODB_URI',
  'JWT_SECRET',
];

const optional = [
  'ML_SERVICE_URL',
  'NEXT_PUBLIC_API_URL',
];

console.log('📋 Checking required variables:\n');

let hasErrors = false;

required.forEach(varName => {
  if (envVars[varName]) {
    console.log(`✅ ${varName}: ${envVars[varName].substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: NOT FOUND`);
    hasErrors = true;
  }
});

console.log('\n📋 Checking optional variables:\n');

optional.forEach(varName => {
  if (envVars[varName]) {
    console.log(`✅ ${varName}: ${envVars[varName]}`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET (using default)`);
  }
});

console.log('\n============================================================');

if (hasErrors) {
  console.log('❌ Configuration has errors! Please fix them.');
  console.log('📚 See ENV_SETUP.md for details');
  console.log('============================================================\n');
  process.exit(1);
} else {
  console.log('✅ Configuration looks good!');
  console.log('🚀 You can now run: npm run dev');
  console.log('============================================================\n');
  process.exit(0);
}


