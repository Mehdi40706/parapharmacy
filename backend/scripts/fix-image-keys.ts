// scripts/fix-image-urls.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const BUCKET = 'votre-nom-de-bucket';
const MINIO_PUBLIC_BASE = `http://localhost:9000/${BUCKET}`;

async function main() {
  const products = await prisma.product.findMany();

  for (const product of products) {
    if (!product.imageUrl) continue;

    // Extrait "products/xxx.jpg" peu importe le format actuel stocké
    const match = product.imageUrl.match(/products\/[^?]+/);
    if (!match) continue;

    const newUrl = `${MINIO_PUBLIC_BASE}/${match[0]}`;

    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrl: newUrl },
    });
    console.log(`Fixed: ${product.name} -> ${newUrl}`);
  }
}

main().finally(() => prisma.$disconnect());