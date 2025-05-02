import { test, expect } from '@playwright/test';

test.describe('Тестирование добавления книг в профиль', () => {
  test('должен добавлять книгу в профиль пользователя', async ({ page }) => {
    // Вход в систему
    await page.goto('http://localhost:3000/');
    
    // Ждем загрузки страницы
    await page.waitForLoadState('networkidle');

    // Находим поле ввода email и кнопку
    const emailInput = page.getByPlaceholder('email@example.com');
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill('sash@example.com');

    // Находим кнопку входа по email
    const folderButton = page.getByRole('button', { name: 'Войти с помощью email' });
    await folderButton.waitFor({ state: 'visible' });
    await folderButton.click();

    // Проверка почты в MailCatcher
    await page.goto('http://localhost:1080/');
    await page.waitForURL('http://localhost:1080/');

    await page.waitForSelector('table');
    const table = page.locator('table');
    await expect(table).toBeVisible();

    await page.waitForSelector('tr');
    const emailCell = page.locator('tr').nth(1).locator('td').nth(1);
    await expect(emailCell).toContainText('<sash@example.com>');

    const firstRow = page.locator('tr').nth(1);
    await firstRow.click();

    // Вход по ссылке из письма
    await page.waitForSelector('iframe');
    const frame = page.frameLocator('iframe');

    const signInLinkInEmail = frame.getByRole('link', { name: 'Sign in' });
    await signInLinkInEmail.waitFor({ state: 'visible', timeout: 30000 });

    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      signInLinkInEmail.click()
    ]);

    await newPage.waitForLoadState('networkidle');
    await newPage.bringToFront();
    await newPage.waitForURL('http://localhost:3000/profile');

    // Переход в раздел книг
    await newPage.getByRole('link', { name: 'Книги' }).click();
    await newPage.waitForURL('http://localhost:3000/books');
    
    // Ждем загрузки страницы с книгами
    await newPage.waitForLoadState('networkidle');
    await newPage.waitForTimeout(2000);

    // Находим первую карточку книги
    const bookCard = newPage.locator('.grid > div').first();
    await bookCard.waitFor({ state: 'visible', timeout: 10000 });

    // Находим кнопку "Взять книгу" внутри карточки
    const takeBookButton = bookCard.getByRole('button', { name: 'Взять книгу' });
    await takeBookButton.waitFor({ state: 'visible', timeout: 10000 });
    await takeBookButton.click();

    // Проверяем, что книга появилась в профиле
    await newPage.getByRole('link', { name: 'Профиль' }).click();
    await newPage.waitForURL('http://localhost:3000/profile');

    // Проверка, что книга отображается в профиле
    await expect(newPage.getByText('книга')).toBeVisible();
    await expect(newPage.getByText('автор')).toBeVisible();
    //добавитьб коммент и все
  });
}); 