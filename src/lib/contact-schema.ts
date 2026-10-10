import { z } from "zod";
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter at least 2 characters.")
    .max(100, "Please use 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(254),
  enquiry: z
    .enum(["", "Client project", "Job opportunity", "Collaboration"])
    .default(""),
  message: z
    .string()
    .trim()
    .min(20, "Please share a little more detail (at least 20 characters).")
    .max(5000, "Please use 5,000 characters or fewer."),
  website: z.string().max(200).optional().default(""),
});
export type ContactInput = z.infer<typeof contactSchema>;
