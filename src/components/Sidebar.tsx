'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, BarChart3, ListChecks, Users, PlusCircle } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = session?.user?.role;

    const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 hidden lg:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl">
                        <BarChart3 className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">SÁCH KHÁNH HÒA</h1>
                        <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none block">Quản trị ERP</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <Link
                    href="/home"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/home') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Home size={18} /> Tổng quan
                </Link>

                {role && role !== 'SYS' && (
                    <>
                        <div className="pt-4 pb-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Đánh giá</div>
                        <Link
                            href="/plan"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/plan') || isActive('/report') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <PlusCircle size={18} /> Lập KH / Báo cáo
                        </Link>
                        {(role === 'EMP' || role === 'TL' || role === 'DM') && (
                            <Link
                                href="/kpi"
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/kpi') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <BarChart3 size={18} /> Tổng hợp KPI
                            </Link>
                        )}
                    </>
                )}

                {(role === 'TL' || role === 'DM' || role === 'DDM' || role === 'SYS') && (
                    <>
                        <div className="pt-4 pb-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Quản lý</div>
                        <Link
                            href="/approval"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/approval') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <ListChecks size={18} /> Phê duyệt
                        </Link>
                    </>
                )}
                {(role === 'SYS' || role === 'DM' || role === 'DDM') && (
                    <>
                        <div className="pt-4 pb-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Hệ thống</div>
                        <Link
                            href="/admin/evaluations"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/admin/evaluations') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <BarChart3 size={18} /> Tổng quan đánh giá
                        </Link>
                        <Link
                            href="/admin"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Users size={18} /> Cấu hình nhân sự
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${role === 'SYS' ? 'bg-red-600' : 'bg-blue-600'}`}>
                            {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-gray-900 truncate">{session?.user?.name}</p>
                            <p className="text-[10px] font-medium text-gray-500 truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
