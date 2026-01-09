
import React from 'react';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { Task, TaskCategory } from '../types';

interface PlanViewProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onAddTask: (task: Task) => void;
  onNext: () => void;
}

const PlanView: React.FC<PlanViewProps> = ({ tasks, onUpdateTask, onAddTask, onNext }) => {
  const totalWeight = tasks.reduce((sum, t) => sum + (t.weight || 0), 0);
  
  const handleAddNew = () => {
    // Fixed: Added collaboration property to match Task interface
    const newTask: Task = {
      id: Date.now().toString(),
      category: TaskCategory.I,
      name: "Công việc mới",
      weight: 0,
      startDate: new Date().toISOString().split('T')[0],
      deadline: new Date().toISOString().split('T')[0],
      actualFinish: "",
      collaboration: "",
      resultDescription: "",
      selfScore: 0,
      managerScore: 0,
      note: ""
    };
    onAddTask(newTask);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <div className="px-5 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-b border-gray-100 gap-3">
        <div>
          <h2 className="text-base md:text-lg font-bold text-gray-900">Danh sách kế hoạch tháng mới</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Bước 1: Xác định mục tiêu thực hiện</p>
        </div>
        <div className={`text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs border transition-colors whitespace-nowrap ${totalWeight === 100 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          Tổng tỷ trọng: {totalWeight}% {totalWeight !== 100 && "(≠ 100%)"}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 p-4 space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:border-blue-200 transition-all">
            <div className="p-3 bg-gray-50/50 flex items-start gap-2 border-b border-gray-100">
              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{index + 1}</span>
              <textarea 
                rows={1}
                value={task.name}
                onChange={(e) => onUpdateTask(task.id, { name: e.target.value })}
                className="flex-1 bg-transparent px-2 py-1 text-xs md:text-sm font-bold text-gray-900 border border-transparent hover:border-gray-200 focus:border-blue-400 focus:bg-white rounded-md transition-all outline-none"
                placeholder="Tên công việc..."
              />
            </div>
            <div className="p-3 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Tỷ trọng (%)</label>
                <input 
                  type="number" 
                  value={task.weight}
                  onChange={(e) => onUpdateTask(task.id, { weight: parseFloat(e.target.value) || 0 })}
                  className="w-full text-center py-1.5 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-400 outline-none text-xs font-bold text-blue-800"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Bắt đầu</label>
                <input 
                  type="date" 
                  value={task.startDate}
                  onChange={(e) => onUpdateTask(task.id, { startDate: e.target.value })}
                  className="w-full px-2 py-1.5 text-[11px] font-medium text-gray-700 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Hạn chót</label>
                <input 
                  type="date" 
                  value={task.deadline}
                  onChange={(e) => onUpdateTask(task.id, { deadline: e.target.value })}
                  className="w-full px-2 py-1.5 text-[11px] font-medium text-gray-700 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-400 outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Ghi chú</label>
                <input 
                  value={task.note}
                  onChange={(e) => onUpdateTask(task.id, { note: e.target.value })}
                  placeholder="..."
                  className="w-full px-2 py-1.5 text-[11px] text-gray-600 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-blue-400 outline-none"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={handleAddNew} className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-dashed border-blue-200 text-blue-500 font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-50 transition-all">
          <Plus size={16} /> THÊM CÔNG VIỆC
        </button>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-end">
          <button onClick={onNext} className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            Tiếp tục: Khai báo kết quả <ArrowRight size={14} />
          </button>
      </div>
    </div>
  );
};

export default PlanView;