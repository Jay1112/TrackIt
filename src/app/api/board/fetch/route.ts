import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const boardId = searchParams.get("boardId");
        const skip = searchParams.get("skip");
        const take = searchParams.get("take");

        if (!boardId || !skip || !take) {
            return Response.json({ error: { message: 'Required fields : boardId, skip, take' } }, { status: 500 })
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
            skip: Number(skip),
            take: Number(take)
        });

        const response = await Promise.all([board, boardColumnList, boardTicketList]);

        return Response.json({ data : {
            board : response?.at(0) || null,
            boardColumnList : response?.at(1) || [],
            boardTicketList : response?.at(2) || [],
        } }, { status: 200 });
    } catch (error: any) {
        return Response.json({ error: { message: error?.message } }, { status: 500 })
    }
}