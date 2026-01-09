'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Lock, Plus, Save, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SubTask {
    id: string;
    name: string;
    result: string;
}

export default function ReportPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const initialMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) : d.getMonth() + 1;
    const initialYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : d.getFullYear();

    const [month, setMonth] = useState(initialMonth);
    const [year, setYear] = useState(initialYear);
    const [status, setStatus] = useState('DRAFT');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/evaluations?month=${month}&year=${year}`)
            .then(res => res.json())
            .then(data => {
                if (data.evaluation) {
                    const tasksWithSubTasks = data.evaluation.tasks.map((task: any) => ({
                        ...task,
                        subTasks: task.subTasks || []
                    }));
                    setTasks(tasksWithSubTasks);
                    setStatus(data.evaluation.status);
                } else {
                    setTasks([]);
                    setStatus('DRAFT');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch", err);
                setLoading(false);
            });
    }, [month, year]);

    const handleUpdate = (id: string, field: string, value: any) => {
        setTasks(prevTasks => prevTasks.map(t => {
            if (t.id !== id) return t;
            let updated = { ...t, [field]: value };

            // Calculate component score: weight * selfScore / 100
            const weight = updated.weight || 0;
            const self = updated.selfScore || 0;
            updated.convertedValue = (weight * self) / 100;

            return updated;
        }));
    };

    const handleSubTaskUpdate = (taskId: string, subTaskId: string, field: string, value: string) => {
        setTasks(prevTasks => prevTasks.map(t => {
            if (t.id !== taskId) return t;
            const updatedSubTasks = t.subTasks.map((st: SubTask) =>
                st.id === subTaskId ? { ...st, [field]: value } : st
            );
            return { ...t, subTasks: updatedSubTasks };
        }));
    };

    const handleAddSubTask = (taskId: string) => {
        setTasks(prevTasks => prevTasks.map(t => {
            if (t.id !== taskId) return t;
            const newSubTask: SubTask = {
                id: `sub-${Date.now()}`,
                name: '',
                result: ''
            };
            return { ...t, subTasks: [...(t.subTasks || []), newSubTask] };
        }));
    };

    const handleNext = async () => {
        const totalWeight = tasks.reduce((sum, t) => sum + (t.weight || 0), 0);
        if (Math.abs(totalWeight - 100) > 0.1 && tasks.length > 0) {
            alert(`Lỗi: Tổng tỷ trọng công việc là ${totalWeight}%. Yêu cầu ĐÚNG 100%.`);
            return;
        }

        try {
            const res = await fetch('/api/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasks,
                    month,
                    year
                })
            });
            if (res.ok) {
                router.push(`/kpi?month=${month}&year=${year}`);
            } else {
                const data = await res.json();
                alert(data.error || 'Lỗi khi lưu.');
            }
        } catch (e) {
            alert('Lỗi kết nối.');
        }
    };

    const getTotalWeight = () => tasks.reduce((sum, t) => sum + (t.weight || 0), 0);
    const isLocked = status === 'APPROVED' || status === 'REVIEWED';

    const getSelfScoreLabel = (score: number) => {
        if (score >= 95) return 'Hoàn thành xuất sắc';
        if (score >= 80) return 'Hoàn thành tốt chi tiết';
        if (score >= 60) return 'Hoàn thành';
        return 'Cần cải thiện';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/plan')}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-gray-900"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Báo cáo kết quả công việc</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1 uppercase tracking-wide">Bước 2: Khai báo kết quả thực tế (T{month}/{year})</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-lg font-bold text-sm ${Math.abs(getTotalWeight() - 100) < 0.1 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                        Trọng số: {getTotalWeight()}%
                    </div>
                    {!isLocked && (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-emerald-200 transition-all active:scale-95">
                            Tiếp tục: Kiểm tra & Gửi <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {loading && <div className="text-center py-10 font-bold text-gray-400">Đang tải dữ liệu...</div>}

                {!loading && tasks.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-400 font-medium mb-2">Chưa có kế hoạch nào được lập cho tháng này.</p>
                        <button
                            onClick={() => router.push('/plan')}
                            className="text-blue-600 font-bold hover:underline text-sm">
                            Quay lại Lập Kế Hoạch
                        </button>
                    </div>
                )}

                {tasks.map((task, index) => (
                    <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{task.name}</h3>
                            </div>
                        </div>

                        {/* Sub-tasks */}
                        <div className="ml-12 mb-4 space-y-2">
                            {task.subTasks?.map((subTask: SubTask) => (
                                <div key={subTask.id} className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        disabled={isLocked}
                                        className="mt-1 w-4 h-4 text-blue-600 rounded"
                                    />
                                    <div className="flex-1 grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            disabled={isLocked}
                                            value={subTask.name}
                                            onChange={(e) => handleSubTaskUpdate(task.id, subTask.id, 'name', e.target.value)}
                                            placeholder="Tên chi tiết..."
                                            className="px-3 py-2 bg-gray-800 text-white text-sm rounded font-medium outline-none disabled:bg-gray-700"
                                        />
                                        <input
                                            type="text"
                                            disabled={isLocked}
                                            value={subTask.result}
                                            onChange={(e) => handleSubTaskUpdate(task.id, subTask.id, 'result', e.target.value)}
                                            placeholder="Kết quả..."
                                            className="px-3 py-2 bg-gray-800 text-white text-sm rounded font-medium outline-none disabled:bg-gray-700"
                                        />
                                    </div>
                                </div>
                            ))}

                            {!isLocked && (
                                <button
                                    onClick={() => handleAddSubTask(task.id)}
                                    className="text-blue-600 text-xs font-bold uppercase flex items-center gap-1 hover:text-blue-700 ml-7"
                                >
                                    <Plus size={14} /> Thêm chi tiết kết quả
                                </button>
                            )}
                        </div>

                        {/* Scoring Section */}
                        <div className="ml-12 grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Nhân viên tự chấm (%)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        disabled={isLocked}
                                        value={task.selfScore || 0}
                                        onChange={(e) => handleUpdate(task.id, 'selfScore', parseFloat(e.target.value))}
                                        className="w-20 bg-white border border-gray-200 rounded-lg py-2 px-3 text-center font-bold text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                    <span className="text-sm font-medium text-gray-500">%</span>
                                    <span className="flex-1 text-xs font-medium text-gray-400">
                                        {getSelfScoreLabel(task.selfScore || 0)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-2">Quản lý đánh giá (Sau khi nộp)</label>
                                <div className="h-[42px] bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-center">
                                    <span className="text-lg font-bold text-blue-600">
                                        {task.managerScore ? `${task.managerScore}%` : '--'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
