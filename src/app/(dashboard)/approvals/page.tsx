'use client';

import React, { useState, useEffect } from 'react';
import { User, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function ApprovalsPage() {
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEval, setSelectedEval] = useState<any>(null);

    const [score, setScore] = useState(0);
    const [comment, setComment] = useState('');

    const fetchEvaluations = () => {
        setLoading(true);
        fetch('/api/approvals')
            .then(res => res.json())
            .then(data => {
                setEvaluations(data.evaluations || []);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    };

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const handleReview = async (decision: string) => {
        if (!selectedEval) return;
        if (!confirm(`Bạn chắc chắn muốn ${decision}?`)) return;

        const res = await fetch('/api/approvals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                evaluationId: selectedEval.id,
                decision,
                score,
                comment
            })
        });

        if (res.ok) {
            alert('Đã duyệt thành công!');
            setSelectedEval(null);
            fetchEvaluations();
        } else {
            alert('Lỗi khi duyệt.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Duyệt đánh giá</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-1 h-fit">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 text-sm">
                        <span>Danh sách chờ ({evaluations.length})</span>
                    </div>
                    <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                        {evaluations.map((ev) => (
                            <div
                                key={ev.id}
                                onClick={() => setSelectedEval(ev)}
                                className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${selectedEval?.id === ev.id ? 'bg-blue-50' : ''}`}
                            >
                                <h4 className="text-sm font-bold text-gray-900">{ev.user.name}</h4>
                                <span className="text-xs text-gray-500">{ev.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {selectedEval ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden p-6 space-y-6">
                            <h2 className="text-xl font-bold text-gray-900">{selectedEval.user.name}</h2>
                            <div className="space-y-4">
                                {selectedEval.tasks.map((t: any, idx: number) => (
                                    <div key={t.id} className="bg-gray-50 p-4 rounded-xl text-sm">
                                        <div className="flex justify-between font-bold text-gray-900">
                                            <span>{idx + 1}. {t.name}</span>
                                            <span className="text-blue-600">{t.weight}%</span>
                                        </div>
                                        <div className="mt-2 text-xs">
                                            KV: {t.resultDescription} (Điểm: {t.selfScore})
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="number" value={score} onChange={(e) => setScore(parseFloat(e.target.value))} className="p-2 border rounded" placeholder="Điểm" />
                                    <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="p-2 border rounded" placeholder="Nhận xét" />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => handleReview('APPROVE')} className="flex-1 bg-green-600 text-white py-2 rounded-xl font-bold text-xs">Duyệt</button>
                                    <button onClick={() => handleReview('REVISE')} className="flex-1 bg-yellow-500 text-white py-2 rounded-xl font-bold text-xs">Yêu cầu sửa</button>
                                    <button onClick={() => handleReview('REJECT')} className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold text-xs">Từ chối</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                            <User size={48} className="mb-4 opacity-50" />
                            <p className="text-sm">Chọn nhân viên để xem</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
