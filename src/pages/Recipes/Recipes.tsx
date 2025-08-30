import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RecipeFilters, useRecipeStore } from "@/store/useRecipeStore";
import { useUserStore } from "@/store/useUserStore";
import { AlertCircle } from "lucide-react";
import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import RecipesHeader from "./RecipesHeader";
import RecipesList from "./RecipesList";

const debounce = <T extends any[]>(func: (...args: T) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

const RecipesPage = () => {
  const { userProducts } = useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories, searchRecipes, isLoading, recipesRecommend } = useRecipeStore();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const debouncedSearch = useRef(
    debounce((term: string) => {
      const userFilters: RecipeFilters = { name: term };
      searchRecipes(userFilters);
    }, 500)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setSearchParams({ q: newSearchTerm });
    debouncedSearch(newSearchTerm);
  };

  const getAvailableIngredients = (recipeIngredients: string[]) => {
    return recipeIngredients.filter((ingredient) =>
      userProducts.some(
        (product) =>
          product.name?.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(product.name?.toLowerCase())
      )
    );
  };

  const onSearchQuickly = (value: string) => {
    let userFilters: RecipeFilters = { category: value };
    if (value === "Todas") {
      userFilters = { category: "" };
    }
    setSelectedCategory(value);
    searchRecipes(userFilters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recetas Disponibles</h1>
          <p className="text-gray-600">Recetas que puedes preparar con los productos de tu heladera</p>
        </div>
        {userProducts.length === 0 ? (
          <Alert className="mb-8 flex items-center">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No tienes productos registrados en tu heladera.
              <Button asChild variant="link" className="px-2">
                <a href="/products">Agregar productos</a>
              </Button>
              para ver recetas recomendadas.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <RecipesHeader
              searchTerm={searchTerm}
              categories={categories}
              selectedCategory={selectedCategory}
              onSearchChange={handleSearchChange}
              onSearchQuickly={onSearchQuickly}
            />
            {isLoading ? (
              <div className="text-center mb-4 text-gray-600">Cargando recetas...</div>
            ) : (
              <RecipesList
                recipes={recipesRecommend}
                searchTerm={searchTerm}
                getAvailableIngredients={getAvailableIngredients}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default RecipesPage;
