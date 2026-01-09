'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { BarChart3, Users, TrendingUp, CheckCircle, Filter } from 'lucide-react';

export default function AdminEvaluationsPage() {
    const { data: session } = useSession();
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterDepartment, setFilterDepartment] = useState('ALL');

    useEffect(() => {
        setLoading(true);
        fetch('/api/admin/evaluations')
            .then(res => res.json())
            .then(data => {
                setEvaluations(data.evaluations || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch evaluations:', err);
                setLoading(false);
            });
    }, []);

    const filteredEvaluations = evaluations.filter(ev => {
        if (filterStatus !== 'ALL' && ev.status !== filterStatus) return false;
        if (filterDepartment !== 'ALL' && ev.user?.department?.name !== filterDepartment) return false;
        return true;
    });

    const departments = [...new Set(evaluations.map(ev => ev.user?.department?.name).filter(Boolean))];

    // Calculate statistics
    const stats = {
        total: evaluations.length,
        approved: evaluations.filter(e => e.status === 'APPROVED').length,
        pending: evaluations.filter(e => e.status === 'SUBMITTED').length,
        avgSelfScore: evaluations.length > 0 ? (evaluations.reduce((sum, e) => sum + (e.totalScore || 0), 0) / evaluations.length).toFixed(2) : '0.00',
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tổng quan đánh giá</h1>
                <p className="text-gray-500 text-sm font-medium mt-1">Quản lý và theo dõi toàn bộ đánh giá nhân viên</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 size={24} />
                        <span className="text-xs font-bold opacity-75 uppercase">Tổng số</span>
                    </div>
                    <div className="text-3xl font-black">{stats.total}</div>
                    <p className="text-xs opacity-75 mt-1">Đánh giá</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle size={24} />
                        <span className="text-xs font-bold opacity-75 uppercase">Đã duyệt</span>
                    </div>
                    <div className="text-3xl font-black">{stats.approved}</div>
                    <p className="text-xs opacity-75 mt-1">Hoàn thành</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Users size={24} />
                        <span className="text-xs font-bold opacity-75 uppercase">Chờ duyệt</span>
                    </div>
                    <div className="text-3xl font-black">{stats.pending}</div>
                    <p className="text-xs opacity-75 mt-1">Đang xử lý</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp size={24} />
                        <span className="text-xs font-bold opacity-75 uppercase">Trung bình</span>
                    </div>
                    <div className="text-3xl font-black">{stats.avgSelfScore}</div>
                    <p className="text-xs opacity-75 mt-1">Điểm tự chấm</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                    <Filter size={18} />
                    <span className="text-sm font-bold">Lọc:</span>
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-200"
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="SUBMITTED">Đã nộp</option>
                    <option value="REVIEWED">Đã xem xét</option>
                    <option value="APPROVED">Đã duyệt</option>
                </select>

                <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-200"
                >
                    <option value="ALL">Tất cả phòng ban</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            {/* Evaluations Table */}
            {loading && (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}

            {!loading && (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Nhân viên</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Phòng ban</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Kỳ</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Tự chấm</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">QL chấm</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Tổng</th>
                                    <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredEvaluations.map((evaluation) => {
                                    const managerScore = evaluation.reviews?.[0]?.score || 0;
                                    const finalScore = ((evaluation.totalScore || 0) + managerScore) / 2; // Average

                                    return (
                                        <tr key={evaluation.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                                        {evaluation.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{evaluation.user?.name}</p>
                                                        <p className="text-xs text-gray-500">{evaluation.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                {evaluation.user?.department?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                                                T{evaluation.month}/{evaluation.year}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold text-sm">
                                                    {evaluation.totalScore?.toFixed(2) || '0.00'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 rounded-lg font-bold text-sm">
                                                    {managerScore.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-sm">
                                                    {finalScore.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-3 py-1 rounded-lg font-bold text-xs uppercase ${evaluation.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                        evaluation.status === 'SUBMITTED' ? 'bg-orange-100 text-orange-700' :
                                                            evaluation.status === 'REVIEWED' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {evaluation.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && filteredEvaluations.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400 font-medium">Không có dữ liệu phù hợp với bộ lọc</p>
                </div>
            )}
        </div>
    );
}
