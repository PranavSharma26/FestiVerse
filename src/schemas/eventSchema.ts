import { z } from "zod";

export const eventSchema = z.object({
    title: z
    .string()
    .min(1,'Please enter a Title'),

    content: z
    .string()
    .min(5, 'Content must be alteast 5 characters long'),

    image: z
    .string()
    
})