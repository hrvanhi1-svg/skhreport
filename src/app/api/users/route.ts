
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "SYS") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
        include: {
            department: true,
            manager: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users });
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "SYS") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role, departmentId, managerId } = await req.json();

    try {
        const hashedPassword = await bcrypt.hash(password || '123', 10);

        await prisma.user.create({
            data: {
                name, email, role, departmentId, managerId,
                password: hashedPassword
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "User exists or error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "SYS") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, email, role, departmentId, managerId } = await req.json();

    try {
        await prisma.user.update({
            where: { id },
            data: {
                name, email, role, departmentId, managerId
            }
        });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
