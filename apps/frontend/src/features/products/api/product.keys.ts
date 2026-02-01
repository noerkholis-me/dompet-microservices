export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'lists'] as const,
  list: (id: string) => [...productKeys.lists(), id] as const,
  create: () => [...productKeys.lists()] as const,
  update: (id: string) => [...productKeys.lists(), id] as const,
  delete: (id: string) => [...productKeys.lists(), id] as const,
};
