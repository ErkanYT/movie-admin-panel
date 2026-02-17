import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white selection:bg-red-500/30">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen ml-64 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
