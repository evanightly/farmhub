export interface ProductController {
    storeUnit: (id: number) => { url: string };
    updateUnitOrder: (id: number) => { url: string };
    updateImageOrder: (id: number) => { url: string };
}

export type { ProductController as default };
