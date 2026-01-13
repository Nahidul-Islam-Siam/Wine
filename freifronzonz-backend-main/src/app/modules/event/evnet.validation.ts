import { EventStatus } from "@prisma/client";
import { z } from "zod";

export const createEventValidationSchema = z.object({
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
            startDate: z.string(),
            endDate: z.string(),
            audienceSize: z.string(),
            price: z.string(),
            status: z.enum([EventStatus.UP_COMMING, EventStatus.RUNNING, EventStatus.COMPLETE]).optional(),
        })
    ),
});

const updateEventValidationSchema = z.object({
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
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            audienceSize: z.string().optional(),
            price: z.string().optional(),
            status: z.enum([EventStatus.UP_COMMING, EventStatus.RUNNING, EventStatus.COMPLETE]).optional(),
            removeImages: z.array(z.string()).optional(),
        })
    ),
});

export const EventValidation = {
    createEventValidationSchema,
    updateEventValidationSchema,
};
