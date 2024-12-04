const { z } = require("zod");

// Zod schema for Post Validation
const postValidationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
  image: z.string().optional(), // Image URL will be a string after upload
});

// Zod schema for Comment Validation
const commentValidationSchema = z.object({
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(500, "Comment is too long"),
  user: z.string().min(1, "User ID is required"), // Assuming user is identified by an ID
});

module.exports = { postValidationSchema, commentValidationSchema };
