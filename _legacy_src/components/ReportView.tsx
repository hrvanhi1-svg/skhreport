
import React from 'react';
import { Plus, Trash2, CornerDownRight, PlusCircle, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { Task, SubTask } from '../types';

interface ReportViewProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddTask: () => void;
  onDeleteTask: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const ReportView: React.FC<ReportViewProps> = ({ tasks, onUpdateTask, onAddTask, onDeleteTask, onBack, onNext }) => {
  const totalWeight = tasks.reduce((sum, t) => sum + (t.weight || 0), 0);
  const isWeightValid = Math.abs(totalWeight - 100) < 0.1;

  const handleAddSubTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newSubTask: SubTask = { id: Date.now().toString(), name: "", result: "" };
    onUpdateTask(taskId, { subTasks: [...(task.subTasks || []), newSubTask] });
  };

  const handleUpdateSubTask = (taskId: string, subTaskId: string, field: keyof SubTask, value: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.subTasks) return;
    const updatedSubTasks = task.subTasks.map(st => st.id === subTaskId ? { ...st, [field]: value } : st);
    onUpdateTask(taskId, { subTasks: updatedSubTasks });
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
       <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
            <h2 className="text-base md:text-lg font-bold text-gray-900">Báo cáo kết quả công việc</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Bước 2: Khai báo kết quả thực tế</p>
        </div>
        <div className={`text-[10px] font-bold px-3 py-1.5 rounded-xl border flex items-center gap-2 ${isWeightValid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          TRỌNG SỐ: {totalWeight}%
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-4 space-y-6">
        {tasks.map((task, index) => (
          <div key={task.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-blue-300 transition-all">
            <div className="bg-blue-50/30 px-4 py-3 border-b border-gray-100 flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-xl text-xs mt-1">{index + 1}</div>
              <div className="flex-1">
                 <textarea 
                    rows={1}
                    value={task.name}
                    onChange={(e) => onUpdateTask(task.id, { name: e.target.value })}
                    className="w-full bg-transparent px-2 py-1 text-xs md:text-sm font-bold text-gray-900 border border-transparent hover:border-gray-200 focus:border-blue-400 focus:bg-white rounded-md outline-none"
                    placeholder="Tên đầu mục chính..."
                 />
              </div>
            </div>

            <div className="p-4 space-y-4">
              {(task.subTasks || []).map((subTask) => (
                <div key={subTask.id} className="flex gap-2">
                  <CornerDownRight className="text-gray-300 mt-1" size={14} />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input value={subTask.name} onChange={e => handleUpdateSubTask(task.id, subTask.id, 'name', e.target.value)} placeholder="Chi tiết việc làm..." className="text-[11px] font-medium border-b border-transparent focus:border-blue-200 outline-none" />
                    <input value={subTask.result} onChange={e => handleUpdateSubTask(task.id, subTask.id, 'result', e.target.value)} placeholder="Kết quả đạt được..." className="text-[11px] font-bold text-blue-700 border-b border-transparent focus:border-blue-200 outline-none" />
                  </div>
                </div>
              ))}
              <button onClick={() => handleAddSubTask(task.id)} className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700">
                <Plus size={12} /> Thêm chi tiết kết quả
              </button>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Nhân viên tự chấm (%)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" min="0" max="100" value={task.selfScore} onChange={(e) => onUpdateTask(task.id, { selfScore: Number(e.target.value) })} className="w-16 text-center py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-900" />
                    <span className="text-[10px] text-gray-400 font-bold">%</span>
                    <input value={task.resultDescription} onChange={(e) => onUpdateTask(task.id, { resultDescription: e.target.value })} placeholder="Mô tả minh chứng..." className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1 text-[10px] font-medium" />
                  </div>
               </div>
               <div>
                  <label className="text-[8px] font-bold text-blue-400 uppercase tracking-widest block mb-2">Quản lý đánh giá (Sau khi nộp)</label>
                  <div className="px-3 py-1 bg-blue-50/50 border border-blue-100 rounded-lg text-[11px] font-bold text-blue-900">{task.managerScore}%</div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row gap-2">
          <button onClick={onBack} className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50">Quay lại</button>
          <button onClick={onNext} className="flex-1 px-6 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-indigo-700 flex items-center justify-center gap-2">Tiếp tục: Kiểm tra & Gửi <ArrowRight size={14} /></button>
      </div>
    </div>
  );
};

export default ReportView;
