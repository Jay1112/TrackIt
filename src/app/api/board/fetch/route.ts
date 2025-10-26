import { prisma } from "@/lib/prisma";
import { schema } from "@/schema/fetchBoard";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const boardId = searchParams.get("boardId") || '';
        const skip = Number(searchParams.get("skip"));
        const take = Number(searchParams.get("take"));

        const validate = schema.safeParse({
            boardId,
            skip,
            take
        });
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

        const board = prisma.board.findUniqueOrThrow({
            where: {
                id: boardId
            }
        });

        const boardColumnList = prisma.boardColumn.findMany({
            where: {
                boardId
            }
        });

        const boardTicketList = prisma.boardTicket.findMany({
            where: {
                boardId,
            },
            skip,
            take
        });

        const response = await Promise.all([board, boardColumnList, boardTicketList]);

        return Response.json({
            data: {
                board: response?.at(0) || null,
                boardColumnList: response?.at(1) || [],
                boardTicketList: response?.at(2) || [],
            }
        }, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: { message: error?.message } }, { status: 500 })
    }
}