import { create } from "zustand";
import { Recipe } from "@/types/recipes";
import axiosInstance from "@/service/api";

interface RecipeStore {
  recipes: Recipe[];
  recipe: Recipe | null;
  recipesRecommend: Recipe[];
  isLoading: boolean;
  error: string | null;
  categories: string[];
  fetchRecipes: () => Promise<void>;
  fetchRecipe: (idRecipe: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchRecommendRecipes: () => Promise<void>;
  searchRecipes: (filters: RecipeFilters) => Promise<void>;
  addRecipe: (recipeData: Omit<Recipe, "id">) => Promise<void>;
  deleteRecipe: (recipeId: string) => Promise<void>;
}

export interface RecipeFilters {
  name?: string;
  foodType?: string;
  category?: string;
  difficulty?: number;
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  recipe: null,
  recipesRecommend: [],
  categories: [],
  isLoading: false,
  error: null,

  fetchRecipes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/recipes`);
      set({ recipes: response.data?.data as Recipe[], isLoading: false });
    } catch (err) {
      console.error("Error fetching recipes:", err);
      set({ isLoading: false, error: "Failed to fetch recipes." });
    }
  },
  fetchRecipe: async (idRecipe: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/recipes/${idRecipe}`);
      set({ recipe: response.data?.data as Recipe, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: "Failed to fetch recipes." });
    }
  },
  fetchRecommendRecipes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/recipes/recommend`);
      set({ recipesRecommend: response.data?.data as Recipe[], isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: "Failed to fetch recipes." });
    }
  },
  searchRecipes: async (filters: RecipeFilters) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append("name", filters.name);
      if (filters.foodType) params.append("food_type", filters.foodType);
      if (filters.category) params.append("category", filters.category);
      if (filters.difficulty) params.append("difficulty", filters.difficulty.toString());

      const response = await axiosInstance.get(`/recipes?${params.toString()}`);
      set({ recipes: response.data?.data as Recipe[], isLoading: false });
    } catch (err) {
      console.error("Error searching recipes:", err);
      set({ isLoading: false, error: "Failed to search recipes." });
    }
  },
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/recipes/categories`);
      set({ categories: response.data?.data as string[], isLoading: false });
    } catch (err) {
      console.error("Error fetching categories:", err);
      set({ isLoading: false, error: "Failed to fetch categories." });
    }
  },
  addRecipe: async (recipeData) => {
    try {
      const response = await axiosInstance.post(`/recipes`, recipeData);
      set((state) => ({ recipes: [...state.recipes, response.data as Recipe] }));
    } catch (err) {
      console.error("Error adding recipe:", err);
      set({ error: "Failed to add recipe." });
    }
  },

  deleteRecipe: async (recipeId) => {
    try {
      await axiosInstance.delete(`/recipes/${recipeId}`);
      set((state) => ({
        recipes: state.recipes.filter((r) => r.id !== recipeId),
      }));
    } catch (err) {
      console.error("Error deleting recipe:", err);
      set({ error: "Failed to delete recipe." });
    }
  },
}));
