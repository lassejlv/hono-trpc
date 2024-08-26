import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import './index.css';

// trpc client
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '../../router.ts';

// create trpc client
export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
});

// create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
      refetchOnWindowFocus: true,
    },
  },
});

// Import all routes
const importRoutes = import.meta.glob('/src/routes/**/[a-z[]*.tsx');

// Create routes
async function createRoutes() {
  const routes = await Promise.all(
    Object.keys(importRoutes).map(async (route) => {
      const path = route
        .replace(/\/src\/routes|index|\.tsx$/g, '')
        .replace(/\[\.{3}.+\]/, '*')
        .replace(/\[(.+)\]/, ':$1');

      const module = (await importRoutes[route]()) as Record<string, any>;
      const Component = module.default;
      return { path, element: <Component /> };
    }),
  );

  // you can add more advanced routes here. Like 404
  const get404 = await import('./routes/404.tsx');
  routes.push({ path: '*', element: <get404.default /> });

  return createBrowserRouter(routes);
}

createRoutes().then((routesNew) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Toaster theme='dark' richColors />
        <RouterProvider router={routesNew} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
