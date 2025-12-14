import { Product } from "./user";

export enum RecipeDifficulty {
  FACIL = "Fácil",
  INTERMEDIO = "Intermedio",
  DIFICIL = "Difícil",
}

export const difficultyNumber: { [key: number]: RecipeDifficulty } = {
  1: RecipeDifficulty.FACIL,
  2: RecipeDifficulty.INTERMEDIO,
  3: RecipeDifficulty.DIFICIL,
};
export interface ProductUnit {
  id: string;
  name: string;
  description: string | null;
  defaultUnit: string;
}
export interface RecipeProductItem {
  recipeId: string;
  productId: string;
  quantity: number;
  product: ProductUnit;
}

export interface Recipe {
  id: string;
  name: string;
  instructions: string[];
  cookingTime: number; // in minutes
  difficulty: number; // Cambiado a number si no está tipificado
  category: string;
  steps: string[];
  imageUrl: string;
  foodType: string;
  calories: number;
  isRecommend?: boolean;
  recipeProducts?: RecipeProductItem[];
}
