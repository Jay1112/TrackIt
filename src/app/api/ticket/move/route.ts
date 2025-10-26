import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { schema } from "@/schema/moveTicket";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const validate = schema.safeParse(body);
        if (!validate.success) {
            return Response.json(
                {
                    error: {
                        message: "Validation failed",
                        details: validate.error.flatten(),
                    },
                },
                { status: 400 }
            );
        }

        const { boardId, position, boardColumnId, ticketId } = body;

        const ticketData = await prisma.boardTicket.update({
            where: {
                id: ticketId
            },
            data: {
                boardId,
                boardColumnId,
                position
            }
        });

        return Response.json({
            data: {
                ticketData
            }
        }, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: { message: error?.message } }, { status: 500 })
    }
}