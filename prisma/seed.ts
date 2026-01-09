
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "file:./dev.db"
        }
    }
})

async function main() {
    const password = await bcrypt.hash('123', 10)

    // Departments
    const deptIT = await prisma.department.upsert({
        where: { name: 'IT' },
        update: {},
        create: { name: 'IT' }
    })

    const deptBoard = await prisma.department.upsert({
        where: { name: 'Ban Giám đốc' },
        update: {},
        create: { name: 'Ban Giám đốc' }
    })

    const deptMarketing = await prisma.department.upsert({
        where: { name: 'Marketing' },
        update: {},
        create: { name: 'Marketing' }
    })

    // Users
    const admin = await prisma.user.upsert({
        where: { email: 'admin@skh.vn' },
        update: {},
        create: {
            email: 'admin@skh.vn',
            name: 'Quản trị hệ thống',
            password,
            role: 'SYS',
            departmentId: deptIT.id
        }
    })

    const director = await prisma.user.upsert({
        where: { email: 'director@skh.vn' },
        update: {},
        create: {
            email: 'director@skh.vn',
            name: 'Giám đốc Điều hành',
            password,
            role: 'DM',
            departmentId: deptBoard.id
        }
    })

    const manager = await prisma.user.upsert({
        where: { email: 'tp@skh.vn' },
        update: { managerId: director.id },
        create: {
            email: 'tp@skh.vn',
            name: 'Trưởng phòng Marketing',
            password,
            role: 'TL',
            departmentId: deptMarketing.id,
            managerId: director.id
        }
    })

    const employee = await prisma.user.upsert({
        where: { email: 'nv@skh.vn' },
        update: { managerId: manager.id },
        create: {
            email: 'nv@skh.vn',
            name: 'Nguyễn Văn Nhân Viên',
            password,
            role: 'EMP',
            departmentId: deptMarketing.id,
            managerId: manager.id
        }
    })

    console.log({ admin, director, manager, employee })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
