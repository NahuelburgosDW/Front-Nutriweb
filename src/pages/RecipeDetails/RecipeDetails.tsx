import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Image from "@/components/Image";
import { Star, StarHalf, Text } from "lucide-react";
import StarRating from "@/components/StartRating";

// Registrar los elementos de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);
const recipe = {
  id: "1",
  name: "Tarta de Manzana",
  ingredients: [
    { name: "Manzanas", quantity: "4 unidades" },
    { name: "Harina", quantity: "250g" },
  ],
  instructions: "Precalentar el horno a 180°C. Mezclar la harina con...",
  cookingTime: 60,
  difficulty: "Intermedio",
  category: "Postre",
  steps: ["Prepara la masa.", "Corta las manzanas.", "Hornea durante 40 minutos."],
  imageUrl: "https://cdn0.recetasgratis.net/es/posts/4/9/1/ensalada_de_quinoa_con_aguacate_y_atun_59194_orig.jpg",
  foodType: "Vegetariano",
  calories: 350,
};
// Componente para la pantalla de detalle de la receta
const RecipeDetail = () => {
  if (!recipe) {
    return <div>No se encontró la receta.</div>;
  }

  // Datos para el gráfico de calorías
  const pieChartData = {
    labels: ["Calorías", "Resto"],
    datasets: [
      {
        data: [recipe.calories, 2000 - recipe.calories], // Asume un valor diario de 2000
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
          <ul className="list-disc pl-6 text-gray-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="mb-1">
                {ingredient.quantity} {ingredient.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Instrucciones y pasos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Instrucciones</h2>
          <p className="text-gray-700 leading-relaxed text-justify">{recipe.instructions}</p>
        </div>

        {/* Pasos de la receta */}
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
