'use client';

import { useSession } from "next-auth/react";
import { CheckCircle2, Clock, FileText, TrendingUp, AlertCircle } from "lucide-react";

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Xin chào, {session?.user?.name} 👋</h1>
                    <p className="text-gray-500 text-sm font-medium mt-1">Đây là bảng tổng quan hoạt động của bạn hôm nay.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-xs font-bold text-gray-600">
                    Tháng {new Date().getMonth() + 1}, {new Date().getFullYear()}
                </div>
            </div>

            {session?.user?.role !== 'SYS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors text-blue-600">
                                <FileText size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Tháng 1</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">0</h3>
                        <p className="text-xs font-medium text-gray-500">Báo cáo đã nộp</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-orange-50 p-3 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-500">
                                <Clock size={20} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Deadline</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">5</h3>
                        <p className="text-xs font-medium text-gray-500">Ngày còn lại</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-emerald-50 p-3 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors text-emerald-600">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">A</h3>
                        <p className="text-xs font-medium text-gray-500">Xếp loại dự kiến</p>
                    </div>

                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-purple-50 p-3 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors text-purple-600">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">92</h3>
                        <p className="text-xs font-medium text-gray-500">Điểm KPI tổng</p>
                    </div>
                </div>
            )}

            {session?.user?.role === 'SYS' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="text-amber-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-amber-900 font-bold text-lg mb-1">Khu vực Quản trị viên</h3>
                        <p className="text-amber-700 text-sm">Bạn đang đăng nhập với quyền Admin. Hãy truy cập trang cấu hình nhân sự để quản lý người dùng.</p>
                    </div>
                </div>
            )}

        </div>
    );
}
