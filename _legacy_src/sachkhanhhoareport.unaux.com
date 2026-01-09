
import React, { useState, useEffect } from 'react';
import { BarChart3, User, LogOut, PlusCircle, Home, ListChecks, Bell, ChevronDown, Users } from 'lucide-react';
import { Task, UserAccount, UserRole, ReportStatus, StaffReport, ReviewDecision } from './types';
import { INITIAL_PLAN_TASKS, INITIAL_REPORT_TASKS } from './constants';
import PlanView from './components/PlanView';
import ReportView from './components/ReportView';
import KPIView from './components/KPIView';
import DashboardView from './components/DashboardView';
import AuthView from './components/AuthView';
import ProfileModal from './components/ProfileModal';
import AdminApprovalView from './components/AdminApprovalView';
import UserManagementView from './components/UserManagementView';

export enum Tab {
  DASHBOARD = 'dashboard',
  PLAN = 'plan',
  REPORT = 'report',
  KPI = 'kpi',
  APPROVALS = 'approvals',
  USER_MGMT = 'user_mgmt'
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserAccount[]>([]);
  const [allReports, setAllReports] = useState<StaffReport[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Helper điều hướng tập trung sử dụng Hash Routing (#/)
  const navigateTo = (path: string) => {
    const formattedPath = path.startsWith('#') ? path : `#${path}`;
    if (window.location.hash !== formattedPath) {
      window.location.hash = formattedPath;
    }
  };

  // Logic đồng bộ hóa URL Hash với State của App
  const syncRouteWithState = () => {
    try {
      const hash = window.location.hash || '#/home';
      const path = hash.replace(/^#/, '');
      
      const userJson = localStorage.getItem('erp_user_session');
      let user: UserAccount | null = null;
      if (userJson) {
        try {
          user = JSON.parse(userJson);
        } catch (e) {
          user = null;
        }
      }

      // TRƯỜNG HỢP 1: CHƯA ĐĂNG NHẬP
      if (!user) {
        if (path === '/signin') {
          setActiveTab(Tab.DASHBOARD); // AuthView sẽ tự xử lý dựa trên hash
        } else if (path !== '/login') {
          window.location.hash = '#/login';
        } else {
          setActiveTab(Tab.DASHBOARD);
        }
        return;
      }

      // TRƯỜNG HỢP 2: ĐÃ ĐĂNG NHẬP
      // Chuyển hướng nếu đang ở trang auth
      if (path === '/login' || path === '/signin' || path === '/') {
        window.location.hash = '#/home';
        return;
      }

      // Kiểm tra quyền truy cập Admin
      if (path === '/admin') {
        if (user.role === UserRole.SYS) {
          setActiveTab(Tab.USER_MGMT);
        } else {
          window.location.hash = '#/home';
        }
        return;
      }

      // Map các path còn lại sang Tab
      switch (path) {
        case '/home': setActiveTab(Tab.DASHBOARD); break;
        case '/plan': setActiveTab(Tab.PLAN); break;
        case '/report': setActiveTab(Tab.REPORT); break;
        case '/kpi': setActiveTab(Tab.KPI); break;
        case '/approvals': setActiveTab(Tab.APPROVALS); break;
        default:
          window.location.hash = '#/home';
          setActiveTab(Tab.DASHBOARD);
      }
    } catch (e) {
      console.error("Routing error:", e);
    }
  };

  useEffect(() => {
    // Khởi tạo dữ liệu người dùng
    const savedUsers = localStorage.getItem('erp_all_users');
    let usersList: UserAccount[] = [];
    if (savedUsers) {
      try {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed)) usersList = parsed;
      } catch (e) {}
    }

    if (usersList.length === 0) {
      usersList = [
        { email: 'admin@skh.vn', password: '123', name: 'Quản trị hệ thống', role: UserRole.SYS, department: 'IT', age: '35', joinDate: '2023-01-01', managerEmails: [] },
        { email: 'director@skh.vn', password: '123', name: 'Giám đốc Điều hành', role: UserRole.DM, department: 'Ban Giám đốc', age: '45', joinDate: '2020-01-01', managerEmails: [] },
        { email: 'tp@skh.vn', password: '123', name: 'Trưởng phòng Marketing', role: UserRole.TL, department: 'Marketing', age: '32', joinDate: '2022-01-01', managerEmails: ['director@skh.vn'] },
        { email: 'nv@skh.vn', password: '123', name: 'Nguyễn Văn Nhân Viên', role: UserRole.EMP, department: 'Marketing', age: '25', joinDate: '2024-01-01', managerEmails: ['tp@skh.vn'] }
      ];
      localStorage.setItem('erp_all_users', JSON.stringify(usersList));
    }
    setAllUsers(usersList);

    // Khôi phục phiên đăng nhập
    const savedUser = localStorage.getItem('erp_user_session');
    if (savedUser) {
      try {
        const sessionUser = JSON.parse(savedUser);
        const latest = usersList.find(u => u.email === sessionUser.email);
        if (latest) setCurrentUser(latest);
      } catch (e) {}
    }

    // Load báo cáo
    const savedReports = localStorage.getItem('erp_all_reports');
    if (savedReports) {
      try {
        const parsed = JSON.parse(savedReports);
        if (Array.isArray(parsed)) setAllReports(parsed);
      } catch (e) {}
    }

    // Đăng ký sự kiện thay đổi Hash
    syncRouteWithState();
    window.addEventListener('hashchange', syncRouteWithState);
    setIsInitialLoad(false);

    return () => window.removeEventListener('hashchange', syncRouteWithState);
  }, []);

  const handleLogin = (user: UserAccount) => {
    const latest = allUsers.find(u => u.email === user.email) || user;
    setCurrentUser(latest);
    localStorage.setItem('erp_user_session', JSON.stringify(latest));
    navigateTo('/home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('erp_user_session');
    setIsDropdownOpen(false);
    navigateTo('/login');
  };

  const handleUpdateUser = (email: string, updates: Partial<UserAccount>) => {
    const updated = allUsers.map(u => u.email === email ? { ...u, ...updates } : u);
    setAllUsers(updated);
    localStorage.setItem('erp_all_users', JSON.stringify(updated));
    if (currentUser?.email === email) {
      setCurrentUser({ ...currentUser, ...updates } as UserAccount);
    }
  };

  const handleSubmitReport = (tasks: Task[]) => {
    if (!currentUser) return;
    const newReport: StaffReport = {
      id: `rep-${Date.now()}`,
      userId: currentUser.email,
      userName: currentUser.name,
      department: currentUser.department,
      tasks: tasks,
      status: ReportStatus.SUBMITTED,
      submittedAt: new Date().toLocaleDateString('vi-VN'),
      reviews: []
    };
    const updated = [newReport, ...allReports];
    setAllReports(updated);
    localStorage.setItem('erp_all_reports', JSON.stringify(updated));
    navigateTo('/home');
  };

  const handleManagerReview = (reportId: string, score: number, comment: string, decision: ReviewDecision) => {
    if (!currentUser) return;
    const updatedReports = allReports.map(r => {
      if (r.id === reportId) {
        const newReview = {
          id: `rev-${Date.now()}`,
          managerId: currentUser.email,
          managerName: currentUser.name,
          managerRole: currentUser.role,
          comment, score, decision,
          reviewedAt: new Date().toLocaleDateString('vi-VN')
        };
        
        let newStatus = r.status;
        if (decision === ReviewDecision.REVISE) newStatus = ReportStatus.DRAFT;
        else if (decision === ReviewDecision.REJECT) newStatus = ReportStatus.REJECTED;
        else {
          const userRole = allUsers.find(u => u.email === r.userId)?.role;
          if (userRole === UserRole.EMP && currentUser.role === UserRole.TL) newStatus = ReportStatus.APPROVED;
          else if (userRole === UserRole.TL && (currentUser.role === UserRole.DM || currentUser.role === UserRole.DDM)) newStatus = ReportStatus.APPROVED;
          else newStatus = ReportStatus.REVIEWED;
        }
        return { ...r, reviews: [...r.reviews, newReview], status: newStatus };
      }
      return r;
    });
    setAllReports(updatedReports);
    localStorage.setItem('erp_all_reports', JSON.stringify(updatedReports));
  };

  if (isInitialLoad) return null;

  if (!currentUser) {
    const isSignin = window.location.hash === '#/signin';
    return <AuthView onLogin={handleLogin} initialMode={isSignin ? 'signin' : 'login'} />;
  }

  const isAdmin = currentUser.role === UserRole.SYS;
  const isManager = [UserRole.TL, UserRole.DDM, UserRole.DM].includes(currentUser.role);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => navigateTo('/home')} className="flex items-center gap-2.5 group">
                <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <BarChart3 className="text-white w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <h1 className="text-sm font-black text-gray-900 uppercase tracking-tight">SÁCH KHÁNH HÒA</h1>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest leading-none">ERP Portal</span>
                </div>
              </button>

              <nav className="hidden lg:flex items-center gap-1 ml-6 border-l border-gray-100 pl-6">
                <button onClick={() => navigateTo('/home')} className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === Tab.DASHBOARD ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <Home size={16} className="mr-2" /> Trang chủ
                </button>
                
                {currentUser.role !== UserRole.SYS && (
                  <button onClick={() => navigateTo('/plan')} className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${[Tab.PLAN, Tab.REPORT, Tab.KPI].includes(activeTab) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <PlusCircle size={16} className="mr-2" /> Báo cáo của tôi
                  </button>
                )}

                {(isManager || isAdmin) && (
                  <button onClick={() => navigateTo('/approvals')} className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === Tab.APPROVALS ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <ListChecks size={16} className="mr-2" /> Duyệt cấp dưới
                  </button>
                )}

                {isAdmin && (
                  <button onClick={() => navigateTo('/admin')} className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === Tab.USER_MGMT ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                    <Users size={16} className="mr-2" /> Quản trị hệ thống
                  </button>
                )}
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
               <div className="relative">
                 <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-xl transition-colors">
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${isAdmin ? 'bg-red-600' : 'bg-blue-600'}`}>
                     {(currentUser?.name || "U").charAt(0).toUpperCase()}
                   </div>
                   <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                 </button>
                 {isDropdownOpen && (
                   <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                     <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-[9px] font-black text-blue-600 uppercase mb-1">{currentUser.role}</p>
                        <p className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</p>
                     </div>
                     <button onClick={() => { setIsProfileOpen(true); setIsDropdownOpen(false); }} className="w-full px-4 py-2.5 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium transition-colors">
                       <User size={16} className="text-gray-400" /> Hồ sơ cá nhân
                     </button>
                     <button onClick={handleLogout} className="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-3 font-bold transition-colors">
                       <LogOut size={16} /> Đăng xuất
                     </button>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 min-h-[75vh] flex flex-col overflow-hidden">
          {activeTab === Tab.DASHBOARD && (
            <DashboardView 
              tasks={INITIAL_REPORT_TASKS} 
              kpiResult={{totalScore: 85, rank: 'B'}} 
              month={new Date().getMonth()+1} 
              year={2025} 
              userName={currentUser?.name || "Người dùng"} 
              isSubmitted={false} 
              onNavigate={(tab) => {
                if (tab === Tab.PLAN) navigateTo('/plan');
                if (tab === Tab.KPI) navigateTo('/kpi');
              }} 
            />
          )}

          {activeTab === Tab.PLAN && <PlanView tasks={INITIAL_PLAN_TASKS} onUpdateTask={() => {}} onAddTask={() => {}} onNext={() => navigateTo('/report')} />}
          {activeTab === Tab.REPORT && <ReportView tasks={INITIAL_REPORT_TASKS} onUpdateTask={() => {}} onAddTask={() => {}} onDeleteTask={() => {}} onBack={() => navigateTo('/plan')} onNext={() => navigateTo('/kpi')} />}
          {activeTab === Tab.KPI && <KPIView tasks={INITIAL_REPORT_TASKS} onUpdateTask={() => {}} kpiResult={{totalScore: 92, rank: 'A'}} onBack={() => navigateTo('/report')} onSubmit={() => handleSubmitReport(INITIAL_REPORT_TASKS)} />}
          {activeTab === Tab.APPROVALS && (isManager || isAdmin) && <AdminApprovalView currentUser={currentUser as UserAccount} reports={allReports} onReview={handleManagerReview} />}
          {activeTab === Tab.USER_MGMT && isAdmin && <UserManagementView users={allUsers} onUpdateUser={handleUpdateUser} />}
        </div>
      </main>

      {isProfileOpen && currentUser && <ProfileModal user={currentUser} onClose={() => setIsProfileOpen(false)} onUpdate={(u) => handleUpdateUser(currentUser.email, u)} />}
    </div>
  );
};

export default App;
