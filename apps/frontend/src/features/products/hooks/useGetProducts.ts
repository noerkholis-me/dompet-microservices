import { useQuery } from '@tanstack/react-query';
import { productKeys } from '../api/product.keys';
import { getAllProducts } from '../api/product';

export const useGetProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: getAllProducts,
  });
};
