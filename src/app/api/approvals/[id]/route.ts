
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const evaluation = await prisma.evaluation.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    department: { select: { name: true } }
                }
            },
            tasks: true,
            reviews: {
                include: {
                    manager: { select: { name: true } }
                }
            }
        }
    });

    if (!evaluation) {
        return NextResponse.json({ error: "Evaluation not found" }, { status: 404 });
    }

    return NextResponse.json({ evaluation });
}
