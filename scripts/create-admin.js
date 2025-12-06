require('dotenv').config();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

async function main() {
  const name = process.env.ADMIN_NAME || 'Admin';
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ where: { email } });
  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    passwordHash,
    role: 'admin'
  });

  console.log('Admin user created:', email);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});