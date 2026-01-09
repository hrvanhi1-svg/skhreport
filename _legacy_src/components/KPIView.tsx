
import React from 'react';
import { Task, KPIResult } from '../types';
import { ChevronLeft, Printer, Download, Info, CheckCircle2, Award, Send } from 'lucide-react';

interface KPIViewProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  kpiResult: KPIResult;
  onBack?: () => void;
  onSubmit?: () => void;
}

const KPIView: React.FC<KPIViewProps> = ({ tasks, onUpdateTask, kpiResult, onBack, onSubmit }) => {
  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-500 overflow-x-hidden">
      <div className="px-4 py-4 md:p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
           {onBack && (
             <button 
                onClick={onBack}
                className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all text-gray-500 hover:text-gray-900 group"
             >
                <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
             </button>
           )}
           <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase tracking-tight">Xác nhận báo cáo</h2>
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

      <div className="p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-white border-b border-gray-100">
         <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[8px] font-bold uppercase tracking-widest text-blue-200">Tổng điểm tự chấm</span>
              <div className="text-3xl md:text-4xl font-bold mt-1">{kpiResult.totalScore}</div>
              <p className="text-[9px] text-blue-100 mt-1 font-medium italic">Dựa trên {tasks.length} đầu mục</p>
            </div>
            <CheckCircle2 className="absolute -right-3 -bottom-3 w-16 h-16 text-white/10 group-hover:scale-110 transition-transform duration-500" />
         </div>

         <div className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[8px] font-bold uppercase tracking-widest text-indigo-200">Xếp loại dự kiến</span>
              <div className="text-3xl md:text-4xl font-bold mt-1">{kpiResult.rank}</div>
              <div className="mt-2 h-1 w-20 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white" style={{ width: `${kpiResult.totalScore}%` }}></div>
              </div>
            </div>
            <Award className="absolute -right-3 -bottom-3 w-16 h-16 text-white/10 group-hover:scale-110 transition-transform duration-500" />
         </div>

         <div className="sm:col-span-2 lg:col-span-1 p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
               <Info size={18} />
            </div>
            <div>
               <h4 className="text-[10px] font-bold text-amber-900 uppercase tracking-widest leading-none">Trạng thái: CHƯA NỘP</h4>
               <p className="text-[9px] text-amber-700 leading-tight mt-1">Báo cáo sẽ được gửi đi khi nhấn nút Nộp phía dưới.</p>
            </div>
         </div>
      </div>

      <div className="overflow-y-auto overflow-x-hidden flex-1 bg-gray-50/30">
        <div className="max-w-6xl mx-auto py-4 px-3 md:px-4 space-y-4">
          {tasks.map((task, index) => {
            const finalScore = (task.weight * task.selfScore) / 100;
            return (
              <div key={task.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 bg-white flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{index + 1}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight mb-3">{task.name}</h3>
                    <div className="space-y-3 pl-3 border-l-2 border-blue-50">
                      {(task.subTasks || []).map(st => (
                        <div key={st.id} className="flex flex-col">
                           <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-0.5">{st.name}</span>
                           <p className="text-[11px] font-medium text-blue-700">{st.result || <span className="text-gray-300 italic">Chưa có kết quả</span>}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 bg-gray-50/50 border-t border-gray-100 py-3 px-4">
                  <div className="flex flex-col items-center border-r border-gray-100">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Tỷ trọng</span>
                    <span className="text-xs font-bold text-gray-700">{task.weight}%</span>
                  </div>
                  <div className="flex flex-col items-center border-r border-gray-100">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Tự chấm</span>
                    <div className="w-10 h-7 flex items-center justify-center bg-white border border-gray-100 rounded-lg font-bold text-gray-900 text-xs shadow-inner mt-0.5">
                      {task.selfScore}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Thành phần</span>
                    <span className="text-sm font-bold text-blue-700 mt-0.5">{finalScore.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 md:p-6 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">!</div>
           <div>
              <p className="text-[11px] md:text-xs font-bold text-gray-900 leading-none">Xác nhận nộp báo cáo</p>
              <p className="text-[9px] md:text-[10px] text-gray-500 font-medium mt-1">Dữ liệu sẽ được gửi tới Quản lý trực tiếp.</p>
           </div>
        </div>
        <button 
          onClick={onSubmit}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md transition-all hover:scale-[1.02] active:scale-95 group uppercase tracking-widest"
        >
           NỘP BÁO CÁO <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default KPIView;
