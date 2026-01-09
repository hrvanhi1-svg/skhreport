
import React, { useState, useEffect } from 'react';
import { BarChart3, Mail, Lock, User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { UserAccount, UserRole } from '../types';

interface AuthViewProps {
  onLogin: (user: UserAccount) => void;
  initialMode?: 'login' | 'signin';
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    department: '',
    age: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLogin(initialMode === 'login');
    setError('');
  }, [initialMode]);

  const handleToggleMode = (mode: 'login' | 'signin') => {
    setIsLogin(mode === 'login');
    setError('');
    try {
      window.location.hash = mode === 'login' ? '#/login' : '#/signin';
    } catch (e) {
      console.error("Auth routing error:", e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Vui lòng nhập email và mật khẩu');
        return;
      }
      
      // Default Admin Accounts
      if (formData.email === 'admin@skh.vn' && formData.password === '123') {
        onLogin({ 
          email: formData.email, 
          name: 'Quản trị hệ thống', 
          department: 'IT', 
          age: '35', 
          joinDate: '2023-01-01', 
          role: UserRole.SYS,
          managerEmails: [] 
        });
        return;
      }
      
      // Load other users from consistent key
      let users: any[] = [];
      try {
        const saved = localStorage.getItem('erp_all_users');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) users = parsed;
        }
      } catch (e) {
        console.error("Auth: Failed to load users", e);
      }

      const found = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      
      if (found) {
        onLogin(found);
      } else {
        setError('Email hoặc mật khẩu không chính xác');
      }
    } else {
      if (!formData.email || !formData.password || !formData.name) {
        setError('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }
      const newUser: UserAccount = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        department: formData.department || 'Phòng Marketing',
        age: formData.age || '25',
        joinDate: new Date().toISOString().split('T')[0],
        role: UserRole.EMP,
        managerEmails: []
      };
      
      let users: UserAccount[] = [];
      try {
        const saved = localStorage.getItem('erp_all_users');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) users = parsed;
        }
      } catch (e) {
        console.error("Auth: Failed to load users for signup", e);
      }

      if (users.find((u: any) => u.email === formData.email)) {
        setError('Email đã được đăng ký');
        return;
      }
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem('erp_all_users', JSON.stringify(updatedUsers));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg mb-3">
              <BarChart3 className="text-white w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 text-center uppercase tracking-tighter leading-none">SÁCH KHÁNH HÒA</h1>
            <p className="text-gray-400 mt-2 text-center text-[10px] font-bold uppercase tracking-widest">Hệ thống báo cáo ERP nội bộ</p>
          </div>

          <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
            <button 
              onClick={() => handleToggleMode('login')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => handleToggleMode('signin')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Nhập họ tên..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900 font-bold"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900 font-bold"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-9 pr-10 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900 font-bold"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold bg-red-50 p-2 rounded-md border border-red-100 animate-pulse">{error}</p>}

            <button 
              type="submit" 
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95 mt-2 text-sm"
            >
              {isLogin ? 'Đăng nhập hệ thống' : 'Đăng ký nhân viên'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4 flex flex-col gap-2 items-center">
              <p className="text-[9px] text-gray-400 font-bold uppercase">Tài khoản demo:</p>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-[9px] font-bold text-blue-600 text-center">Admin: admin@skh.vn (123)</span>
                <span className="text-[9px] font-bold text-gray-500 text-center">NV: nv@skh.vn (123)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthView;
