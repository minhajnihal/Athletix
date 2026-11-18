
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getOrders,
  getOrderById,
  getUserOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/orderService";

// Custom hook for order operations
function useOrder() {
  const queryClient = useQueryClient();

  // GET: Fetch all orders
  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  // POST: Create a new order
  const addMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  // PATCH: Update an existing order
  const updateMutation = useMutation({
    mutationFn: updateOrder,
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders", updatedOrder.id],
      });
    },
  });

  // DELETE: Delete an order
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });

  // Update order status
  const changeOrderStatus = async (orderId, newStatus) => {
    return updateMutation.mutateAsync({
      id: orderId,
      status: newStatus,
    });
  };

  return {
    orders,
    isLoading,
    isError,
    error,
    refetch,

    addOrder: addMutation.mutateAsync,
    isAdding: addMutation.isPending,

    updateOrder: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteOrder: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    changeOrderStatus,
  };
}

// GET: Fetch orders belonging to a particular user
export function useOrdersByUser(email) {
  return useQuery({
    queryKey: ["orders", "user", email],
    queryFn: () => getUserOrders(email),
    enabled: Boolean(email),
  });
}

// GET: Fetch a single order by ID
export function useOrderById(id) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    enabled: Boolean(id),
  });
}

export default useOrder;
