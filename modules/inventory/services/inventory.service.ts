import { Product } from "../types";
import { StorageAdapter } from "@/lib/storage"; // Import ตัวช่วยที่เราเพิ่งสร้าง

const STORAGE_KEY = "inventory_data";

// ข้อมูลตั้งต้น (จะถูกใช้แค่ครั้งแรกที่เปิดเว็บ)
const INITIAL_PRODUCTS: Product[] = [
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

// Helper: โหลดข้อมูลจาก Storage ถ้าไม่มีให้เอาค่าเริ่มต้น
const getDB = () => StorageAdapter.getItem<Product[]>(STORAGE_KEY, INITIAL_PRODUCTS);
// Helper: บันทึกข้อมูลลง Storage
const saveDB = (data: Product[]) => StorageAdapter.setItem(STORAGE_KEY, data);

export const InventoryService = {
    async getProducts(): Promise<Product[]> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return getDB(); // ✅ อ่านจาก LocalStorage
    },

    async purchaseProduct(productId: string, quantity: number): Promise<boolean> {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const db = getDB();
        const productIndex = db.findIndex((p) => p.id === productId);

        if (productIndex === -1) throw new Error("Product not found");
        const product = db[productIndex];
        if (product.stock < quantity) throw new Error("Out of stock!");

        // ตัดสต็อก
        db[productIndex] = { ...product, stock: product.stock - quantity };
        saveDB(db); // ✅ บันทึกค่าใหม่
        return true;
    },

    async addProduct(product: Omit<Product, "id">): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const db = getDB();
        const newProduct: Product = { ...product, id: `p-${Date.now()}` };

        db.push(newProduct);
        saveDB(db); // ✅ บันทึก
        return newProduct;
    },

    async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const db = getDB();
        const index = db.findIndex((p) => p.id === id);
        if (index === -1) throw new Error("Product not found");

        db[index] = { ...db[index], ...updates };
        saveDB(db); // ✅ บันทึก
        return db[index];
    },

    async deleteProduct(id: string): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        let db = getDB();
        db = db.filter((p) => p.id !== id);
        saveDB(db); // ✅ บันทึก
    },

    async getStats() {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const db = getDB();
        const totalItems = db.length;
        const totalStock = db.reduce((acc, p) => acc + p.stock, 0);
        const lowStockItems = db.filter(p => p.stock < 5).length;
        const totalValue = db.reduce((acc, p) => acc + (p.price * p.stock), 0);

        return { totalItems, totalStock, lowStockItems, totalValue };
    }
};