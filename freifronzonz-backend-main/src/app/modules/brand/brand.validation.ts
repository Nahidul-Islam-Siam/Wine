import { z } from "zod";

export const createBrandValidationSchema = z.object({
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
            des: z.string().optional(),
        })
    ),
});

const updateBrandValidationSchema = z.object({
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
            des: z.string().optional(),
        })
    ),
});

export const BrandValidation = {
    createBrandValidationSchema,
    updateBrandValidationSchema,
    // updateUserSettingsSchema,
};
