import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Film, label: 'Movies', path: '/movies' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/5 flex flex-col">
            {/* Logo */}
            <div className="p-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    NOVA
                    <span className="text-white font-light ml-2">Stream</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase">Admin Portal</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                    <LogOut size={20} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
