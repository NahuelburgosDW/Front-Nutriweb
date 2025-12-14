import { create } from "zustand";
import { Product, User, UserProducts } from "@/types/user";
import axiosInstance from "@/service/api";
import { useAuthStore } from "./useAuthStore";

interface UserStore {
  user: User | null;
  userProducts: UserProducts[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  addProduct: (product: UserProducts) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  setUserProducts: (products: UserProducts[]) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  userProducts: [],
  setUser: (user) => set({ user }),
  updateUser: async (data: Partial<User>, id = 1) => {
    try {
      const authStore = useAuthStore.getState();
      const res = await axiosInstance.patch(`/users/${id}`, data);
      authStore.updateUser(res?.data?.data as any);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  },
  setUserProducts: (products: UserProducts[]) => {
    set({ userProducts: products });
  },
  addProduct: async (data: UserProducts) => {
    const { product } = data;
    try {
      const userState = useAuthStore.getState().user;
      if (!userState || !userState.id) {
        throw new Error("User ID is not available.");
      }

      const url = `/users/${userState?.id}/products/${product?.id}`; // Nota: La API solo necesita el ID del producto, no la cantidad.

      // 1. Ejecutar el POST a la API
      await axiosInstance.post(url, { quantity: data.quantity });

      set((state) => ({
        userProducts: [...state.userProducts, data],
      }));
    } catch (err) {
      console.error("Failed to add product:", err);
      set({ error: "Failed to add product." });
    }
  },
  deleteProduct: async (productId) => {
    try {
      const userState = useAuthStore.getState().user;
      if (!userState || !userState.id) {
        throw new Error("User ID is not available.");
      }
      await axiosInstance.delete(`/users/${userState.id}/products/${productId}`);
      set((state) => ({
        userProducts: state.userProducts.filter((product) => product.product.id !== productId),
      }));
    } catch (err) {
      console.error("Failed to delete product:", err);
      set({ error: "Failed to delete product." });
    }
  },
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/1`);
      if (response.data) {
        const fetchedUser = response.data;
        set({ user: fetchedUser?.data as User, userProducts: fetchedUser?.data?.products, isLoading: false });
      } else {
        set({ isLoading: false, error: "User data not found." });
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      set({ isLoading: false, error: "Failed to fetch user data." });
    }
  },
}));
