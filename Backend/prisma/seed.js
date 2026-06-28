import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');

  // Delete existing data to start clean
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  const products = [
    {
      name: 'Wireless ANC Headset',
      description: 'Premium active noise cancelling headphones with 40-hour battery life and custom audio tuning.',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      stock: 15,
      category: 'Electronics',
    },
    {
      name: 'Mechanical Gaming Keyboard',
      description: 'Tactile mechanical switches, full RGB backlighting, and a solid aluminum top case.',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
      stock: 25,
      category: 'Electronics',
    },
    {
      name: 'Smart Fitness Watch',
      description: 'Heart rate monitoring, blood oxygen tracking, sleep analysis, and built-in GPS with a vibrant AMOLED display.',
      price: 159.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      stock: 30,
      category: 'Fitness',
    },
    {
      name: 'Ergonomic Desk Chair',
      description: 'Breathable mesh backing, dynamic lumbar support, and adjustable armrests for maximum comfort.',
      price: 249.99,
      imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop&q=60',
      stock: 10,
      category: 'Office',
    },
    {
      name: 'Insulated Travel Mug',
      description: 'Double-walled vacuum insulation keeps beverages hot for 12 hours or cold for 24 hours.',
      price: 29.99,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60',
      stock: 50,
      category: 'Kitchen',
    },
    {
      name: 'Minimalist Water-Resistant Backpack',
      description: 'Durable nylon exterior, padded laptop sleeve fitting up to 15.6" screen, and sleek concealed zippers.',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
      stock: 20,
      category: 'Travel',
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${created.name}`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
