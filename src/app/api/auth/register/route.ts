import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        // Validate input
        if (!email || !password || !name) {
            return NextResponse.json(
                { error: "Email, password và tên đầy đủ là bắt buộc" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email này đã được đăng ký" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with default role EMP (Employee)
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: "EMP", // Default role for self-registered users
            }
        });

        return NextResponse.json({
            message: "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.",
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role
            }
        }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại." },
            { status: 500 }
        );
    }
}
