'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, Bell, Search } from 'lucide-react';

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center">
                {/* Mobile menu trigger could go here */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhanh..."
                        className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none w-64 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-6 w-px bg-gray-200 mx-1"></div>

                <button
                    onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                    className="flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-xl transition-all"
                >
                    <LogOut size={16} />
                    Đăng xuất
                </button>
            </div>
        </header>
    );
}
