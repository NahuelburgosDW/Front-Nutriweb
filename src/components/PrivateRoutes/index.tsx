import { useAuthStore } from "@/store/useAuthStore";
import { useProductStore } from "@/store/useProductStore";
import { useRecipeStore } from "@/store/useRecipeStore";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const { products, fetchProducts, isLoading: isProductsLoading } = useProductStore();
  const {
    recipes,
    fetchRecipes,
    fetchCategories,
    fetchRecommendRecipes,
    categories,
    isLoading: isRecipesLoading,
  } = useRecipeStore();

  useEffect(() => {
    if (isLoggedIn) {
      if (products?.length === 0 && !isProductsLoading) {
        fetchProducts();
      }
      if (recipes?.length === 0 && !isRecipesLoading) {
        /*      fetchRecipes(); */
        fetchRecommendRecipes();
      }
      if (categories?.length === 0 && !isRecipesLoading) {
        fetchCategories();
      }
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default PrivateRoute;
