// prisma-libra/seed/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL // Явно указываем путь к схеме
    }
  }
});

async function main() {
  console.log('Начинаем сидирование...');
  
  await prisma.book.createMany({
    data: [
      {
        title: '1984',
        author: 'Джордж Оруэлл',
        year: 1949,
        description: 'Антиутопия о тоталитарном обществе'
      },
      {
        title: 'Мастер и Маргарита',
        author: 'Михаил Булгаков',
        year: 1966,
        description: 'Роман о дьяволе в Москве'
      }
    ],
    skipDuplicates: true
  });

  console.log('✅ Книги успешно добавлены!');
}

main()
  .catch(e => {
    console.error('❌ Ошибка:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });