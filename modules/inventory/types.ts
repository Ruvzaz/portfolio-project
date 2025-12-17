export interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: 'electronics' | 'clothing' | 'digital';
    image: string;
}

export interface CartItem {
    productId: string;
    quantity: number;
}