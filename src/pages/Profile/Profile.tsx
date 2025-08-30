import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { ImcCategory } from "@/types/imcCategory";
import { Calculator, Ruler, Scale, User, Mail } from "lucide-react";
import { useState } from "react";
import ProfileUserCard from "./ProfileUserCard";

const Profile = () => {
  const { updateUser } = useUserStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    weight: null,
    height: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const weight = formData?.weight;
    const height = formData?.height;

    if (!weight || !height || weight <= 0 || height <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa valores válidos para peso y altura.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    try {
      await updateUser({
        weight,
        height,
      });

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus datos han sido guardados correctamente.",
      });
    } catch (error) {
      console.log("🚀 ~ handleSubmit ~ error:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getImcColor = (category: ImcCategory) => {
    switch (category) {
      case ImcCategory.BajoPeso:
        return "text-blue-600";
      case ImcCategory.PesoNormal:
        return "text-green-600";
      case ImcCategory.Sobrepeso:
        return "text-yellow-600";
      case ImcCategory.Obesidad:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información nutricional</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <User className="h-6 w-6 text-green-600 mr-2" />
                <CardTitle>Información Personal</CardTitle>
              </div>
              <CardDescription>Tu información básica de cuenta</CardDescription>
            </CardHeader>
            <ProfileUserCard user={user} />
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Scale className="h-6 w-6 text-blue-600 mr-2" />
                <CardTitle>Datos Físicos</CardTitle>
              </div>
              <CardDescription>Ingresa tu peso y altura para calcular tu IMC</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <div className="relative">
                      <Scale className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        step="0.1"
                        min={0}
                        placeholder={String(user?.userProfiles?.weight)}
                        value={formData.weight || ""}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <div className="relative">
                      <Ruler className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        min={0}
                        placeholder={String(user?.userProfiles?.height)}
                        value={formData.height || ""}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Datos"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {user && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center">
                <Calculator className="h-6 w-6 text-purple-600 mr-2" />
                <CardTitle>Índice de Masa Corporal (IMC)</CardTitle>
              </div>
              <CardDescription>Calculado automáticamente basado en tu peso y altura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{user?.userProfiles.imc}</p>
                  <p className="text-sm text-gray-500">kg/m²</p>
                </div>
                <Badge
                  variant="secondary"
                  className={`text-lg px-4 py-2 ${getImcColor(user?.userProfiles?.imc_category as ImcCategory)}`}
                >
                  {user?.userProfiles?.imc_category}
                </Badge>
              </div>

              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Categorías de IMC:</strong>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <span>Bajo peso: &lt; 18.5</span>
                  <span>Sobrepeso: 25.0 - 29.9</span>
                  <span>Peso normal: 18.5 - 24.9</span>
                  <span>Obesidad: ≥ 30.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Profile;
