import { useState, useEffect } from "react";
import { Product } from "../types";
import { InventoryService } from "../services/inventory.service";

export function useInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessing, setIsProcessing] = useState<string | null>(null); // ใช้สำหรับ Loading ของปุ่มต่างๆ

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await InventoryService.getProducts();
            setProducts(data);
        } finally {
            setIsLoading(false);
        }
    };

    const buyProduct = async (productId: string) => {
        setIsProcessing(productId);
        try {
            await InventoryService.purchaseProduct(productId, 1);
            await fetchProducts();
            return true;
        } catch (error) {
            alert("Failed: " + error);
            return false;
        } finally {
            setIsProcessing(null);
        }
    };

    // ✅ ฟังก์ชันเพิ่มสินค้า
    const addProduct = async (product: Omit<Product, "id">) => {
        setIsProcessing("add-new");
        try {
            await InventoryService.addProduct(product);
            await fetchProducts();
        } catch (error) {
            alert("Failed to add product");
        } finally {
            setIsProcessing(null);
        }
    };

    // ✅ ฟังก์ชันอัปเดต
    const updateProduct = async (id: string, updates: Partial<Product>) => {
        setIsProcessing(id);
        try {
            await InventoryService.updateProduct(id, updates);
            await fetchProducts();
        } catch (error) {
            alert("Failed to update product");
        } finally {
            setIsProcessing(null);
        }
    };

    // ✅ ฟังก์ชันลบ
    const deleteProduct = async (id: string) => {
        setIsProcessing(id);
        try {
            await InventoryService.deleteProduct(id);
            await fetchProducts();
        } catch (error) {
            alert("Failed to delete product");
        } finally {
            setIsProcessing(null);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        isLoading,
        isProcessing,

        buyProduct,
        addProduct,
        updateProduct,
        deleteProduct
    };
}