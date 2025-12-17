import { Product } from "../types";

// Mock Data สินค้าเริ่มต้น
let MOCK_PRODUCTS: Product[] = [
    {
        id: "p-001",
        name: "Pro Developer Keyboard",
        price: 4500,
        stock: 5,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=400&q=80",
    },
    {
        id: "p-002",
        name: "Debugging Coffee Mug",
        price: 350,
        stock: 20,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1517260739337-6799d239ce83?w=400&q=80",
    },
    {
        id: "p-003",
        name: "Modular Monolith E-Book",
        price: 990,
        stock: 100,
        category: "digital",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    },
];

export const InventoryService = {
    async getProducts(): Promise<Product[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return [...MOCK_PRODUCTS];
    },

    async purchaseProduct(productId: string, quantity: number): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const productIndex = MOCK_PRODUCTS.findIndex((p) => p.id === productId);
        if (productIndex === -1) throw new Error("Product not found");
        const product = MOCK_PRODUCTS[productIndex];
        if (product.stock < quantity) throw new Error("Out of stock!");

        MOCK_PRODUCTS[productIndex] = { ...product, stock: product.stock - quantity };
        return true;
    },

    // ✅ เพิ่มสินค้าใหม่
    async addProduct(product: Omit<Product, "id">): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const newProduct: Product = {
            ...product,
            id: `p-${Date.now()}`, // สร้าง ID อัตโนมัติ
        };
        MOCK_PRODUCTS.push(newProduct);
        return newProduct;
    },

    // ✅ อัปเดตสินค้า
    async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
        if (index === -1) throw new Error("Product not found");

        MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...updates };
        return MOCK_PRODUCTS[index];
    },

    // ✅ ลบสินค้า
    async deleteProduct(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        MOCK_PRODUCTS = MOCK_PRODUCTS.filter((p) => p.id !== id);
    }
};