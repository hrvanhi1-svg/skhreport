'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

export default function ApprovalDetailPage() {
    const router = useRouter();
    const params = useParams();
    const evaluationId = params.id as string;

    const [evaluation, setEvaluation] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [managerScores, setManagerScores] = useState<Record<string, number>>({});
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (!evaluationId) return;

        setLoading(true);
        fetch(`/api/approvals/${evaluationId}`)
            .then(res => res.json())
            .then(data => {
                setEvaluation(data.evaluation);
                // Initialize manager scores with existing values if any
                const scores: Record<string, number> = {};
                data.evaluation?.tasks?.forEach((task: any) => {
                    scores[task.id] = task.managerScore || 0;
                });
                setManagerScores(scores);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch evaluation:', err);
                setLoading(false);
            });
    }, [evaluationId]);

    const handleScoreChange = (taskId: string, score: number) => {
        setManagerScores(prev => ({ ...prev, [taskId]: score }));
    };

    const handleSubmitReview = async () => {
        const confirmed = window.confirm('Xác nhận gửi đánh giá của bạn?');
        if (!confirmed) return;

        try {
            const res = await fetch('/api/approvals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evaluationId,
                    scores: managerScores,
                    comment,
                    decision: 'APPROVE'
                })
            });

            if (res.ok) {
                alert('Đã gửi đánh giá thành công!');
                router.push('/approval');
            } else {
                const data = await res.json();
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (e) {
            alert('Lỗi kết nối');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!evaluation) {
        return <div className="text-center py-20 text-gray-400">Không tìm thấy đánh giá</div>;
    }

    const totalManagerScore = Object.values(managerScores).reduce((sum, score) => sum + score, 0);

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Đánh giá nhân viên</h1>
                    <p className="text-sm text-gray-500">{evaluation.user?.name} - Tháng {evaluation.month}/{evaluation.year}</p>
                </div>
            </div>

            {/* Employee Summary */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase mb-2">Điểm tự chấm</p>
                    <p className="text-3xl font-black text-blue-700">{evaluation.totalScore?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
                    <p className="text-xs text-purple-600 font-bold uppercase mb-2">Điểm quản lý</p>
                    <p className="text-3xl font-black text-purple-700">{totalManagerScore.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                    <p className="text-xs text-indigo-600 font-bold uppercase mb-2">Xếp loại</p>
                    <p className="text-3xl font-black text-indigo-700">{evaluation.rank || 'N/A'}</p>
                </div>
            </div>

            {/* Task Scoring */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Chi tiết đánh giá từng công việc</h2>

                {evaluation.tasks?.map((task: any, index: number) => (
                    <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">{task.name}</h3>
                                {task.resultDescription && (
                                    <div className="mt-2 pl-3 border-l-2 border-blue-100">
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.resultDescription}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 bg-gray-50 rounded-xl p-4">
                            <div className="text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Điểm QĐ (P2)</p>
                                <p className="text-lg font-bold text-gray-700">{task.convertedValue?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Trọng số</p>
                                <p className="text-lg font-bold text-gray-700">{task.weight || 0}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">NV tự chấm</p>
                                <p className="text-lg font-bold text-blue-700">{((task.convertedValue || 0) * (task.weight || 0)).toFixed(2)}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-purple-600 font-bold uppercase mb-2">Quản lý chấm</p>
                                <input
                                    type="number"
                                    value={managerScores[task.id] || 0}
                                    onChange={(e) => handleScoreChange(task.id, parseFloat(e.target.value) || 0)}
                                    className="w-20 px-3 py-2 text-center font-bold text-purple-700 bg-white border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-300"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Manager Comment */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Nhận xét của quản lý</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Nhập nhận xét đánh giá..."
                    className="w-full bg-gray-50 rounded-xl p-4 text-sm font-medium text-gray-700 outline-none border border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-4 focus:ring-blue-50 transition-all min-h-[120px] resize-none"
                />
            </div>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 p-4 shadow-xl z-30">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Tổng điểm quản lý đánh giá</p>
                        <p className="text-2xl font-black text-purple-600">{totalManagerScore.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleSubmitReview}
                        className="flex items-center gap-2 px-8 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg transition-all hover:scale-105 active:scale-95"
                    >
                        <CheckCircle size={20} />
                        Gửi đánh giá & Phê duyệt
                    </button>
                </div>
            </div>
        </div>
    );
}
