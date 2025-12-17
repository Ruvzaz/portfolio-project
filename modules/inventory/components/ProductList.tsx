"use client";

import { useInventory } from "../hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Lock, Package } from "lucide-react";
import { useIdentity } from "@/modules/identity";

export function ProductList() {
    const { products, isLoading, isProcessing, buyProduct } = useInventory();
    const { user } = useIdentity();

    return (
        <div className="w-full space-y-6">
            {/* Header สวยๆ */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <ShoppingCart className="w-6 h-6 text-purple-400" />
                    </div>
                    Available Products
                </h2>
                <span className="text-zinc-500 text-sm">{products.length} items</span>
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
                        return (
                            // ✨ REDESIGNED CARD ✨
                            <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">

                                {/* --- ส่วนรูปภาพ --- */}
                                <div className="relative h-[240px] overflow-hidden bg-zinc-950">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                                    />

                                    {/* Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60"></div>

                                    {/* Stock Badge (มุมขวาบน) */}
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="secondary" className={`backdrop-blur-md border-0 px-3 py-1.5 ${isOutOfStock ? 'bg-red-500/80 text-white' : 'bg-black/60 text-zinc-100'}`}>
                                            {isOutOfStock ? "Sold Out" : `Stock: ${product.stock}`}
                                        </Badge>
                                    </div>
                                </div>

                                {/* --- ส่วนเนื้อหา --- */}
                                <div className="flex flex-1 flex-col p-5 space-y-4">
                                    <div>
                                        {/* Category Badge */}
                                        <span className="inline-block rounded-md bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                                            {product.category}
                                        </span>
                                        {/* Title */}
                                        <h3 className="line-clamp-1 text-xl font-bold text-zinc-100 group-hover:text-purple-300 transition-colors" title={product.name}>
                                            {product.name}
                                        </h3>
                                    </div>

                                    {/* Price Section */}
                                    <div className="flex items-baseline gap-1 mt-auto">
                                        <span className="text-sm text-purple-400 font-bold">฿</span>
                                        <span className={`text-3xl font-extrabold ${isOutOfStock ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                            {product.price.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* --- ปุ่มกดซื้อ --- */}
                                    <div className="pt-2">
                                        {user ? (
                                            <Button
                                                className={`w-full h-12 text-base font-medium transition-all relative overflow-hidden group/btn ${isOutOfStock
                                                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25'
                                                    }`}
                                                disabled={isOutOfStock || isProcessing === product.id}
                                                onClick={() => buyProduct(product.id)}
                                            >
                                                {/* แสงวิ่งผ่านปุ่มตอน Hover */}
                                                <div className="absolute inset-0 h-full w-full scale-0 rounded-lg transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-white/10"></div>

                                                {isProcessing === product.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                                ) : (
                                                    <ShoppingCart className={`w-5 h-5 mr-2 ${isOutOfStock ? 'opacity-50' : ''}`} />
                                                )}
                                                {isOutOfStock ? "Out of Stock" : "Buy Now"}
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
        </div>
    );
}