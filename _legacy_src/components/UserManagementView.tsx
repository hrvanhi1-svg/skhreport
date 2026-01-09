
import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import { Shield, User, Users, Search, Edit2, Check, X, ShieldAlert, Link } from 'lucide-react';

interface UserManagementViewProps {
  users: UserAccount[];
  onUpdateUser: (email: string, updates: Partial<UserAccount>) => void;
}

const UserManagementView: React.FC<UserManagementViewProps> = ({ users, onUpdateUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserAccount>>({});

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (user: UserAccount) => {
    setEditingEmail(user.email);
    setEditForm({ role: user.role, department: user.department, name: user.name, managerEmails: user.managerEmails });
  };

  const handleSaveEdit = (email: string) => {
    onUpdateUser(email, editForm);
    setEditingEmail(null);
  };

  const toggleManager = (managerEmail: string) => {
    const current = editForm.managerEmails || [];
    if (current.includes(managerEmail)) {
      setEditForm({ ...editForm, managerEmails: current.filter(e => e !== managerEmail) });
    } else {
      setEditForm({ ...editForm, managerEmails: [...current, managerEmail] });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
             <ShieldAlert className="text-red-600" /> Quản trị Hệ thống
           </h2>
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Cấu hình vai trò & Quan hệ quản lý trực tiếp</p>
        </div>
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
           <input 
              type="text" 
              placeholder="Tìm tài khoản..."
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64 font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <div key={user.email} className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:border-blue-200 transition-all group">
              {editingEmail === user.email ? (
                <div className="space-y-4">
                   <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Tên nhân sự</label>
                      <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold" />
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                      <div>
                         <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Phòng ban</label>
                         <input value={editForm.department} onChange={e => setEditForm({...editForm, department: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold" />
                      </div>
                      <div>
                         <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Vai trò</label>
                         <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value as UserRole})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold">
                            {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                         </select>
                      </div>
                   </div>
                   <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase block mb-1">Quản lý trực tiếp (Đa chọn)</label>
                      <div className="max-h-24 overflow-y-auto border border-gray-100 rounded-xl p-2 bg-gray-50 space-y-1">
                         {users.filter(u => u.role !== UserRole.EMP && u.email !== user.email).map(manager => (
                            <label key={manager.email} className="flex items-center gap-2 cursor-pointer">
                               <input type="checkbox" checked={editForm.managerEmails?.includes(manager.email)} onChange={() => toggleManager(manager.email)} className="rounded" />
                               <span className="text-[10px] font-bold text-gray-700">{manager.name} ({manager.role})</span>
                            </label>
                         ))}
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={() => handleSaveEdit(user.email)} className="flex-1 py-2 bg-green-600 text-white rounded-xl text-[10px] font-bold">LƯU</button>
                      <button onClick={() => setEditingEmail(null)} className="flex-1 py-2 bg-gray-100 text-gray-400 rounded-xl text-[10px] font-bold">HỦY</button>
                   </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-2 border-white shadow-sm ${user.role === UserRole.SYS ? 'bg-red-500 text-white' : 'bg-blue-50 text-blue-600'}`}>
                           {user.name.charAt(0)}
                        </div>
                        <div>
                           <h4 className="text-xs font-black text-gray-900">{user.name}</h4>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">{user.department}</p>
                        </div>
                     </div>
                     <button onClick={() => handleStartEdit(user)} className="p-2 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Edit2 size={14} />
                     </button>
                  </div>
                  
                  <div className="space-y-3 pt-3 border-t border-gray-50">
                     <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Vai trò hệ thống</span>
                        <span className="text-[10px] font-black text-blue-600">{user.role}</span>
                     </div>
                     <div>
                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Cấp trên quản lý</span>
                        <div className="flex flex-wrap gap-1">
                           {user.managerEmails.length > 0 ? user.managerEmails.map(mEmail => {
                             const m = users.find(u => u.email === mEmail);
                             return <span key={mEmail} className="text-[9px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg border border-gray-200">{m?.name || mEmail}</span>;
                           }) : <span className="text-[9px] text-gray-300 italic">Không có quản lý</span>}
                        </div>
                     </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagementView;
