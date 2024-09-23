import { z } from 'zod';

export const baseRecipeSchema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  description: z.string().min(1, 'Description is required'),
  ingredients: z
    .array(z.string().min(1, 'The ingredient cannot be empty'))
    .min(1, 'At least one ingredient is required'),
  steps: z
    .array(z.string().min(1, 'The step cannot be empty'))
    .min(1, 'At least one step is required'),
});

export const recipeUpdateSchema = baseRecipeSchema.partial();
