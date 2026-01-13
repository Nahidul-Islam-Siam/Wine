import { z } from "zod";

export const createProductValidationSchema = z.object({
    data: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                try {
                    return JSON.parse(val);
                } catch {
                    return val;
                }
            }
            return val;
        },
        z.object({
            name: z.string(),
            shortDes: z.string(),
            des: z.string().optional(),
            sizeId: z.string(),
            categoryId: z.string(),
            brandId: z.string(),
            tag: z.string().optional(),
            price: z.string(),
            discount: z.boolean().optional(),
            discountPercent: z.string().optional(),
            stock: z.boolean().optional(),
            quantity: z.string(),
        })
    ),
});

const updateProductValidationSchema = z.object({
    data: z.preprocess(
        (val) => {
            if (typeof val === "string") {
                try {
                    return JSON.parse(val);
                } catch {
                    return val;
                }
            }
            console.log("zod executed")
            return val;
        },
        z.object({
            name: z.string().optional(),
            shortDes: z.string().optional(),
            des: z.string().optional(),
            sizeId: z.string().optional(),
            categoryId: z.string().optional(),
            brandId: z.string().optional(),
            tag: z.string().optional(),
            price: z.string().optional(),
            discount: z.boolean().optional(),
            discountPercent: z.string().optional(),
            stock: z.boolean().optional(),
            quantity: z.string().optional(),
            removeImages: z.array(z.string()).optional(),
        })
    ),
});

export const ProductValidation = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
