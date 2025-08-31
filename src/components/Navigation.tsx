import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { ChefHat, Menu, X } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, isLoggedIn, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/login");
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => location.pathname === path;
  if (location.pathname.includes("login")) return null;

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <Link to="/" className="flex items-center">
            <ChefHat className="h-8 w-8 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Nutriweb</h1>
          </Link>

          {/* Menú de escritorio */}
          <nav className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <Link to="/profile">
                  <Button variant={isActive("/profile") ? "default" : "ghost"}>Perfil</Button>
                </Link>
                <Link to="/products">
                  <Button variant={isActive("/products") ? "default" : "ghost"}>Productos</Button>
                </Link>
                <Link to="/recipes">
                  <Button variant={isActive("/recipes") ? "default" : "ghost"}>Recetas</Button>
                </Link>
                {isLoggedIn && (
                  <Button variant="outline" onClick={handleLogout}>
                    Cerrar Sesión
                  </Button>
                )}
              </>
            )}
          </nav>

          {/* Botón para menú móvil */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {isMenuOpen && user && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t z-10">
          <div className="flex flex-col p-4 space-y-2">
            {user && (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant={isActive("/profile") ? "default" : "ghost"} className="w-full justify-start">
                    Perfil
                  </Button>
                </Link>
                <Link to="/products" onClick={() => setIsMenuOpen(false)}>
                  <Button variant={isActive("/products") ? "default" : "ghost"} className="w-full justify-start">
                    Productos
                  </Button>
                </Link>
                <Link to="/recipes" onClick={() => setIsMenuOpen(false)}>
                  <Button variant={isActive("/recipes") ? "default" : "ghost"} className="w-full justify-start">
                    Recetas
                  </Button>
                </Link>
                {isLoggedIn && (
                  <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                    Cerrar Sesión
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default memo(Navigation);
