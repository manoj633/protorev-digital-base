import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const usecases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/usecases" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    trigger: z.string(),
    stack: z.string(),
    runtime: z.string(),
    costPerRun: z.string(),
    failureModes: z.array(z.string()),
    workflowFile: z.string().nullable().optional(),
    status: z.enum(["DRAFT", "SIMULATED"]),
    estimateBasis: z.string().optional()
  })
});

export const collections = { usecases };
