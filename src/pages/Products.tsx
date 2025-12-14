import { InputText, Select } from "@/components/common";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProductStore } from "@/store/useProductStore";
import { useUserStore } from "@/store/useUserStore";
import { Product, UserProducts } from "@/types/user";
import { Refrigerator, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const productInit = {
  id: "",
  name: "",
  default_unit: "",
};

const Products = () => {
  const { userProducts, addProduct, deleteProduct } = useUserStore();
  const { products } = useProductStore();
  const [selectedProduct, setSelectedProduct] = useState(productInit);
  const [newProduct, setNewProduct] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const productId = selectedProduct.id;
    const quantityValue = newProduct?.trim();

    if (!productId || !quantityValue || parseFloat(quantityValue) <= 0) {
      toast({
        title: "Error de Formulario",
        description: "Por favor selecciona un producto y especifica una cantidad válida (> 0).",
        variant: "destructive",
      });
      return;
    }

    const productToAdd = products.find((p) => p.id === productId);

    if (!productToAdd) {
      toast({
        title: "Error",
        description: "No se encontró el producto en la lista de opciones.",
        variant: "destructive",
      });
      return;
    }

    const isDuplicated = userProducts?.some((p) => p.id === productToAdd.id);
    if (isDuplicated) {
      toast({
        title: "Producto duplicado",
        description: `${productToAdd.name} ya está en tu lista. Considera actualizar la cantidad.`,
        variant: "destructive",
      });
      return;
    }

    const newData = { product: productToAdd, quantity: parseFloat(quantityValue) } as Partial<UserProducts>;
    addProduct(newData as unknown as UserProducts);

    setSelectedProduct(productInit);
    setNewProduct("");

    toast({
      title: "¡Producto agregado!",
      description: `${productToAdd.name} (cantidad: ${quantityValue} KG) se ha añadido a tu heladera.`,
    });
  };

  const handleRemoveProduct = (productToRemove: UserProducts) => {
    deleteProduct(productToRemove.product.id);

    toast({
      title: "Producto eliminado",
      description: `${productToRemove?.product?.name} se ha removido de tu heladera.`,
    });
  };

  const onProductChange = (newValue) => {
    const foundProduct = products.find((p) => p.id === newValue);

    setSelectedProduct({
      id: newValue,
      name: foundProduct ? foundProduct.name : "",
      default_unit: foundProduct ? foundProduct?.defaultUnit : "",
    });

    setNewProduct("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Heladera</h1>
          <p className="text-gray-600">Gestiona los productos que tienes disponibles</p>
        </div>

        <div className="grid xl:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <CardTitle>Agregar Producto</CardTitle>
              </div>
              <CardDescription>Añade productos que tienes en tu heladera</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <Label htmlFor="product">Producto y cantidad</Label>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <Select
                      options={products}
                      value={selectedProduct.id}
                      onChange={onProductChange}
                      placeholder="Buscar producto..."
                    />
                  </div>
                  <div className="w-1/2">
                    <InputText>
                      <InputText.Input
                        type="number"
                        placeholder="Ej: 1.5"
                        disabled={!selectedProduct.id}
                        value={newProduct}
                        onChange={(e) => setNewProduct(e.target.value)}
                      />
                      <InputText.Addon position="end">{selectedProduct.default_unit}</InputText.Addon>
                    </InputText>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  Agregar Producto
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Refrigerator className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle>Productos Disponibles</CardTitle>
              </div>
              <CardDescription>
                {userProducts?.length} producto{userProducts?.length !== 1 ? "s" : ""} en tu heladera
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userProducts?.length === 0 ? (
                <Alert>
                  <ShoppingCart className="h-4 w-4" />
                  <AlertDescription>No tienes productos registrados. ¡Comienza agregando algunos!</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {userProducts?.map((product, index) => (
                    <div
                      key={index}
                      className="
    flex items-center justify-between 
    p-4 m-2 
    bg-white 
    rounded-xl 
    shadow-lg 
    hover:shadow-xl 
    transition duration-300 ease-in-out 
    border border-green-100
"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className="
            flex items-center justify-center 
            w-8 h-8 
            bg-green-100 
            text-green-700 
            rounded-full 
            flex-shrink-0
        "
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4.354l.35.35L17.65 9.65.65 9.65l5.3-5.3.35-.35zM5.232 4.354a2.25 2.25 0 00-3.182 0l-.09.09-2.25 2.25a2.25 2.25 0 000 3.182l10.99 10.99a2.25 2.25 0 003.182 0l.09-.09 2.25-2.25a2.25 2.25 0 000-3.182L15.932 4.354z"
                            />
                          </svg>
                        </div>

                        <span
                          className="
            font-semibold 
            text-gray-800 
            truncate 
            text-base
        "
                        >
                          {product?.product?.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span
                          className="
            text-sm 
            font-bold 
            text-green-600 
            bg-green-50 
            px-3 py-1 
            rounded-full 
            border border-green-200
        "
                        >
                          {product?.quantity} {product?.product?.defaultUnit}
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(product)}
                          className="
                text-red-500 
                hover:text-white 
                hover:bg-red-600 
                transition duration-150 
                rounded-full 
                p-2
            "
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
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
