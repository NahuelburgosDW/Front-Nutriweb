import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/store/useProductStore";
import { useUserStore } from "@/store/useUserStore";
import { Product } from "@/types/user";
import { Plus, Refrigerator, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const { userProducts, addProduct, deleteProduct } = useUserStore();
  const { products } = useProductStore();
  const [newProduct, setNewProduct] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProduct.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un producto válido.",
        variant: "destructive",
      });
      return;
    }

    const trimmedProduct = newProduct.trim().toLowerCase();

    if (userProducts.some((p) => p.name?.toLowerCase() === trimmedProduct)) {
      toast({
        title: "Producto duplicado",
        description: "Este producto ya está en tu lista.",
        variant: "destructive",
      });
      return;
    }

    setNewProduct("");

    toast({
      title: "¡Producto agregado!",
      description: `${newProduct.trim()} se ha añadido a tu heladera.`,
    });
  };

  const handleRemoveProduct = (productToRemove: string) => {
    deleteProduct(productToRemove);

    toast({
      title: "Producto eliminado",
      description: `${productToRemove} se ha removido de tu heladera.`,
    });
  };

  const handleQuickAdd = (product: Product) => {
    if (userProducts.some((p) => p.id?.toLowerCase() === product.name?.toLowerCase())) {
      toast({
        title: "Producto duplicado",
        description: "Este producto ya está en tu lista.",
        variant: "destructive",
      });
      return;
    }

    addProduct(product);

    toast({
      title: "¡Producto agregado!",
      description: `${product} se ha añadido a tu heladera.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Heladera</h1>
          <p className="text-gray-600">Gestiona los productos que tienes disponibles</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Plus className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle>Agregar Producto</CardTitle>
              </div>
              <CardDescription>Añade productos que tienes en tu heladera</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Nombre del producto</Label>
                  <Input
                    id="product"
                    type="text"
                    placeholder="Ej: Tomate, Queso, Huevos..."
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Agregar Producto
                </Button>
              </form>

              <div className="mt-6">
                <Label className="text-sm font-medium mb-3 block">Productos comunes:</Label>
                <div className="flex flex-wrap gap-2">
                  {products
                    .filter(
                      (p) => !userProducts.some((existing) => existing?.name?.toLowerCase() === p?.name?.toLowerCase())
                    )
                    .slice(0, 8)
                    .map((product) => (
                      <Button
                        key={product.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAdd(product)}
                        className="text-xs"
                      >
                        + {product.name}
                      </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Refrigerator className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle>Productos Disponibles</CardTitle>
              </div>
              <CardDescription>
                {userProducts.length} producto{userProducts.length !== 1 ? "s" : ""} en tu heladera
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProducts.length === 0 ? (
                <Alert>
                  <ShoppingCart className="h-4 w-4" />
                  <AlertDescription>No tienes productos registrados. ¡Comienza agregando algunos!</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{product.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {userProducts?.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Resumen de tu Heladera</CardTitle>
              <CardDescription>Estos son todos los productos que tienes disponibles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userProducts?.map((product, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {product.name}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant={"default"} onClick={() => navigate("/recipes")}>
                  Ver Recetas Disponible
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Products;
