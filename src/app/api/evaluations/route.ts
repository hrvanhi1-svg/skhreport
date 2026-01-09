import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : new Date().getMonth() + 1;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : new Date().getFullYear();

    let evaluation = await prisma.evaluation.findFirst({
        where: {
            userId: session.user.id,
            // Note: month and year are stored as Int in schema, not in where clause for Prisma v5
        },
        include: {
            tasks: true,
            reviews: true
        }
    });

    // Filter by month/year manually if needed
    if (evaluation && (evaluation.month !== month || evaluation.year !== year)) {
        evaluation = null;
    }

    // Parse subTasks JSON
    if (evaluation) {
        evaluation = {
            ...evaluation,
            tasks: evaluation.tasks.map((task: any) => ({
                ...task,
                subTasks: task.subTasks ? JSON.parse(task.subTasks) : []
            }))
        } as any;
    }

    return NextResponse.json({ evaluation });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tasks, month, year, status: requestedStatus } = body;

    const targetMonth = month || new Date().getMonth() + 1;
    const targetYear = year || new Date().getFullYear();

    try {
        // Find existing evaluation
        let existingEvaluation = await prisma.evaluation.findFirst({
            where: {
                userId: session.user.id,
            },
            include: { tasks: true }
        });

        // Filter by month/year
        if (existingEvaluation && (existingEvaluation.month !== targetMonth || existingEvaluation.year !== targetYear)) {
            existingEvaluation = null;
        }

        // Prevent edits to approved/reviewed evaluations
        if (existingEvaluation && (existingEvaluation.status === 'APPROVED' || existingEvaluation.status === 'REVIEWED')) {
            return NextResponse.json({ error: 'Cannot edit approved or reviewed evaluations' }, { status: 403 });
        }

        let evaluation;

        if (!existingEvaluation) {
            // Create new evaluation
            evaluation = await prisma.evaluation.create({
                data: {
                    userId: session.user.id,
                    status: requestedStatus || 'DRAFT',
                    month: targetMonth,
                    year: targetYear
                }
            });
        } else {
            // Update existing
            evaluation = await prisma.evaluation.update({
                where: { id: existingEvaluation.id },
                data: {
                    status: requestedStatus || existingEvaluation.status
                }
            });
        }

        // Delete old tasks and create new ones
        await prisma.task.deleteMany({
            where: { evaluationId: evaluation.id }
        });

        await prisma.task.createMany({
            data: tasks.map((task: any) => ({
                evaluationId: evaluation.id,
                name: task.name,
                weight: Number(task.weight) || 0,
                category: task.category || 'I',
                targetQuantity: Number(task.targetQuantity) || 0,
                actualQuantity: Number(task.actualQuantity) || 0,
                unitPrice: Number(task.unitPrice) || 0,
                convertedValue: Number(task.convertedValue) || 0,
                startDate: task.startDate,
                deadline: task.deadline,
                actualFinish: task.actualFinish,
                collaboration: task.collaboration,
                resultDescription: task.resultDescription,
                selfScore: Number(task.selfScore) || 0,
                managerScore: Number(task.managerScore) || 0,
                note: task.note,
                subTasks: task.subTasks ? JSON.stringify(task.subTasks) : null,
            }))
        });

        return NextResponse.json({ success: true, evaluationId: evaluation.id });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save evaluation" }, { status: 500 });
    }
}
