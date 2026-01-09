'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Save, X } from 'lucide-react';

export default function AdminPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', email: '', role: 'EMP', departmentId: '', managerId: '' });

    const fetchUsers = () => {
        fetch('/api/users').then(res => res.json()).then(data => setUsers(data.users || []));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: any) => {
        setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            departmentId: user.departmentId || '',
            managerId: user.managerId || ''
        });
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAdd = () => {
        setFormData({ id: '', name: '', email: '', role: 'EMP', departmentId: '', managerId: '' });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';

        const res = await fetch('/api/users', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert(isEditing ? 'Cập nhật thành công' : 'Đã tạo mới nhân sự');
            setShowModal(false);
            fetchUsers();
        } else {
            alert('Có lỗi xảy ra.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Cấu hình nhân sự</h1>
                <button onClick={handleAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">
                    <Plus size={18} /> Thêm mới
                </button>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-400">
                        <tr>
                            <th className="px-6 py-4 uppercase text-[10px] font-black w-1/4">Họ tên</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black w-1/4">Email</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black w-1/6">Vai trò</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black w-1/6">Quản lý trực tiếp</th>
                            <th className="px-6 py-4 uppercase text-[10px] font-black w-20 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{u.name}</td>
                                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${u.role === 'SYS' ? 'bg-red-100 text-red-700' :
                                            u.role === 'DM' ? 'bg-purple-100 text-purple-700' :
                                                u.role === 'TL' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-600'
                                        }`}>
                                        {u.role === 'SYS' ? 'Admin' :
                                            u.role === 'DM' ? 'Giám Đốc' :
                                                u.role === 'TL' ? 'Quản lý' : 'Nhân viên'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-medium">{u.manager?.name || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleEdit(u)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                                        <Edit size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-black text-gray-900">{isEditing ? 'Cập nhật nhân sự' : 'Thêm nhân sự mới'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ và tên</label>
                                <input
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold"
                                    placeholder="Nguyễn Văn A" required
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email đăng nhập</label>
                                <input
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                    type="email" required
                                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isEditing}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vai trò</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="EMP">Nhân viên</option>
                                        <option value="TL">Trưởng phòng</option>
                                        <option value="DM">Giám đốc</option>
                                        <option value="SYS">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quản lý trực tiếp</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                                        value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })}
                                    >
                                        <option value="">-- Không --</option>
                                        {users.filter(u => u.role === 'TL' || u.role === 'DM').map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-500 hover:bg-gray-100 rounded-xl font-bold text-sm transition-all">Hủy bỏ</button>
                                <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
                                    <Save size={16} /> Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
