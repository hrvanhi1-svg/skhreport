import React, { useState } from 'react';
import { X, User, Briefcase, Mail, Calendar, Key, Save, Trash2, Camera } from 'lucide-react';
import { UserAccount } from '../types';

interface ProfileModalProps {
  user: UserAccount;
  onClose: () => void;
  onUpdate: (updates: Partial<UserAccount>) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    age: user.age,
    department: user.department,
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu không khớp' });
      return;
    }

    const updates: Partial<UserAccount> = {
      name: formData.name,
      age: formData.age,
      department: formData.department
    };

    if (formData.newPassword) {
      updates.password = formData.newPassword;
    }

    onUpdate(updates);
    setMessage({ type: 'success', text: 'Đã cập nhật!' });
    setTimeout(() => onClose(), 800);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh]">
        <div className="bg-gradient-to-b from-blue-700 to-indigo-900 text-white p-6 md:w-1/3 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-3xl font-bold shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h2 className="text-lg font-bold mb-1 truncate w-full">{user.name}</h2>
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-6">{user.department}</p>
          
          <div className="w-full space-y-3 text-left border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <Mail size={12} className="text-blue-300" />
              <span className="text-[10px] font-bold truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={12} className="text-blue-300" />
              <span className="text-[10px] font-bold">Vào: {user.joinDate}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Hồ sơ cá nhân</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-lg transition-all">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Họ tên</label>
                <input type="text" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Tuổi</label>
                <input type="number" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phòng ban</label>
              <input type="text" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-4">
              <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Đổi mật khẩu</h4>
              <div className="grid grid-cols-2 gap-4">
                <input type="password" placeholder="Mới" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold placeholder:font-medium" value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} />
                <input type="password" placeholder="Nhập lại" className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold placeholder:font-medium" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
              </div>
            </div>

            {message.text && (
              <div className={`p-2 rounded-lg text-[10px] font-bold border ${message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                {message.text}
              </div>
            )}

            <div className="flex gap-2 pt-2">
               <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                <Save size={16} /> LƯU THÔNG TIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;