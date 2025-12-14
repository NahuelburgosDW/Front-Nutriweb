// Función de normalización para eliminar acentos y convertir a minúsculas
export const normalizeText = (text: string): string => {
  if (!text) return "";
  return text
    .normalize("NFD") // Descompone el string en caracteres base y diacríticos (acentos)
    .replace(/[\u0300-\u036f]/g, "") // Elimina los diacríticos (acentos)
    .toLowerCase(); // Convierte a minúsculas
};
