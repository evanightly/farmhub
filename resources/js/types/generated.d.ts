declare namespace App.Data {
export type ProductData = {
id: number | null;
name: string | null;
description: string | null;
harvest_date: string | null;
expiry_date: string | null;
is_active: boolean | null;
created_by: number | null;
meta_data: Array<any> | null;
product_images: Array<App.Data.ProductImageData> | null;
image_count: number | null;
formatted_created_at: string | null;
};
export type ProductImageData = {
id: number | null;
url: string | null;
alt_text: string | null;
is_primary: boolean | null;
};
}
declare namespace App.Data.Product {
export type ProductData = {
id: number | null;
name: string | null;
is_active: boolean | null;
created_by: number | null;
product_images: Array<App.Data.ProductImageData> | null;
};
}
declare namespace App.Models {
export type Account = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
export type Order = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
export type OrderItem = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
export type Payment = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
export type Product = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
export type ProductImage = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
export type ProductUnit = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
export type User = {
incrementing: boolean;
preventsLazyLoading: boolean;
exists: boolean;
wasRecentlyCreated: boolean;
timestamps: boolean;
usesUniqueIds: boolean;
};
}
