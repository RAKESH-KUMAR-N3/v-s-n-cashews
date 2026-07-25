import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MongoDB Atlas database seeding for V S N CASHEWS...');

  // 1. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin123@gmail.com' },
    update: { role: 'ADMIN' },
    create: {
      name: 'V S N Admin Manager',
      email: 'admin123@gmail.com',
      phone: '+91 98450 12345',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log('✅ Admin user seeded:', adminUser.email);

  // 2. Seed Customer User
  const customerUser = await prisma.user.upsert({
    where: { email: 'nrakeshkumar36@gmail.com' },
    update: {},
    create: {
      name: 'Rakesh Kumar',
      email: 'nrakeshkumar36@gmail.com',
      phone: '+91 98450 99887',
      role: 'USER',
      emailVerified: true,
    },
  });
  console.log('✅ Customer user seeded:', customerUser.email);

  // 3. Seed Categories
  const wholeCategory = await prisma.category.upsert({
    where: { slug: 'whole-cashews' },
    update: {},
    create: {
      name: 'Whole Cashews',
      slug: 'whole-cashews',
      description: 'Sovereign W-180 King Jumbo, W-240, and W-320 Whole Kernel Cashews',
      image: '/assets/img-cashew-1.jpg',
      isActive: true,
    },
  });

  const roastedCategory = await prisma.category.upsert({
    where: { slug: 'ghee-roasted' },
    update: {},
    create: {
      name: 'Ghee Roasted & Flavors',
      slug: 'ghee-roasted',
      description: 'Pure Cow Ghee Roasts, Malabar Pepper & Honey Saffron Cashews',
      image: '/assets/img-cashew-4.jpg',
      isActive: true,
    },
  });

  const splitsCategory = await prisma.category.upsert({
    where: { slug: 'broken-splits' },
    update: {},
    create: {
      name: 'Splits & Culinary',
      slug: 'broken-splits',
      description: 'LWP, JH, and K Splits for Commercial Bakeries & Sweets',
      image: '/assets/img-cashew-6.jpg',
      isActive: true,
    },
  });

  console.log('✅ Categories seeded');

  // 4. Seed Products
  const productsToSeed = [
    {
      name: 'W-180 King Jumbo Cashews',
      slug: 'w180-king-jumbo',
      sku: 'VSN-W180-KJ',
      description: 'The Emperor Grade King Jumbo Cashews. Hand-picked from Mangalore & Hyderabad orchards. Crisp, creamy, and nitrogen-sealed.',
      grade: 'W-180',
      basePrice: 890,
      images: ['/assets/img-cashew-1.jpg', '/assets/img-cashew-2.jpg'],
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 1420,
      categoryId: wholeCategory.id,
    },
    {
      name: 'W-240 Premium Whole Cashews',
      slug: 'w240-premium-whole',
      sku: 'VSN-W240-PW',
      description: 'Export Grade W-240 Large Whole Cashews. Excellent balance of rich buttery texture and ideal size for gourmet snacking.',
      grade: 'W-240',
      basePrice: 750,
      images: ['/assets/img-cashew-2.jpg', '/assets/img-cashew-3.jpg'],
      inStock: true,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 980,
      categoryId: wholeCategory.id,
    },
    {
      name: 'W-320 Standard Whole Cashews',
      slug: 'w320-standard-whole',
      sku: 'VSN-W320-SW',
      description: 'The classic Indian favourite W-320 cashew nuts. Perfect for everyday luxury snacking and festival gift boxes.',
      grade: 'W-320',
      basePrice: 620,
      images: ['/assets/img-cashew-3.jpg', '/assets/img-cashew-1.jpg'],
      inStock: true,
      isFeatured: false,
      isBestSeller: true,
      rating: 4.7,
      reviewCount: 2100,
      categoryId: wholeCategory.id,
    },
    {
      name: 'Pure Cow Ghee Roasted Cashews',
      slug: 'pure-ghee-roasted-cashews',
      sku: 'VSN-GHEE-RST',
      description: 'Slow-roasted in 100% Pure Organic Cow Ghee with a pinch of Himalayan Pink Salt. Golden, fragrant, and addictively crunchy.',
      grade: 'W-240 Ghee Roast',
      basePrice: 820,
      images: ['/assets/img-cashew-4.jpg', '/assets/img-cashew-5.jpg'],
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 1850,
      categoryId: roastedCategory.id,
    },
    {
      name: 'Malabar Black Pepper Spiced Cashews',
      slug: 'malabar-pepper-spiced',
      sku: 'VSN-PEP-RST',
      description: 'Coated with freshly crushed Malabar Black Pepper & roasted whole spices. Bold, zesty, and perfect with evening tea.',
      grade: 'W-240 Pepper',
      basePrice: 790,
      images: ['/assets/img-cashew-5.jpg', '/assets/img-cashew-4.jpg'],
      inStock: true,
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 760,
      categoryId: roastedCategory.id,
    },
    {
      name: 'LWP Commercial Split Cashews',
      slug: 'lwp-split-cashews',
      sku: 'VSN-LWP-SPLIT',
      description: 'Large White Splits (LWP) for commercial sweet preparation, Kaju Katli manufacturing, and hotel culinary kitchens.',
      grade: 'LWP Splits',
      basePrice: 540,
      images: ['/assets/img-cashew-6.jpg', '/assets/img-cashew-7.jpg'],
      inStock: true,
      isFeatured: false,
      isBestSeller: false,
      rating: 4.6,
      reviewCount: 430,
      categoryId: splitsCategory.id,
    },
  ];

  for (const prod of productsToSeed) {
    const existing = await prisma.product.findUnique({ where: { slug: prod.slug } });
    if (!existing) {
      await prisma.product.create({ data: prod });
      console.log(`✅ Product seeded: ${prod.name}`);
    }
  }

  console.log('🎉 MongoDB Atlas Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
