// test/setup.tsx или прямо в файле с тестом
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from './src/server/api/root'; // путь до твоего основного маршрутизатора
import { render } from '@testing-library/react';
// test/setupTests.ts
import '@testing-library/jest-dom';


// 1. Создай trpc instance
export const trpc = createTRPCReact<AppRouter>();

// 2. Хелпер для оборачивания компонента в нужные провайдеры
export function renderWithTRPC(ui: React.ReactElement) {
  const queryClient = new QueryClient();

  const client = trpc.createClient({
    links: [],
  });

  return render(
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </trpc.Provider>
  );
}
