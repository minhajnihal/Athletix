
import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
} from "../services/productService";

// Fetch all products
export function useProduct() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

// Fetch a single product
export function useProductById(id) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => getProductById(id),
    enabled: Boolean(id),
  });
}
