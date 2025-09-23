export interface ProductUnit {
    id: number;
    product_id: number;
    unit_type: string;
    unit_label: string;
    price_per_unit: number;
    stock_quantity: number;
    is_active: boolean;
    sort_order: number;
    notes?: string;
    formatted_price: string;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
    alt_text: string;
    is_primary: boolean;
    sort_order: number;
    url?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    harvest_date: string;
    expiry_date: string;
    is_active: boolean;
    created_by: number;
    meta_data?: any;
    product_units: ProductUnit[];
    product_images: ProductImage[];
}
