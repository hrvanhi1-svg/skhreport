'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Send, CheckCircle2, Award, Info, ChevronLeft, Printer, Download, Clock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function KPIPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : d.getMonth() + 1;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : d.getFullYear();

    const [status, setStatus] = useState('DRAFT');
    const [totalKPI, setTotalKPI] = useState(0);
    const [rank, setRank] = useState('D');

    useEffect(() => {
        setLoading(true);
        fetch(`/api/evaluations?month=${month}&year=${year}`)
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
    }, [month, year]);

    // PURE FUNCTION: Compute Weighted Score
    const computeWeightedScore = (score: number, weight: number): number => {
        if (weight < 0) return 0;
        const result = score * weight;
        return isNaN(result) ? 0 : result;
    };

    // PURE FUNCTION: Compute Total KPI
    const computeTotalKPI = (items: any[]): number => {
        return items.reduce((sum, item) => {
            const weighted = computeWeightedScore(item.convertedValue || 0, item.weight || 0);
            return sum + weighted;
        }, 0);
    };

    // Handle Weight Input
    const handleWeightUpdate = (id: string, value: number) => {
        let newWeight = value;
        if (newWeight < 0) newWeight = 0;
        setTasks(prev => prev.map(t => t.id === id ? { ...t, weight: newWeight } : t));
    };

    useEffect(() => {
        // Recalculate Total KPI and Rank
        const total = computeTotalKPI(tasks);
        setTotalKPI(parseFloat(total.toFixed(2)));

        // Derive Rating
        let r = 'D';
        if (total >= 90) r = 'A';
        else if (total >= 75) r = 'B';
        else if (total >= 50) r = 'C';
        setRank(r);
    }, [tasks]);

    const handleSubmit = async () => {
        const confirmed = window.confirm("Nộp báo cáo KPI? Quản lý sẽ nhận được thông báo để duyệt và chấm điểm chính thức.");
        if (!confirmed) return;

        try {
            const res = await fetch('/api/evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasks,
                    month,
                    year,
                    status: 'SUBMITTED'
                })
            });
            if (res.ok) {
                alert('Đã nộp báo cáo! Chờ quản lý duyệt.');
                setStatus('SUBMITTED');
            } else {
                const data = await res.json();
                alert(data.error || 'Lỗi khi gửi.');
            }
        } catch (e) {
            alert('Lỗi kết nối.');
        }
    };

    const isSubmitted = status === 'SUBMITTED' || status === 'REVIEWED' || status === 'APPROVED';

    return (
        <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500 overflow-x-hidden min-h-screen">
            {/* Header Bar */}
            <div className="px-4 py-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all text-gray-500 hover:text-gray-900 group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-tight">Xác nhận báo cáo (T{month})</h2>
                        <p className="text-[10px] md:text-xs text-gray-500 font-medium">Kiểm tra lại lần cuối trước khi nộp.</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-widest whitespace-nowrap">
                        <Printer size={14} /> In nháp
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-widest whitespace-nowrap">
                        <Download size={14} /> Xuất PDF
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border-b border-gray-100">
                <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-blue-200">Tổng điểm tự chấm</span>
                        <div className="text-3xl md:text-4xl font-bold mt-1">{totalKPI}</div>
                        <p className="text-[9px] text-blue-100 mt-1 font-medium italic">Dựa trên {tasks.length} đầu mục</p>
                    </div>
                    <CheckCircle2 className="absolute -right-3 -bottom-3 w-16 h-16 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg relative overflow-hidden group">
                    <div className="relative z-10">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-indigo-200">Xếp loại dự kiến</span>
                        <div className="text-3xl md:text-4xl font-bold mt-1">{rank}</div>
                        <div className="mt-2 h-1 w-20 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white" style={{ width: `${Math.min(totalKPI, 100)}%` }}></div>
                        </div>
                    </div>
                    <Award className="absolute -right-3 -bottom-3 w-16 h-16 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                </div>

                <div className={`sm:col-span-2 lg:col-span-1 p-3 rounded-2xl border flex items-center gap-3 ${isSubmitted ? 'bg-orange-50 border-orange-100' : 'bg-amber-50 border-amber-100'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl bg-white border flex items-center justify-center flex-shrink-0 ${isSubmitted ? 'border-orange-200 text-orange-600' : 'border-amber-200 text-amber-600'
                        }`}>
                        <Info size={18} />
                    </div>
                    <div>
                        <h4 className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isSubmitted ? 'text-orange-900' : 'text-amber-900'
                            }`}>Trạng thái: {status === 'DRAFT' ? 'CHƯA NỘP' : status}</h4>
                        <p className={`text-[9px] leading-tight mt-1 ${isSubmitted ? 'text-orange-700' : 'text-amber-700'
                            }`}>
                            {isSubmitted ? 'Đã gửi đi. Chờ phản hồi.' : 'Báo cáo sẽ được gửi đi khi nhấn nút Nộp phía dưới.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="flex-1 bg-gray-50/30 overflow-y-auto">
                <div className="max-w-6xl mx-auto py-4 px-3 md:px-4 space-y-4 pb-24">
                    {loading && <div className="text-center text-sm text-gray-400">Đang tải dữ liệu...</div>}

                    {tasks.map((task, index) => {
                        const convertedScore = task.convertedValue || 0;
                        const weight = task.weight || 0;
                        const weightedScore = computeWeightedScore(convertedScore, weight);

                        return (
                            <div key={task.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <div className="p-4 bg-white flex items-start gap-3">
                                    <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{index + 1}</span>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-2">{task.name}</h3>
                                        {task.resultDescription && (
                                            <div className="pl-3 border-l-2 border-blue-50 py-1">
                                                <p className="text-[11px] font-medium text-blue-700 whitespace-pre-wrap">
                                                    {task.resultDescription}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Grid Footer */}
                                <div className="grid grid-cols-3 bg-gray-50/50 border-t border-gray-100 py-3 px-4">
                                    <div className="flex flex-col items-center border-r border-gray-100">
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Điểm quy đổi (P2)</span>
                                        <span className="text-xs font-bold text-gray-700">{convertedScore.toFixed(2)}</span>
                                    </div>
                                    <div className="flex flex-col items-center border-r border-gray-100">
                                        <span className="text-[8px] font-bold text-purple-500 uppercase tracking-widest">Trọng số</span>
                                        <input
                                            type="number"
                                            disabled={isSubmitted}
                                            value={weight}
                                            onChange={(e) => handleWeightUpdate(task.id, parseFloat(e.target.value))}
                                            className="w-16 h-7 flex items-center justify-center bg-white border border-purple-100 rounded-lg font-bold text-purple-700 text-xs shadow-inner mt-0.5 text-center outline-none focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100 disabled:text-gray-500"
                                        />
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">Kết quả</span>
                                        <span className="text-sm font-bold text-indigo-700 mt-0.5">{weightedScore.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t border-gray-200 p-4 shadow-xl z-30">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">!</div>
                        <div>
                            <p className="text-[11px] md:text-xs font-bold text-gray-900 leading-none">Xác nhận nộp báo cáo</p>
                            <p className="text-[9px] md:text-[10px] text-gray-500 font-medium mt-1">Dữ liệu sẽ được gửi tới Quản lý trực tiếp.</p>
                        </div>
                    </div>
                    {!isSubmitted && (
                        <button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md transition-all hover:scale-[1.02] active:scale-95 group uppercase tracking-widest"
                        >
                            NỘP BÁO CÁO <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    )}
                    {isSubmitted && (
                        <div className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm select-none">
                            <Clock size={16} /> Đã nộp thành công
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function KPIPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Đang tải...</div>}>
            <KPIPageContent />
        </Suspense>
    );
}

