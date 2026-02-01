export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },
  products: {
    all: ['products'] as const,
    list: (filters: string) => [...queryKeys.products.all, 'list', { filters }] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: () => [...queryKeys.transactions.all, 'list'] as const,
  },
};
