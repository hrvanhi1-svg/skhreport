
import React, { useState } from 'react';
import { StaffReport, UserRole, ReportStatus, ReviewDecision, UserAccount } from '../types';
import { Eye, Search, AlertCircle, FileText, CheckCircle2, RefreshCw, XCircle, MessageSquare, ShieldCheck } from 'lucide-react';

interface AdminApprovalViewProps {
  currentUser: UserAccount;
  reports: StaffReport[];
  onReview: (reportId: string, score: number, comment: string, decision: ReviewDecision) => void;
}

const AdminApprovalView: React.FC<AdminApprovalViewProps> = ({ currentUser, reports, onReview }) => {
  const [selectedReport, setSelectedReport] = useState<StaffReport | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewForm, setReviewForm] = useState({ score: 0, comment: '', decision: ReviewDecision.APPROVE });

  const safeReports = Array.isArray(reports) ? reports : [];

  const filteredReports = safeReports.filter(r => {
    const isManager = currentUser.role === UserRole.SYS || currentUser.role === UserRole.DM || currentUser.role === UserRole.DDM || currentUser.role === UserRole.TL;
    const matchesSearch = (r.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) || (r.department || "").toLowerCase().includes(searchTerm.toLowerCase());
    return isManager && matchesSearch && r.status !== ReportStatus.DRAFT;
  });

  const getStatusStyle = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.SUBMITTED: return "bg-amber-50 text-amber-700 border-amber-100";
      case ReportStatus.REVIEWED: return "bg-blue-50 text-blue-700 border-blue-100";
      case ReportStatus.APPROVED: return "bg-green-50 text-green-700 border-green-100";
      case ReportStatus.REJECTED: return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50/30 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
             <FileText className="text-blue-600" /> Thẩm định báo cáo
           </h2>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Hệ thống duyệt báo cáo đa cấp</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
           <input 
              type="text" 
              placeholder="Tìm nhân sự, phòng ban..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredReports.map(report => (
          <div key={report.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg border border-blue-100">
                 {(report.userName || "U").charAt(0)}
               </div>
               <div>
                 <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                   {report.userName}
                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border uppercase ${getStatusStyle(report.status)}`}>
                     {report.status}
                   </span>
                 </h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{report.department} • Nộp: {report.submittedAt}</p>
               </div>
            </div>
            
            <button 
              onClick={() => { 
                setSelectedReport(report); 
                setReviewForm({
                  score: report.tasks?.[0]?.selfScore || 0,
                  comment: '',
                  decision: ReviewDecision.APPROVE
                }); 
              }}
              className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
            >
              <Eye size={14} /> Xem & Đánh giá
            </button>
          </div>
        ))}
        
        {filteredReports.length === 0 && (
          <div className="py-20 flex flex-col items-center opacity-50">
            <AlertCircle size={40} className="text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Không có báo cáo chờ duyệt</p>
          </div>
        )}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2 rounded-xl text-white"><ShieldCheck /></div>
                    <div>
                       <h2 className="text-lg font-bold text-gray-900 uppercase">Thẩm định: {selectedReport.userName}</h2>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedReport.department}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400">✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                       {(selectedReport.tasks || []).map((task, idx) => (
                         <div key={task.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                            <p className="text-xs font-bold text-gray-900 mb-2">{idx + 1}. {task.name}</p>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="text-[10px] text-gray-500">Tỷ trọng: <span className="text-gray-900 font-bold">{task.weight}%</span></div>
                               <div className="text-[10px] text-gray-500">Nhân viên chấm: <span className="text-blue-600 font-bold">{task.selfScore}%</span></div>
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="space-y-6">
                       <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xl">
                          <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-6">Đánh giá của Quản lý</h4>
                          <div className="space-y-4">
                             <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Điểm hiệu suất (%)</label>
                                <input 
                                   type="number" 
                                   value={reviewForm.score} 
                                   onChange={e => setReviewForm({...reviewForm, score: Number(e.target.value)})}
                                   className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xl font-black text-blue-700 outline-none"
                                />
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Nhận xét</label>
                                <textarea 
                                   rows={4}
                                   placeholder="Nhập phản hồi..."
                                   value={reviewForm.comment}
                                   onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                                   className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs font-bold text-gray-900 outline-none"
                                />
                             </div>
                             <div className="grid grid-cols-1 gap-2">
                                <button 
                                   onClick={() => { onReview(selectedReport.id, reviewForm.score, reviewForm.comment, ReviewDecision.APPROVE); setSelectedReport(null); }}
                                   className="w-full py-3.5 bg-green-600 text-white font-black text-xs rounded-2xl hover:bg-green-700 uppercase"
                                >
                                   Phê duyệt
                                </button>
                                <button 
                                   onClick={() => { onReview(selectedReport.id, reviewForm.score, reviewForm.comment, ReviewDecision.REVISE); setSelectedReport(null); }}
                                   className="w-full py-3 bg-amber-500 text-white font-black text-[10px] rounded-2xl hover:bg-amber-600 uppercase"
                                >
                                   Yêu cầu sửa lại
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalView;
