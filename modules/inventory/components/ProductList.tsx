"use client";

import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Lock, Package, AlertCircle, CreditCard, ArrowRight } from "lucide-react";
import { useIdentity } from "@/modules/identity";
import { usePayment } from "@/modules/payment";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function ProductList() {
    const { products, isLoading, isProcessing, buyProduct } = useInventory();
    const { user } = useIdentity();
    const { balance, pay } = usePayment();

    // State สำหรับเก็บสินค้าที่กำลังจะซื้อ (ถ้ามีค่า = เปิด Modal)
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    // ขั้นตอนที่ 1: กดปุ่ม Buy -> เปิด Modal
    const handleInitiatePurchase = (product: any) => {
        if (balance < product.price) {
            toast.error("ยอดเงินไม่พอครับ!", {
                description: `ขาดอีก ฿${(product.price - balance).toLocaleString()}`,
            });
            return;
        }
        setSelectedProduct(product);
    };

    // ขั้นตอนที่ 2: กด Confirm ใน Modal -> ตัดเงินจริง
    const confirmPurchase = async () => {
        if (!selectedProduct) return;

        const product = selectedProduct;
        // ปิด Modal ก่อนเพื่อเริ่ม Process
        setSelectedProduct(null);

        const promise = new Promise(async (resolve, reject) => {
            try {
                const paymentSuccess = await pay(product.price, `Buy: ${product.name}`);
                if (paymentSuccess) {
                    const inventorySuccess = await buyProduct(product.id);
                    if (inventorySuccess) resolve("Purchase successful");
                    else reject("Failed to update inventory");
                } else {
                    reject("Payment failed");
                }
            } catch (e) {
                reject(e);
            }
        });

        toast.promise(promise, {
            loading: 'Processing transaction...',
            success: (data) => `Purchased ${product.name} successfully!`,
            error: (err) => `Transaction failed: ${err}`,
        });
    };

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-purple-400" />
                    </div>
                    Available Products
                </h2>
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="text-right hidden sm:block">
                            <p className="text-xs text-zinc-500">Your Balance</p>
                            <p className="text-lg font-bold text-green-400">฿{balance.toLocaleString()}</p>
                        </div>
                    )}
                    <span className="text-zinc-500 text-sm border-l border-zinc-800 pl-4">{products.length} items</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-zinc-500 animate-pulse">
                    <Package className="w-12 h-12 opacity-50" />
                    <p>Loading inventory...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => {
                        const isOutOfStock = product.stock === 0;
                        const canAfford = balance >= product.price;

                        return (
                            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">

                                <div className="relative h-[240px] overflow-hidden bg-zinc-950">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="secondary" className={`backdrop-blur-md border-0 px-3 py-1.5 ${isOutOfStock ? 'bg-red-500/80 text-white' : 'bg-black/60 text-zinc-100'}`}>
                                            {isOutOfStock ? "Sold Out" : `Stock: ${product.stock}`}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-5 space-y-4">
                                    <div>
                                        <span className="inline-block rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                            {product.category}
                                        </span>
                                        <h3 className="line-clamp-1 text-xl font-bold text-zinc-100 group-hover:text-purple-300 transition-colors" title={product.name}>
                                            {product.name}
                                        </h3>
                                    </div>

                                    <div className="flex items-baseline gap-1 mt-auto">
                                        <span className="text-sm text-purple-400 font-bold">฿</span>
                                        <span className={`text-3xl font-extrabold ${isOutOfStock ? 'text-zinc-500 line-through' : (canAfford ? 'text-white' : 'text-red-400')}`}>
                                            {product.price.toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="pt-2">
                                        {user ? (
                                            <Button
                                                className={`w-full h-12 text-base font-medium transition-all relative overflow-hidden group/btn ${isOutOfStock
                                                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                                        : (canAfford
                                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25'
                                                            : 'bg-zinc-800 text-red-400 hover:bg-zinc-700 border border-red-900/30'
                                                        )
                                                    }`}
                                                disabled={isOutOfStock || isProcessing === product.id}
                                                // ✅ เปลี่ยนมาใช้ handleInitiatePurchase เพื่อเปิด Modal
                                                onClick={() => handleInitiatePurchase(product)}
                                            >
                                                <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-white/10"></div>

                                                {isProcessing === product.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                ) : (
                                                    canAfford
                                                        ? <ShoppingCart className={`w-5 h-5 mr-2 ${isOutOfStock ? 'opacity-50' : ''}`} />
                                                        : <AlertCircle className="w-5 h-5 mr-2" />
                                                )}

                                                {isOutOfStock
                                                    ? "Out of Stock"
                                                    : (canAfford ? "Buy Now" : "Insufficient Funds")}
                                            </Button>
                                        ) : (
                                            <Button variant="outline" disabled className="w-full h-12 border-zinc-700 bg-zinc-900/50 text-zinc-400 opacity-70">
                                                <Lock className="w-4 h-4 mr-2" /> Login to Purchase
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* --- PURCHASE CONFIRMATION MODAL --- */}
            <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <CreditCard className="w-5 h-5 text-purple-500" /> Confirm Purchase
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Please review your order details before confirming.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedProduct && (
                        <div className="py-4 space-y-4">
                            {/* Product Info */}
                            <div className="flex gap-4 p-3 bg-zinc-950/50 rounded-lg border border-zinc-800">
                                <img src={selectedProduct.image} className="w-16 h-16 rounded bg-zinc-900 object-cover" />
                                <div>
                                    <h4 className="font-bold text-zinc-200">{selectedProduct.name}</h4>
                                    <p className="text-sm text-zinc-500 capitalize">{selectedProduct.category}</p>
                                    <p className="text-purple-400 font-bold mt-1">฿{selectedProduct.price.toLocaleString()}</p>
                                </div>
                            </div>

                            <Separator className="bg-zinc-800" />

                            {/* Balance Calculation */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-zinc-400">
                                    <span>Current Balance</span>
                                    <span>฿{balance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-red-400">
                                    <span>Total Amount</span>
                                    <span>- ฿{selectedProduct.price.toLocaleString()}</span>
                                </div>
                                <Separator className="bg-zinc-800 my-2" />
                                <div className="flex justify-between items-center font-bold text-base">
                                    <span className="text-zinc-200">Remaining Balance</span>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <span>฿{(balance - selectedProduct.price).toLocaleString()}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setSelectedProduct(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
                            Cancel
                        </Button>
                        <Button onClick={confirmPurchase} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500">
                            Confirm Payment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}