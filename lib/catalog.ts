export type Category = "Vapers" | "Perfumes";

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  stock: number;
  active: boolean;
};

export type ProductImage = {
  id: string;
  url: string;
  objectKey?: string;
  alt: string;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  eyebrow: string;
  description: string;
  badge?: string;
  art: string;
  active: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
};

export const initialProducts: Product[] = [
  {
    id: "elfbar-rabbeats",
    name: "Elfbar RabBeats 50K",
    category: "Vapers",
    eyebrow: "50.000 pitadas",
    description: "Gran autonomía, indicador digital y sabores intensos para elegir.",
    art: "vape-blue",
    badge: "Más elegido",
    active: true,
    images: [],
    variants: [
      { id: "banana-ice", label: "Banana Ice", price: 30000, stock: 12, active: true },
      { id: "watermelon-ice", label: "Watermelon Ice", price: 30000, stock: 9, active: true },
      { id: "strawberry-ice", label: "Strawberry Ice", price: 31500, stock: 7, active: true },
    ],
  },
  {
    id: "ignite-v250",
    name: "Ignite V250",
    category: "Vapers",
    eyebrow: "25.000 pitadas",
    description: "Diseño compacto, doble modo de potencia y carga USB-C.",
    art: "vape-lime",
    badge: "Nuevo",
    active: true,
    images: [],
    variants: [
      { id: "blue-razz", label: "Blue Razz", price: 26500, stock: 8, active: true },
      { id: "peach-mango", label: "Peach Mango", price: 26500, stock: 6, active: true },
      { id: "mint", label: "Fresh Mint", price: 26500, stock: 0, active: true },
    ],
  },
  {
    id: "lost-mary",
    name: "Lost Mary MO20000",
    category: "Vapers",
    eyebrow: "20.000 pitadas",
    description: "Formato ergonómico con pantalla y regulación de potencia.",
    art: "vape-violet",
    active: true,
    images: [],
    variants: [
      { id: "grape", label: "Grape Ice", price: 24000, stock: 5, active: true },
      { id: "cherry", label: "Cherry Lemon", price: 24500, stock: 5, active: true },
      { id: "kiwi", label: "Kiwi Passion", price: 24500, stock: 4, active: true },
    ],
  },
  {
    id: "asad-black",
    name: "Asad Black",
    category: "Perfumes",
    eyebrow: "Ámbar · Vainilla · Especias",
    description: "Una fragancia intensa y envolvente, ideal para la noche.",
    art: "perfume-amber",
    badge: "Bestseller",
    active: true,
    images: [],
    variants: [
      { id: "30ml", label: "30 ml", price: 28000, stock: 6, active: true },
      { id: "50ml", label: "50 ml", price: 39000, stock: 4, active: true },
      { id: "100ml", label: "100 ml", price: 50000, stock: 3, active: true },
    ],
  },
  {
    id: "club-intense",
    name: "Club de Nuit Intense",
    category: "Perfumes",
    eyebrow: "Cítrico · Cuero · Amaderado",
    description: "Elegante, persistente y con una salida fresca muy marcada.",
    art: "perfume-ice",
    active: true,
    images: [],
    variants: [
      { id: "50ml", label: "50 ml", price: 45500, stock: 5, active: true },
      { id: "105ml", label: "105 ml", price: 72000, stock: 2, active: true },
    ],
  },
  {
    id: "yara-rose",
    name: "Yara Rose",
    category: "Perfumes",
    eyebrow: "Floral · Dulce · Cremoso",
    description: "Suave y femenino, con un corazón floral y fondo avainillado.",
    art: "perfume-rose",
    badge: "Últimas unidades",
    active: true,
    images: [],
    variants: [
      { id: "50ml", label: "50 ml", price: 36000, stock: 3, active: true },
      { id: "100ml", label: "100 ml", price: 58000, stock: 1, active: true },
    ],
  },
];

export function artForCategory(category: Category): string {
  return category === "Vapers" ? "vape-blue" : "perfume-amber";
}

export function makeId(value: string): string {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return normalized || crypto.randomUUID();
}
