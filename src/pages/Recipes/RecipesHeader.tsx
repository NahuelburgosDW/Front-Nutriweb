import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RecipesHeaderProps {
  searchTerm: string;
  categories: string[];
  selectedCategory: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchQuickly: (data: string) => void;
}

const RecipesHeader: React.FC<RecipesHeaderProps> = ({
  searchTerm,
  categories,
  selectedCategory,
  onSearchChange,
  onSearchQuickly,
}) => {
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Buscar recetas o ingredientes..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onSearchQuickly(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RecipesHeader;
