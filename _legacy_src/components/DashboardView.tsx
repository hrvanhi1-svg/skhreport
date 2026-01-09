
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Task, KPIResult } from '../types';
import { Tab } from '../App';
import { User, Calendar, Briefcase, Award, ArrowRight, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  kpiResult: KPIResult;
  month: number;
  year: number;
  userName: string;
  isSubmitted: boolean;
  onNavigate: (tab: Tab) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardView: React.FC<DashboardViewProps> = ({ tasks = [], kpiResult, month, year, userName = "Người dùng", isSubmitted, onNavigate }) => {
  
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  
  const weightData = safeTasks.map((t) => ({
    name: (t.name || "Nhiệm vụ").length > 20 ? (t.name || "Nhiệm vụ").substring(0, 20) + '...' : (t.name || "Nhiệm vụ"),
    value: t.weight || 0
  }));

  const scoreData = safeTasks.map(t => ({
    name: (t.name || "Nhiệm vụ").substring(0, 15),
    'Tự đánh giá': t.selfScore || 0,
    'QL đánh giá': t.managerScore || 0
  }));

  const completionRate = safeTasks.length > 0 
    ? safeTasks.filter(t => t.actualFinish).length / safeTasks.length * 100
    : 0;

  const displayFirstName = userName ? userName.split(' ').pop() || "Bạn" : "Bạn";

  return (
    <div className="p-3 md:p-6 h-full overflow-y-auto">
      <div className={`mb-6 p-4 md:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden group transition-all duration-500 ${isSubmitted ? 'bg-gradient-to-br from-green-600 via-green-700 to-teal-800' : 'bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900'}`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isSubmitted ? 'bg-white' : 'bg-green-400'}`}></span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-blue-50">Hệ thống đồng bộ URL</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">Chào {displayFirstName}!</h2>
            
            <div className="mt-3 flex items-start gap-2">
               {isSubmitted ? (
                 <CheckCircle2 size={18} className="text-white flex-shrink-0 mt-0.5" />
               ) : (
                 <AlertCircle size={18} className="text-blue-200 flex-shrink-0 mt-0.5" />
               )}
               <p className="text-white text-xs md:text-sm leading-relaxed font-bold">
                  {isSubmitted 
                    ? `Bạn đã hoàn thành báo cáo tháng ${month}/${year} thành công. Cảm ơn sự nỗ lực của bạn!` 
                    : `Bạn chưa hoàn thành báo cáo tháng ${month}/${year} này. Hãy báo cáo ngay để ghi nhận KPI!`}
               </p>
            </div>

            {!isSubmitted && (
               <div className="mt-6 flex flex-col xs:flex-row gap-3">
                  <button 
                   onClick={() => onNavigate(Tab.PLAN)}
                   className="bg-white text-blue-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <PlusCircle size={16} /> BÁO CÁO NGAY
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button 
                   onClick={() => onNavigate(Tab.KPI)}
                   className="bg-blue-500/20 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-500/30 transition-all text-center"
                  >
                    Xem đánh giá
                  </button>
               </div>
            )}
            
            {isSubmitted && (
               <div className="mt-6">
                  <span className="inline-block px-4 py-1.5 bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">Đã nộp lúc {new Date().toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
               </div>
            )}
          </div>
          
          <div className="flex flex-col items-center bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-inner w-full md:w-auto min-w-[150px]">
             <div className="text-center mb-2">
                <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100 mb-1">Xếp loại dự kiến</p>
                <div className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">{kpiResult?.rank || '-'}</div>
             </div>
             <div className="h-2 w-full max-w-[100px] bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${kpiResult?.totalScore || 0}%` }}></div>
             </div>
             <p className="text-xs font-bold mt-2 text-white">{kpiResult?.totalScore || 0} Điểm</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon={<User size={18} />} label="Họ tên" value={displayFirstName} color="bg-blue-500" />
        <StatCard icon={<Calendar size={18} />} label="Kỳ báo cáo" value={`Tháng ${month}`} color="bg-purple-500" />
        <StatCard icon={<Briefcase size={18} />} label="Hoàn thành" value={`${Math.round(completionRate)}%`} color="bg-orange-500" />
        <StatCard icon={<Award size={18} />} label="Xếp loại" value={`${kpiResult?.rank || 'N/A'}`} color="bg-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h3 className="text-xs md:text-sm font-bold text-gray-900 flex items-center gap-2 mb-6">
             <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
             Tỷ trọng công việc
           </h3>
           <div className="h-48 md:h-56 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={weightData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {weightData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-900">100%</span>
             </div>
           </div>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm">
           <h3 className="text-xs md:text-sm font-bold text-gray-900 flex items-center gap-2 mb-6">
             <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
             Kết quả tự đánh giá (%)
           </h3>
           <div className="h-48 md:h-56 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={scoreData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                 <XAxis dataKey="name" hide />
                 <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 700}} />
                 <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{ borderRadius: '12px', fontSize: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                 <Bar dataKey="Tự đánh giá" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={24} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden">
      <div className="flex items-center space-x-3">
          <div className={`${color} p-2 rounded-xl text-white group-hover:scale-110 transition-transform flex-shrink-0`}>
              {icon}
          </div>
          <div className="min-w-0">
              <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest truncate">{label}</p>
              <h3 className="text-xs md:text-sm font-bold text-gray-900 truncate">{value}</h3>
          </div>
      </div>
  </div>
);

export default DashboardView;
