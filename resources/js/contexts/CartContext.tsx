import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
    unitId: string;
    productId: number;
    productName: string;
    unitType: string;
    unitLabel: string;
    pricePerUnit: number;
    quantity: number;
    stockQuantity: number;
    productImage?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (unitId: string) => void;
    updateQuantity: (unitId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    isInCart: (unitId: string) => boolean;
    getItemQuantity: (unitId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

const CART_STORAGE_KEY = 'agricatalog_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Error loading cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.unitId === newItem.unitId);

            if (existingItem) {
                // If item exists, increment quantity (check stock limit)
                const newQuantity = existingItem.quantity + 1;
                if (newQuantity <= existingItem.stockQuantity) {
                    return currentItems.map((item) => (item.unitId === newItem.unitId ? { ...item, quantity: newQuantity } : item));
                }
                return currentItems; // Don't add if it would exceed stock
            } else {
                // Add new item with quantity 1
                return [...currentItems, { ...newItem, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (unitId: string) => {
        setItems((currentItems) => currentItems.filter((item) => item.unitId !== unitId));
    };

    const updateQuantity = (unitId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(unitId);
            return;
        }

        setItems((currentItems) =>
            currentItems.map((item) => {
                if (item.unitId === unitId) {
                    // Don't exceed stock quantity
                    const safeQuantity = Math.min(quantity, item.stockQuantity);
                    return { ...item, quantity: safeQuantity };
                }
                return item;
            }),
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantity, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.pricePerUnit * item.quantity, 0);
    };

    const isInCart = (unitId: string) => {
        return items.some((item) => item.unitId === unitId);
    };

    const getItemQuantity = (unitId: string) => {
        const item = items.find((item) => item.unitId === unitId);
        return item ? item.quantity : 0;
    };

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        isInCart,
        getItemQuantity,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
