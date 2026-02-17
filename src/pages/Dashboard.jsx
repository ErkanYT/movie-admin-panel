import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Film, Users, Tv, TrendingUp, MonitorPlay } from 'lucide-react';

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
    const [stats, setStats] = useState({
        total: 0,
        movies: 0,
        series: 0,
        trending: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get('/api/content');
            setStats({
                total: data.length,
                movies: data.filter(i => i.type === 'movie' || !i.type).length,
                series: data.filter(i => i.type === 'series').length,
                trending: data.filter(i => i.is_trending).length
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
                    title="Total Series"
                    value={stats.series}
                    icon={Tv}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Trending Content"
                    value={stats.trending}
                    icon={TrendingUp}
                    color="bg-accent"
                />
                <StatCard
                    title="Total Users"
                    value="12K"
                    icon={Users}
                    color="bg-green-500"
                />
            </div>

            {/* Quick Actions or Status */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8">
                    <h3 className="text-xl font-semibold mb-4">System Status</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-green-400">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span>API Online (v2.0 Series Support)</span>
                        </div>
                        <div className="flex items-center gap-3 text-green-400">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span>Database Connected</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-8 bg-gradient-to-br from-primary/10 to-transparent">
                    <h3 className="text-xl font-semibold mb-2">Did you know?</h3>
                    <p className="text-gray-400">
                        You can now manage TV Series, add multiple seasons, and organize episodes directly from the 'Content' tab.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
