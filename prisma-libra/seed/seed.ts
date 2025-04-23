// prisma-libra/seed/seed.ts
import { PrismaClient, LoanStatus } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5432/libra_db"
    }
  }
});

async function main() {
  console.log('🚀 Начинаем сидирование...');
  console.log('📊 Подключаемся к базе данных...');

  try {
    // Проверяем подключение к базе данных
    await prisma.$connect();
    console.log('✅ Подключение к базе данных успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:', error);
    throw error;
  }

  // 1. Книги
  console.log('📚 Добавляем книги...');
  const books = await prisma.book.createMany({
    data: [
      { title: 'Книга 1', author: 'Автор 1', year: 2025, description: 'Описание 1' },
      { title: 'Книга 2', author: 'Автор 2', year: 2025, description: 'Описание 2' },
      { title: 'Книга 3', author: 'Автор 3', year: 2025, description: 'Описание 3' },
      { title: 'Книга 4', author: 'Автор 4', year: 2025, description: 'Описание 4' },
      { title: 'Книга 5', author: 'Автор 5', year: 2025, description: 'Описание 5' },
      { title: 'Книга 6', author: 'Автор 6', year: 2025, description: 'Описание 6' },
      { title: 'Книга 7', author: 'Автор 7', year: 2025, description: 'Описание 7' }
    ],
    skipDuplicates: true
  });
  const allBooks = await prisma.book.findMany();

  console.log(`✅ Добавлено ${books.count} книг`);

  // 2. Пользователи
  console.log('👥 Добавляем пользователей...');
  const users = await prisma.user.createMany({
    data: [
      { name: 'Алиса', email: 'alice@example.com', password: 'password1' },
      { name: 'Боб', email: 'bob@example.com', password: 'password2' },
      { name: 'Чарли', email: 'charlie@example.com', password: 'password3' }
    ],
    skipDuplicates: true
  });
  const allUsers = await prisma.user.findMany();

  console.log(`✅ Добавлено ${users.count} пользователей`);

  // 3. Отзывы: 1 пользователь → 1 отзыв на 1 книгу
  const sampleReviews = [];

  for (const book of allBooks.slice(0, 5)) {
    for (const user of allUsers.slice(0, 2)) {
      sampleReviews.push({
        bookId: book.id,
        userId: user.id,
        rating: Math.floor(Math.random() * 3) + 3, // от 3 до 5
        comment: `Комментарий от ${user.name} к книге "${book.title}"`
      });
    }
  }

  await prisma.review.createMany({
    data: sampleReviews,
    skipDuplicates: true
  });

  console.log(`✅ Добавлено ${sampleReviews.length} отзывов`);

  // 4. Добавляем специальные книги для просроченных займов
  console.log('📚 Добавляем просроченные книги...');
  const overdueBooks = await prisma.book.createMany({
    data: [
      { 
        title: 'Просроченная книга 1', 
        author: 'Автор Просроченный', 
        year: 2023, 
        description: 'Эта книга должна быть возвращена давно' 
      },
      { 
        title: 'Просроченная книга 2', 
        author: 'Автор Просроченный', 
        year: 2023, 
        description: 'Эта книга тоже просрочена' 
      },
      { 
        title: 'Просроченная книга 3', 
        author: 'Автор Просроченный', 
        year: 2023, 
        description: 'Еще одна просроченная книга' 
      },
      { 
        title: 'Просроченная книга 4', 
        author: 'Автор Просроченный', 
        year: 2023, 
        description: 'Последняя просроченная книга' 
      }
    ],
    skipDuplicates: true
  });

  const overdueBooksList = await prisma.book.findMany({
    where: {
      title: {
        startsWith: 'Просроченная книга'
      }
    }
  });

  // 5. Добавляем пользователей с просроченными книгами
  const overdueUsers = await prisma.user.createMany({
    data: [
      { 
        name: 'Иван Просроченный', 
        email: 'ivan.overdue@example.com', 
        password: 'password4' 
      },
      { 
        name: 'Мария Просроченная', 
        email: 'maria.overdue@example.com', 
        password: 'password5' 
      }
    ],
    skipDuplicates: true
  });

  const overdueUsersList = await prisma.user.findMany({
    where: {
      email: {
        in: ['ivan.overdue@example.com', 'maria.overdue@example.com']
      }
    }
  });

  // Создаем просроченные займы для этих пользователей
  const overdueLoans = [];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  for (const user of overdueUsersList) {
    // Берем по две просроченные книги для каждого пользователя
    const userOverdueBooks = overdueBooksList.slice(0, 2);
    overdueBooksList.splice(0, 2); // Удаляем использованные книги из списка
    
    for (const book of userOverdueBooks) {
      overdueLoans.push({
        bookId: book.id,
        userId: user.id,
        loanDate: thirtyDaysAgo,
        dueDate: new Date(thirtyDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 дней назад
        status: LoanStatus.OVERDUE
      });
    }
  }

  await prisma.loan.createMany({
    data: overdueLoans,
    skipDuplicates: true
  });

  console.log('⚠️ Пользователи с просроченными книгами добавлены!');
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