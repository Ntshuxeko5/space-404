#!/usr/bin/env node
const REQUIRED = [
  { key: 'DATABASE_URL', hint: 'Supabase Supavisor pooler URL: postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true' },
  { key: 'DIRECT_URL',   hint: 'Supabase direct DB OR pooler URL (port 6543 also acceptable for Supavisor 2.0): must end with sslmode=require' },
  { key: 'JWT_SECRET',   hint: 'Random long string. Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"' },
  { key: 'PAYSTACK_SECRET_KEY',   hint: 'sk_live_xxx or sk_test_xxx from Paystack dashboard' },
  { key: 'PAYSTACK_PUBLIC_KEY',   hint: 'pk_live_xxx or pk_test_xxx from Paystack dashboard' },
  { key: 'PAYFAST_MERCHANT_ID',   hint: 'Merchant ID from Payfast dashboard (sandbox default 10000100)' },
  { key: 'PAYFAST_MERCHANT_KEY',  hint: 'Merchant Key from Payfast dashboard (sandbox default 46f0cd694581a)' },
];

const URL_REQUIREMENTS = [
  { key: 'DATABASE_URL', protocol: 'postgresql://', mustContain: [':6543/', 'sslmode=require'], pgbouncerOk: true },
  { key: 'DIRECT_URL',   protocol: 'postgresql://', mustContain: ['sslmode=require'] },
];

const env = process.env;
const errors = [];
const warnings = [];

for (const r of REQUIRED) {
  const v = env[r.key];
  if (!v || !String(v).trim()) {
    errors.push(`MISSING ENV: ${r.key}  -> ${r.hint}`);
  }
}

for (const rule of URL_REQUIREMENTS) {
  const v = env[rule.key];
  if (!v) continue;
  if (!v.startsWith(rule.protocol)) {
    errors.push(`INVALID FORMAT: ${rule.key} must start with "${rule.protocol}"`);
  }
  for (const needle of rule.mustContain) {
    if (!v.includes(needle)) {
      errors.push(`INVALID FORMAT: ${rule.key} must contain "${needle}" (e.g. query param or port)`);
    }
  }
  if (rule.key === 'DATABASE_URL' && rule.pgbouncerOk && !v.includes('pgbouncer=true')) {
    warnings.push(`WARN: ${rule.key} missing &pgbouncer=true — add it for Supavisor pooler compatibility.`);
  }
}

const dbUrl = env.DATABASE_URL || '';
if (dbUrl && dbUrl.includes('db.') && dbUrl.includes('.supabase.co:5432')) {
  errors.push('INVALID DATABASE_URL: direct db.XXXX.supabase.co:5432 host is IPv6-only on many projects. Use the SUPAVISOR pooler URL (pooler.supabase.com:6543) instead.');
}
const directUrl = env.DIRECT_URL || '';
if (directUrl && directUrl.includes('db.') && directUrl.includes('.supabase.co:5432')) {
  warnings.push('WARN: DIRECT_URL uses direct IPv6-only host db.XXXX.supabase.co:5432. Migrations may fail from Vercel/GitHub Actions without IPv6. You can ALSO use the Supavisor pooler URL as DIRECT_URL (Supavisor 2.0 accepts DDL writes).');
}

for (const w of warnings) console.log('\x1b[33m' + w + '\x1b[0m');
for (const e of errors)   console.log('\x1b[31m' + e + '\x1b[0m');

if (errors.length) {
  console.log(`\n\x1b[31m${errors.length} REQUIRED env var issue(s). Fix above, then redeploy Vercel with CLEAR BUILD CACHE.\x1b[0m`);
  console.log('\x1b[36mQuick fix: open Vercel -> Project -> Settings -> Environment Variables and paste the values from your local .env into the Production + Preview scopes, Save, then Deployments -> latest -> Redeploy with "Clear build cache" ticked.\x1b[0m\n');
  process.exit(1);
}

console.log('\n\x1b[32mENV OK: all required vars present and correctly formatted.\x1b[0m\n');
process.exit(0);
