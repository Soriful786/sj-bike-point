import 'dotenv/config';
import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  'General Servicing',
  'Engine',
  'Brakes and Clutch',
  'Electrical and Battery',
  'Tyres and Suspension',
  'Washing and Detailing',
  'Inspection',
];

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  // 1. Garage settings (one row, hours and capacity)
  await prisma.garageSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });

  // 2. First Super Admin, from environment variables
  const name = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error('Set SEED_ADMIN_NAME, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env');
  }
  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters');
  }

  const passwordHash = await hash(password, 12);
  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });

  // 3. Starter service categories (editable later in the admin panel)
  for (const [index, categoryName] of categories.entries()) {
    await prisma.serviceCategory.upsert({
      where: { slug: slugify(categoryName) },
      update: {},
      create: { name: categoryName, slug: slugify(categoryName), sortOrder: index },
    });
  }

  console.log('Seed complete.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());