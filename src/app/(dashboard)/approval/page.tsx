'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Eye, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react';

export default function ApprovalPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;

        setLoading(true);
        fetch('/api/approvals')
            .then(res => res.json())
            .then(data => {
                setEvaluations(data.evaluations || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch evaluations:', err);
                setLoading(false);
            });
    }, [session]);

    const getStatusBadge = (status: string) => {
        const badges: Record<string, { bg: string; text: string; icon: any }> = {
            SUBMITTED: { bg: 'bg-orange-100', text: 'text-orange-700', icon: Clock },
            REVIEWED: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle },
            APPROVED: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
            REJECTED: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
        };
        const badge = badges[status] || badges.SUBMITTED;
        const Icon = badge.icon;

        return (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${badge.bg} ${badge.text} text-xs font-bold`}>
                <Icon size={14} />
                {status}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Phê duyệt đánh giá</h1>
                <p className="text-gray-500 text-sm font-medium mt-1">Xem và đánh giá báo cáo của nhân viên trực thuộc.</p>
            </div>

            {loading && (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-400 text-sm mt-4">Đang tải...</p>
                </div>
            )}

            {!loading && evaluations.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                    <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-400 font-medium">Chưa có báo cáo nào cần phê duyệt.</p>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {evaluations.map((evaluation) => (
                    <div key={evaluation.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {evaluation.user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{evaluation.user?.name || 'Unknown User'}</h3>
                                    <p className="text-sm text-gray-500">{evaluation.user?.email}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Phòng: {evaluation.user?.department?.name || 'N/A'} • Tháng {evaluation.month}/{evaluation.year}
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(evaluation.status)}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Số công việc</p>
                                <p className="text-2xl font-black text-gray-900">{evaluation.tasks?.length || 0}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Điểm tự chấm</p>
                                <p className="text-2xl font-black text-blue-600">{evaluation.totalScore?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Xếp loại</p>
                                <p className="text-2xl font-black text-indigo-600">{evaluation.rank || 'N/A'}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => router.push(`/approval/${evaluation.id}`)}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                        >
                            <Eye size={18} />
                            Xem chi tiết & Đánh giá
                            <ChevronRight size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
