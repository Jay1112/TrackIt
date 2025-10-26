import { z } from "zod";

export const schema = z.object({
    boardId: z.string(),
    skip: z.number(),
    take: z.number()
})