// input-group.tsx

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input"; // Componente base Input de shadcn/ui

// 1. Tipos para la posición del Addon
type AddonPosition = "start" | "end";

// 2. Props para el Input principal
interface InputGroupInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Omitimos className y otros para pasarlos solo al input
}

// 3. Props para el Addon
interface InputGroupAddonProps extends React.HTMLAttributes<HTMLSpanElement> {
  // El contenido del Addon (texto, icono o botón)
  children: React.ReactNode;
  // Posición donde se ubicará el Addon
  position?: AddonPosition;
}

// 4. Props para el componente principal
interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// input-group.tsx (Continuación)

// Helper para encontrar el Addon y el Input
const getChildrenByType = (children: React.ReactNode, type: React.ElementType) => {
  return React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === type);
};

// --- Subcomponente Addon ---
const InputGroupAddon: React.FC<InputGroupAddonProps> = ({ children, position = "end", className, ...props }) => {
  return (
    <span
      className={cn(
        "flex items-center text-sm text-muted-foreground bg-accent/30 h-10 px-3",
        "whitespace-nowrap", // Evita saltos de línea
        position === "start" ? "border-r rounded-l-md border-input" : "border-l rounded-r-md border-input",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
InputGroupAddon.displayName = "InputGroupAddon";

// --- Subcomponente Input ---
const InputGroupInput: React.FC<InputGroupInputProps> = ({ className, ...props }) => {
  return (
    <Input className={cn("flex-1 h-10 px-3 focus-visible:ring-0 focus-visible:ring-offset-0", className)} {...props} />
  );
};
InputGroupInput.displayName = "InputGroupInput";

export const InputText: React.FC<InputGroupProps> & {
  Input: typeof InputGroupInput;
  Addon: typeof InputGroupAddon;
} = ({ children, className, ...props }) => {
  // Extraemos los subcomponentes
  const addonStart = getChildrenByType(children, InputGroupAddon).filter(
    (child: any) => child.props.position === "start"
  );
  const addonEnd = getChildrenByType(children, InputGroupAddon).filter(
    (child: any) => child.props.position !== "start"
  );
  const input = getChildrenByType(children, InputGroupInput);

  // Clases condicionales para el redondeo del Input
  const inputClass = cn(
    "flex-1 h-10 border-none px-3 focus-visible:ring-0 focus-visible:ring-offset-0",
    {
      // Si hay un Addon al inicio, eliminamos el redondeo izquierdo del Input
      "rounded-l-none": addonStart.length > 0,
      // Si hay un Addon al final, eliminamos el redondeo derecho del Input
      "rounded-r-none": addonEnd.length > 0,
    },
    // Si no hay Addons, el input debe tener redondeo completo
    addonStart.length === 0 && addonEnd.length === 0 ? "rounded-md border border-input" : ""
  );

  return (
    <div
      className={cn(
        "flex items-center",
        "rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        // Clases especiales si hay o no Addons para evitar doble borde
        addonStart.length > 0 || addonEnd?.length > 0 ? "focus-within:ring-offset-0" : "",
        className
      )}
      {...props}
    >
      {/* 1. Addon al inicio (Prefix) */}
      {addonStart}

      {/* 2. El Input principal */}
      {/* Clonamos el Input para inyectar las clases condicionales */}
      {input.length > 0 &&
        React.cloneElement(input[0] as React.ReactElement, {
          className: inputClass,
        })}

      {/* 3. Addon al final (Suffix/Icon) */}
      {addonEnd}
    </div>
  );
};

// 4. Asignar los subcomponentes al componente Raíz (TS)
InputText.Input = InputGroupInput;
InputText.Addon = InputGroupAddon;
