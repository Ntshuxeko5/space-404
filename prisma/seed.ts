import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function main() {
  const email = 'ntshuxychabalala5"gmail.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        password: hashPassword('Superman0501!'),
        name: 'Ntshuxeko',
        isAdmin: true,
      },
    });
    console.log('Admin user created: ntshuxychabalala5@gmail.com / Superman0501!');
  } else {
    console.log('Admin user already exists');
  }

  // Seed sample products if none exist
  const existingProducts = await prisma.product.findMany({ take: 1 });
  if (!existingProducts || existingProducts.length === 0) {
    console.log('Seeding sample products...');
    await prisma.product.createMany({
      data: [
        {
          id: 'prod-1',
          name: 'Astral Tee',
          description: 'Premium streetwear tee with embroidered star motif.',
          price: 49.99,
          imageUrl: '/images/astral-tee.jpg',
          category: 'tees',
          sizes: ['S', 'M', 'L', 'XL'],
          inStock: true,
          features: ['Embroidered', '100% Cotton'],
        },
        {
          id: 'prod-2',
          name: 'Nebula Hoodie',
          description: 'Cozy hoodie with luxe fleece and subtle branding.',
          price: 89.99,
          imageUrl: '/images/nebula-hoodie.jpg',
          category: 'hoodies',
          sizes: ['S', 'M', 'L', 'XL'],
          inStock: true,
          features: ['Fleece', 'Embossed logo'],
        },
      ],
    });
    console.log('Sample products seeded');
  } else {
    console.log('Products already seeded');
  }

  // Seed initial collections
  const existingCollections = await prisma.collection.findMany({ take: 1 });
  if (existingCollections.length === 0) {
    console.log('Seeding initial collections...');
    await prisma.collection.createMany({
      data: [
        { name: 'Limited Edition', slug: 'limited-edition', description: 'Exclusive drops that define rarity' },
        { name: 'Statement Pieces', slug: 'statement-pieces', description: 'Bold designs for the fearless' },
        { name: 'Essential Luxury', slug: 'essential-luxury', description: 'Elevated everyday wear' }
      ]
    });
    console.log('Collections seeded');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
