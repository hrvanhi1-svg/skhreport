
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all evaluations of employees managed by this user
    const subordinates = await prisma.user.findMany({
        where: { managerId: session.user.id },
        select: { id: true }
    });

    const subordinateIds = subordinates.map((u: { id: string }) => u.id);

    const evaluations = await prisma.evaluation.findMany({
        where: {
            userId: { in: subordinateIds },
            status: { not: 'DRAFT' } // Only show submitted or processed
        },
        include: {
            user: { select: { name: true, email: true, department: true } },
            tasks: true
        },
        orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ evaluations });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { evaluationId, decision, scores, comment } = await req.json();

    try {
        // Calculate total manager score
        const totalManagerScore = Object.values(scores).reduce((sum: number, score: any) => sum + Number(score), 0);

        // Update each task with manager score
        for (const [taskId, managerScore] of Object.entries(scores)) {
            await prisma.task.update({
                where: { id: taskId },
                data: { managerScore: Number(managerScore) }
            });
        }

        // Create Review
        await prisma.managerReview.create({
            data: {
                evaluationId,
                managerId: session.user.id,
                decision,
                score: totalManagerScore,
                comment
            }
        });

        // Update Evaluation Status
        let newStatus = 'REVIEWED';
        if (decision === 'APPROVE') newStatus = 'APPROVED';
        if (decision === 'REJECT') newStatus = 'REJECTED';
        if (decision === 'REVISE') newStatus = 'DRAFT';

        await prisma.evaluation.update({
            where: { id: evaluationId },
            data: {
                status: newStatus
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error submitting review" }, { status: 500 });
    }
}

