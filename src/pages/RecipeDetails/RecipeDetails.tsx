import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Image from "@/components/Image";
import { AlertTriangle, CheckCircle, Star, StarHalf, Text, XCircle } from "lucide-react";
import { useRecipeStore } from "@/store/useRecipeStore";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";

ChartJS.register(ArcElement, Tooltip, Legend);
type StockStatus = "FULL" | "INSUFFICIENT" | "MISSING";
interface StockCheckResult {
  status: StockStatus;
  missingAmount: number;
  availableAmount: number;
}
const MissingAmountTooltip = ({ name, required, available, unit, missing, onClose }) => (
  <div className="absolute z-50 p-4 bg-white border border-red-300 rounded-lg shadow-xl right-0 top-full mt-2 w-64">
    <h4 className="font-bold text-red-600">¡Stock Insuficiente!</h4>
    <p className="text-sm mt-1">
      Para preparar <b>{name}</b> necesitas <b>{required}</b> <b>{unit}</b>, pero solo tienes{" "}
      <b>
        {available} {unit}
      </b>{" "}
      en tu inventario.
    </p>
    <p className="font-semibold text-base mt-2">
      Faltan:{" "}
      <span className="text-red-600">
        {missing.toFixed(2)} {unit}
      </span>
    </p>
    <button onClick={onClose} className="mt-3 text-xs text-blue-500 hover:text-blue-700">
      Cerrar
    </button>
  </div>
);

const RecipeDetail = () => {
  const { fetchRecipe, recipe } = useRecipeStore();
  const { userProducts } = useUserStore();
  const [showTooltipId, setShowTooltipId] = useState<string | null>(null);
  const params = useParams();
  const recipeId = params.id;

  useEffect(() => {
    fetchRecipe(recipeId);
  }, [fetchRecipe]);

  if (!recipe) {
    return <div>No se encontró la receta.</div>;
  }

  const pieChartData = {
    labels: ["Calorías", "Resto"],
    datasets: [
      {
        data: [recipe.calories, 2000 - recipe.calories],
        backgroundColor: ["#ef4444", "#f3f4f6"],
        borderColor: ["#ef4444", "#f3f4f6"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  const checkProductStock = (productId: string, requiredQuantity: string): StockCheckResult => {
    const userProductItem = userProducts.find((item) => item.product.id === productId);

    const reqQuantity = parseFloat(requiredQuantity);

    if (!userProductItem) {
      return { status: "MISSING", missingAmount: reqQuantity, availableAmount: 0 };
    }

    const userHasQuantity = userProductItem.quantity;

    if (userHasQuantity >= reqQuantity) {
      return { status: "FULL", missingAmount: 0, availableAmount: userHasQuantity };
    } else {
      const missing = reqQuantity - userHasQuantity;
      return { status: "INSUFFICIENT", missingAmount: missing, availableAmount: userHasQuantity };
    }
  };
  const IngredientItem = ({ ingredient }) => {
    const stockCheck = checkProductStock(ingredient.product.id, ingredient.quantity);

    const { status, missingAmount, availableAmount } = stockCheck;
    const isTooltipOpen = showTooltipId === ingredient.product.id;

    let containerClasses, icon, textClasses, quantityClasses;

    switch (status) {
      case "FULL":
        containerClasses = "bg-green-50/70 border border-green-200 shadow-sm";
        icon = <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />;
        textClasses = "text-green-800 font-medium text-base";
        quantityClasses = "text-green-700 bg-green-100";
        break;

      case "INSUFFICIENT":
        containerClasses = "bg-yellow-50/70 border border-yellow-200 shadow-sm";
        icon = (
          <AlertTriangle
            className="h-5 w-5 text-yellow-600 cursor-pointer flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltipId(isTooltipOpen ? null : ingredient.product.id);
            }}
          />
        );
        textClasses = "text-yellow-800 font-medium text-base";
        quantityClasses = "text-yellow-700 bg-yellow-100";
        break;

      case "MISSING":
      default:
        containerClasses = "bg-red-50/70 border border-red-200 shadow-sm opacity-85";
        icon = <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />;
        textClasses = "text-red-800 font-medium text-base line-through opacity-80";
        quantityClasses = "text-red-700 bg-red-100";
        break;
    }

    return (
      <li className="mb-1">
        <div className={`relative flex items-center justify-between p-3 my-2 rounded-lg ${containerClasses}`}>
          <div className="flex items-center space-x-3">
            {icon}
            <span className={textClasses}>{ingredient.product.name}</span>
          </div>
          <div className="flex items-center relative">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${quantityClasses}`}>
              {ingredient.quantity} {ingredient.product.defaultUnit}
            </span>

            {status === "INSUFFICIENT" && isTooltipOpen && (
              <MissingAmountTooltip
                name={ingredient.product.name}
                required={parseFloat(ingredient.quantity)}
                available={availableAmount}
                unit={ingredient.product.defaultUnit}
                missing={missingAmount}
                onClose={() => setShowTooltipId(null)}
              />
            )}
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden p-6 mx-auto max-w-4xl my-8">
      <div className="relative w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
        <div className="absolute top-4 right-4 z-50 bg-[#FFE183] text-gray-800 text-sm px-2 py-1 rounded-xl flex items-center space-x-1">
          <Star color="#FFAD30" fill="#FFAD30" height={15} />
          <span className="font-semibold">4.5</span>
        </div>
        <Image src={recipe.imageUrl} alt={recipe.name} className="object-cover w-full h-full rounded-t-lg" />

        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-md">
          {recipe.cookingTime} min • {recipe.difficulty}
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-8 mb-6">
        <div className="w-full mt-4 md:mt-0 md:w-1/2 text-center md:text-left">
          <h2 className="text-1xl font-bold text-gray-900 mb-2">{recipe.name}</h2>
          <h2 className="text-1xl font-bold text-gray-900 mb-2 text-left"></h2>
          <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-600 mb-4">
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {recipe.difficulty}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {recipe.cookingTime} min
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 11h.01M7 15h.01M17 7h.01M17 11h.01M17 15h.01M4 20h16a2 2 0 002-2V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {recipe.category}
            </span>
          </div>
          <p className="text-gray-700 font-bold text-lg">{recipe.foodType}</p>
        </div>
      </div>

      {/* Gráfico de calorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Calorías</h2>
          <div className="flex justify-center items-center">
            <div className="w-32 h-32 relative">
              <Pie data={pieChartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-red-500">
                {recipe.calories}
                <span className="text-sm font-normal text-gray-600 ml-1">kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredientes */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Ingredientes</h2>
          <ul className="list-none pl-0 text-gray-700">
            {recipe.recipeProducts?.map((ingredient, index) => (
              <IngredientItem key={index} ingredient={ingredient} />
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Instrucciones</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{recipe.instructions}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Pasos</h2>
          <ol className="list-decimal pl-6 text-gray-700">
            {recipe.steps.map((step, index) => (
              <li key={index} className="mb-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
