declare namespace App.Data {
export type AccountData = {
id: number;
account_name: string | null;
owner_name: string | null;
account_no: string | null;
account_type: string | null;
account_logo: string | null;
instructions: string | null;
is_active: boolean | null;
sort_order: number | null;
metadata: Array<any> | null;
created_at: string | null;
updated_at: string | null;
payments: Array<App.Data.PaymentData> | null;
};
export type OrderData = {
id: number;
access_token: string;
customer_name: string;
customer_email: string;
customer_phone: string | null;
shipping_address: string | null;
total_amount: string;
formatted_total: string;
status: string;
payment_status: string;
order_type: string;
processed_by: number | null;
notes: string | null;
created_at: string | null;
updated_at: string | null;
order_items: Array<App.Data.OrderItemData> | null;
payment: App.Data.PaymentData | null;
processor: App.Data.UserData | null;
};
export type OrderItemData = {
id: number;
order_id: number;
product_id: number;
product_unit_id: number | null;
product_name: string;
unit_label: string;
product_price: string;
quantity: string;
subtotal: string;
created_at: string | null;
updated_at: string | null;
order: App.Data.OrderData | null;
product: App.Data.ProductData | null;
product_unit: App.Data.ProductUnitData | null;
};
export type OrderSummaryData = {
id: number;
status: string;
payment_status: string;
formatted_created_at: string | null;
formatted_total: string | null;
};
export type PaymentData = {
id: number | null;
order_id: number | null;
account_id: number | null;
payment_method: string | null;
amount: string | null;
proof_image_path: string | null;
payment_date: string | null;
verified_at: string | null;
verified_by: number | null;
notes: string | null;
reference_number: string | null;
order: App.Data.OrderData | null;
account: App.Data.AccountData | null;
verifier: App.Data.UserData | null;
};
export type ProductData = {
id: number;
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
product_units: Array<App.Data.ProductUnitData> | null;
};
export type ProductImageData = {
id: number;
url: string | null;
alt_text: string | null;
is_primary: boolean | null;
};
export type ProductSummaryData = {
id: number;
name: string | null;
formatted_created_at: string | null;
};
export type ProductUnitData = {
id: number;
product_id: number | null;
unit_type: string | null;
unit_label: string | null;
price_per_unit: number | null;
stock_quantity: number | null;
is_active: boolean | null;
sort_order: number | null;
notes: string | null;
formatted_price_per_unit: string | null;
};
export type UserData = {
id: number;
name: string;
role: string;
email: string;
email_verified_at: string | null;
created_at: string | null;
updated_at: string | null;
product_count: number | null;
order_count: number | null;
products: Array<App.Data.ProductData> | null;
orders: Array<App.Data.OrderData> | null;
};
}
declare namespace App.Data.Product.Show {
export type ProductData = {
id: number;
name: string | null;
description: string | null;
harvest_date: string | null;
expiry_date: string | null;
is_active: boolean | null;
created_by: number | null;
meta_data: Array<any> | null;
product_images: Array<App.Data.Product.Show.ProductImageData> | null;
image_count: number | null;
formatted_created_at: string | null;
product_units: Array<App.Data.Product.Show.ProductUnitData> | null;
};
export type ProductImageData = {
id: number;
url: string;
alt_text: string;
is_primary: boolean;
};
export type ProductUnitData = {
id: number;
product_id: number | null;
unit_type: string | null;
unit_label: string | null;
price_per_unit: number | null;
stock_quantity: number | null;
is_active: boolean | null;
sort_order: number | null;
notes: string | null;
formatted_price_per_unit: string | null;
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
