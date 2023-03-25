import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCRouter } from '~/server/api/trpc';
import { PropsWithChildren } from 'react';
import superjson from 'superjson';
import fetch from 'node-fetch'

const globalAny = global as any;
globalAny.fetch = fetch;

const Router = createTRPCRouter({});
const trpcReact = createTRPCReact<typeof Router>();

const url = 'http://localhost:3000/api/trpc';

const queryClient = new QueryClient();

const trpcClient = trpcReact.createClient({
  links: [httpBatchLink({ url })],
  transformer: superjson,
});

const withNextTRPCProvider = ({ children }: PropsWithChildren<{}>) => {
  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpcReact.Provider>
  );
};

export default withNextTRPCProvider;
