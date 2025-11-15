import { create } from "zustand";
import { Product, User } from "@/types/user";
import axiosInstance from "@/service/api";
import { useAuthStore } from "./useAuthStore";

interface UserStore {
  user: User | null;
  userProducts: Product[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  addProduct: (product: Product) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  setUserProducts: (products: Product[]) => void;
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
  setUserProducts: (products: Product[]) => {
    set({ userProducts: products });
  },
  addProduct: async (product: Product) => {
    try {
      const userState = useAuthStore.getState().user;
      if (!userState || !userState.id) {
        throw new Error("User ID is not available.");
      }

      const url = `/users/${userState?.id}/products/${product?.id}`;

      await axiosInstance.post(url);
      set((state) => ({ userProducts: [...state.userProducts, product] }));
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
        userProducts: state.userProducts.filter((product) => product.id !== productId),
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
