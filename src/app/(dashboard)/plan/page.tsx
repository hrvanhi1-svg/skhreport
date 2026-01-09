'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, Lock, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlanPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [status, setStatus] = useState('DRAFT');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/evaluations?month=${currentMonth}&year=${currentYear}`)
            .then(res => res.json())
            .then(data => {
                if (data.evaluation) {
                    setTasks(data.evaluation.tasks || []);
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
    }, []);

    const handleSaveAndNext = async () => {
        try {
            const res = await fetch('/api/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasks,
                    month: currentMonth,
                    year: currentYear
                })
            });
            if (res.ok) {
                let prevMonth = currentMonth - 1;
                let prevYear = currentYear;
                if (prevMonth < 1) { prevMonth = 12; prevYear--; }

                router.push(`/report?month=${prevMonth}&year=${prevYear}`);
            } else {
                const data = await res.json();
                alert(data.error || 'Lỗi khi lưu.');
            }
        } catch (e) {
            alert('Lỗi kết nối.');
        }
    };

    const handleAddTask = () => {
        const newTask = {
            id: `temp-${Date.now()}`,
            name: '',
            targetQuantity: 0, // planValue only - NO coeff, NO weight
        };
        setTasks([...tasks, newTask]);
    };

    const handleDelete = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const handleUpdate = (id: string, field: string, value: any) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const isLocked = status === 'APPROVED' || status === 'REVIEWED';

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push('/home')}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-500 hover:text-gray-900"
                    >
                        <Home size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Kế Hoạch Tháng (KH T{currentMonth})</h1>
                        <p className="text-gray-500 text-sm font-medium mt-1">Bước 1: Lập kế hoạch & Tỷ trọng.</p>
                    </div>
                </div>

                {isLocked ? (
                    <div className="flex items-center gap-2 bg-gray-100 text-gray-500 px-5 py-2.5 rounded-xl font-bold text-sm cursor-not-allowed">
                        <Lock size={18} /> Đã khóa ({status})
                    </div>
                ) : (
                    <button
                        onClick={handleSaveAndNext}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-200 transition-all active:scale-95">
                        Lưu & Báo cáo tháng trước <ArrowRight size={18} />
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden relative">
                {loading && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center"><span className="text-sm font-bold text-blue-600">Đang tải...</span></div>}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                                <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider w-10">#</th>
                                <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider">Nội dung công việc</th>
                                <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider w-40 text-center">Chỉ tiêu</th>
                                <th className="px-4 py-3 font-black uppercase text-[10px] tracking-wider w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tasks.map((task, index) => (
                                <tr key={task.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3">
                                        <input
                                            type="text"
                                            disabled={isLocked}
                                            value={task.name || ''}
                                            onChange={(e) => handleUpdate(task.id, 'name', e.target.value)}
                                            placeholder="Tên công việc..."
                                            className="w-full bg-transparent font-semibold text-gray-900 outline-none border-b border-transparent focus:border-blue-500 transition-all placeholder:text-gray-300 disabled:text-gray-500"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center">
                                            <input
                                                type="number"
                                                disabled={isLocked}
                                                value={task.targetQuantity || 0}
                                                onChange={(e) => handleUpdate(task.id, 'targetQuantity', parseFloat(e.target.value))}
                                                className="w-32 text-center bg-gray-100 rounded-lg py-2 font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-50"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {!isLocked && (
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!isLocked && (
                                <tr>
                                    <td colSpan={4} className="px-2 py-2">
                                        <button
                                            onClick={handleAddTask}
                                            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-xs hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 bg-gray-50/50 hover:bg-blue-50/50">
                                            <Plus size={16} /> Thêm đầu việc mới
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
