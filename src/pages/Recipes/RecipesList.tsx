import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, ChefHat, Utensils, Flame } from "lucide-react";
import { difficultyNumber, Recipe, RecipeDifficulty } from "@/types/recipes";
import Image from "@/components/Image";
import { useNavigate } from "react-router-dom";

interface RecipesListProps {
  recipes: Recipe[];
  searchTerm: string;
  getAvailableIngredients: (recipeIngredients: string[]) => string[];
}

const RecipesList: React.FC<RecipesListProps> = ({ recipes, searchTerm, getAvailableIngredients }) => {
  const navigate = useNavigate();
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case RecipeDifficulty.FACIL:
        return "bg-green-100 text-green-800";
      case RecipeDifficulty.INTERMEDIO:
        return "bg-yellow-100 text-yellow-800";
      case RecipeDifficulty.DIFICIL:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (recipes.length === 0 && searchTerm !== "") {
    return (
      <Alert>
        <ChefHat className="h-4 w-4" />
        <AlertDescription>No hay recetas disponibles para la búsqueda actual.</AlertDescription>
      </Alert>
    );
  }

  if (recipes.length === 0 && searchTerm === "") {
    return (
      <Alert>
        <ChefHat className="h-4 w-4" />
        <AlertDescription>
          No hay recetas disponibles con los ingredientes actuales. Intenta agregar más productos a tu heladera o busca
          algo diferente.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="mb-6 text-center">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {recipes.length} receta{recipes.length !== 1 ? "s" : ""} disponible{recipes.length !== 1 ? "s" : ""}
        </Badge>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card
            key={recipe.id}
            className="hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/recipes/${recipe.id}`)}
          >
            <div className="relative w-full h-48">
              {recipe?.isRecommend && (
                <div className="absolute top-0 left-0 z-10 p-2">
                  <label className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">Recomendada</label>
                </div>
              )}
              <Image src={recipe.imageUrl} alt={recipe.name} className="object-cover rounded-t-lg w-full h-full" />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{recipe.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getDifficultyColor(difficultyNumber[recipe.difficulty])}>
                      {difficultyNumber[recipe.difficulty]}
                    </Badge>
                    <Badge variant="outline">{recipe.category}</Badge>
                  </div>
                </div>
                <Utensils className="h-6 w-6 text-gray-400" />
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {recipe.cookingTime} minutos
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Flame className="h-4 w-4" />
                <p> {recipe.calories} kcal</p>
              </div>
            </CardHeader>
            {/*   <CardContent className="pt-0"> */}
            {/*             <div className="mb-4">
                <h4 className="font-medium text-sm mb-2">Ingredientes necesarios:</h4>
                <div className="flex flex-wrap gap-1">
                  {recipe?.ingredients?.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => {
                      const available = getAvailableIngredients([ingredient.name]).length > 0;
                      return (
                        <Badge
                          key={index}
                          variant={available ? "default" : "outline"}
                          className={`text-xs ${
                            available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {ingredient.name}
                        </Badge>
                      );
                    })
                  ) : (
                    <h2>No hay ingredientes</h2>
                  )}
                </div>
              </div> */}
            {/*         <div>
                <p>{recipe.foodType}</p>
              </div> */}
            {/*  <div>
                <h4 className="font-medium text-sm mb-2">Instrucciones:</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  {recipe.steps.length === 0 ? (
                    <li>No hay instrucciones disponibles para esta receta.</li>
                  ) : (
                    recipe.steps.map((instruction, index) => (
                      <li key={index} className="flex">
                        <span className="text-green-600 font-medium mr-2 min-w-[1.5rem]">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))
                  )}
                </ol>
              </div> */}
            {/*             </CardContent> */}
          </Card>
        ))}
      </div>
    </>
  );
};

export default React.memo(RecipesList);
