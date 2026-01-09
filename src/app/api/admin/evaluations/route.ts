
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== 'SYS' && session.user.role !== 'DM') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all evaluations for admin overview
    const evaluations = await prisma.evaluation.findMany({
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
        },
        orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ evaluations });
}
