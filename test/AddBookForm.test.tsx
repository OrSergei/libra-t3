import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddBookForm } from '../src/app/componets/AddBookForm';
import { api } from '../src/trpc/react';
import { renderWithTRPC } from '../setup';

vi.mock('next/navigation');
vi.mock('../src/trpc/react', () => ({
  api: {
    book: {
      create: {
        useMutation: vi.fn().mockReturnValue({
          mutate: vi.fn(),
          mutateAsync: vi.fn(),
          isPending: false,
          isError: false,
          isSuccess: false,
          error: null,
          data: null,
          reset: vi.fn(),
          context: undefined,
          variables: undefined,
        }),
      },
    },
  },
}));

describe('Тест AddBookForm', () => {
  const mockMutate = vi.fn();
  const mockRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Мокаем tRPC мутацию
    (api.book.create.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: null,
      reset: vi.fn(),
      context: undefined,
      variables: undefined,
    });
  });

  it('должна отображаться кнопка добавления книги', () => {
    renderWithTRPC(<AddBookForm refetch={mockRefetch} />);
    const button = screen.getByRole('button', { name: 'Добавить книгу' });
    expect(button).toBeInTheDocument();
  });


   //нужно сделать чтобы при нажати на кнопку добавить книгу  
 // проверить если  данные не заполнены до вызов не срабатывал а если заполнены то срабатвыал  

  it('не должна отправлять форму с пустыми полями', async () => {
    renderWithTRPC(<AddBookForm refetch={mockRefetch} />);
    

    // Находим форму и кнопку отправки
    const form = screen.getByTestId('add-book-form');
    const submitButton = screen.getByRole('button', { name: 'Добавить книгу' });
    
    // Пытаемся отправить пустую форму
    fireEvent.click(submitButton);
    
    // Проверяем, что мутация не была вызвана
    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
  });

  it('должна отправлять форму с заполненными полями', async () => {
    const mockMutateAsync = vi.fn();
    (api.book.create.useMutation as any).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: false,
      error: null,
      data: null,
      reset: vi.fn(),
      context: undefined,
      variables: undefined,
    });

    renderWithTRPC(<AddBookForm refetch={mockRefetch} />);
    

    
    // Заполняем обязательные поля
    const titleInput = screen.getByPlaceholderText('Название');
    const authorInput = screen.getByPlaceholderText('Автор');
    const yearInput = screen.getByPlaceholderText('Год');
    
    fireEvent.change(titleInput, { target: { value: 'Тестовая книга' } });
    fireEvent.change(authorInput, { target: { value: 'Тестовый автор' } });
    fireEvent.change(yearInput, { target: { value: '2024' } });
    
    // Отправляем форму
    const submitButton = screen.getByRole('button', { name: 'Добавить книгу' });
    fireEvent.click(submitButton);
    
    // Проверяем, что мутация была вызвана с правильными данными
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        title: 'Тестовая книга',
        author: 'Тестовый автор',
        year: 2024,
        description: ''
      });
    });
  });
});