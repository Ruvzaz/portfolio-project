"use client";

import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { useIdentity } from "@/modules/identity";
import { Product } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Pencil, Trash2, ShieldAlert, ImageIcon } from "lucide-react";

export function ProductManager() {
    const { user } = useIdentity();
    const { products, isProcessing, addProduct, updateProduct, deleteProduct } = useInventory();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "", price: 0, stock: 0, category: "electronics", image: ""
    });

    if (!user || user.role !== 'admin') return null;

    const handleOpenDialog = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData(product);
        } else {
            setEditingProduct(null);
            setFormData({ name: "", price: 0, stock: 0, category: "electronics", image: "https://placehold.co/600x400/18181b/ffffff.png?text=Product+Image" });
        }
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) return;
        if (editingProduct) {
            await updateProduct(editingProduct.id, formData);
        } else {
            await addProduct(formData as Omit<Product, "id">);
        }
        setIsDialogOpen(false);
    };

    return (
        <Card className="w-full border-zinc-800 bg-zinc-900/50 mt-12 animate-in slide-in-from-bottom-4 shadow-2xl shadow-black/50 backdrop-blur-sm overflow-hidden">
            {/* Admin Header Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />

            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
                <div>
                    <CardTitle className="flex items-center gap-3 text-2xl text-zinc-100">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <Package className="w-6 h-6 text-orange-500" />
                        </div>
                        Inventory Manager
                    </CardTitle>
                    <p className="text-zinc-400 text-sm mt-1 ml-11 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-orange-500" /> Restricted Area: Admins only
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => handleOpenDialog()} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-500/20">
                            <Plus className="w-5 h-5 mr-2" /> Add New Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                            <DialogDescription>Fill in the product details below.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-5 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="prod-name">Product Name</Label>
                                <Input id="prod-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="bg-zinc-950 border-zinc-800 focus:border-orange-500/50" placeholder="e.g. Super Keyboard" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="prod-price">Price (฿)</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-zinc-500">฿</span>
                                        <Input id="prod-price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="pl-8 bg-zinc-950 border-zinc-800 focus:border-orange-500/50" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="prod-stock">Stock Qty</Label>
                                    <Input id="prod-stock" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="bg-zinc-950 border-zinc-800 focus:border-orange-500/50" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="prod-cat">Category</Label>
                                <Select value={formData.category} onValueChange={(val: any) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger id="prod-cat" className="bg-zinc-950 border-zinc-800"><SelectValue /></SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                                        <SelectItem value="electronics">Electronics</SelectItem>
                                        <SelectItem value="clothing">Clothing</SelectItem>
                                        <SelectItem value="digital">Digital</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="prod-img">Image URL</Label>
                                <div className="flex gap-2">
                                    <Input id="prod-img" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="bg-zinc-950 border-zinc-800 focus:border-orange-500/50 flex-1" placeholder="https://..." />
                                    <div className="w-10 h-10 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                                        {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-zinc-600" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">Cancel</Button>
                            <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white min-w-[100px]">
                                {isProcessing === "add-new" || (editingProduct && isProcessing === editingProduct.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Product"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y divide-zinc-800/50">
                    {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors group relative">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden shrink-0">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-zinc-100 text-lg">{product.name}</h4>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400 mt-1">
                                        <Badge variant="outline" className="border-zinc-700 text-zinc-400 uppercase text-[10px]">{product.category}</Badge>
                                        <div className="flex items-center gap-1">
                                            Stock:
                                            <span className={`font-bold ${product.stock < 5 ? "text-red-400" : "text-zinc-200"}`}>
                                                {product.stock}
                                            </span>
                                        </div>
                                        <div className="text-zinc-300 font-bold pl-2 border-l border-zinc-700">
                                            ฿{product.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bg-zinc-900/80 p-1 rounded-md backdrop-blur-sm border border-zinc-800/50 shadow-xl">
                                <Button size="sm" variant="ghost" className="h-9 w-9 text-zinc-400 hover:text-blue-400 hover:bg-blue-900/20" onClick={() => handleOpenDialog(product)}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-9 w-9 text-zinc-400 hover:text-red-400 hover:bg-red-900/20" onClick={() => deleteProduct(product.id)}>
                                    {isProcessing === product.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="p-8 text-center text-zinc-500">No products found.</div>
                    )}
                </div>
            </CardContent>
            <div className="bg-zinc-950/50 p-3 text-xs text-center text-zinc-500 border-t border-zinc-800">
                Changes made here will immediately reflect on the public store view.
            </div>
        </Card>
    );
}
import { Loader2 } from "lucide-react";