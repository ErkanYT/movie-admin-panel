import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Film, Users, Tv, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-panel p-6 flex items-center justify-between">
        <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-white`}>
            <Icon size={24} />
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ movies: 0, categories: 6, trending: 0 }); // Mock categories for now

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/movies');
            setStats({
                movies: data.length,
                categories: 6, // Hardcoded for now based on sql script
                trending: data.filter(m => m.is_trending).length
            });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Movies"
                    value={stats.movies}
                    icon={Film}
                    color="bg-primary"
                />
                <StatCard
                    title="Trending Now"
                    value={stats.trending}
                    icon={TrendingUp}
                    color="bg-accent"
                />
                <StatCard
                    title="Categories"
                    value={stats.categories}
                    icon={Tv}
                    color="bg-secondary"
                />
                <StatCard
                    title="Total Admins"
                    value="1"
                    icon={Users}
                    color="bg-green-500"
                />
            </div>

            {/* Recent Activity or Charts could go here */}
            <div className="mt-8 glass-panel p-8">
                <h3 className="text-xl font-semibold mb-4">System Status</h3>
                <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span>API Online</span>
                </div>
                <div className="flex items-center gap-2 text-green-400 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Database Connected</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
