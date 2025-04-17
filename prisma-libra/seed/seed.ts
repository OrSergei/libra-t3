// prisma-libra/seed/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/libra_db"
    }
  }
});

async function main() {
  console.log('Начинаем сидирование...');
  
  await prisma.book.createMany({
    data: [
      { title: 'Книга 1',
        author: 'Автор 1',
        year: 2025,
        description: 'Описание 1' 
      },
      { title: 'Книга 2', author: 'Автор 2', year: 2025, description: 'Описание 2' },
      { title: 'Книга 3', author: 'Автор 3', year: 2025, description: 'Описание 3' },
      { title: 'Книга 4', author: 'Автор 4', year: 2025, description: 'Описание 4' },
      { title: 'Книга 5', author: 'Автор 5', year: 2025, description: 'Описание 5' },
      { title: 'Книга 6', author: 'Автор 6', year: 2025, description: 'Описание 6' },
      { title: 'Книга 7', author: 'Автор 7', year: 2025, description: 'Описание 7' }
     
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




    /*
  D:\PP\libra-t3\libra\src\server\api\rooters
  сперва создать роутер 
  передать в root 


  создать компонент с сервеной если нужна ссесия 

  для изменения данных используеются мутация 

  для просмотра можно и qeury 
  
  
  */