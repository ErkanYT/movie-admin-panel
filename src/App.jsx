import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';

function App() {
    return (
        <Router>
            <div className="flex min-h-screen bg-background text-white selection:bg-primary/30">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto h-screen ml-64">
                    {/* ML-64 to offset fixed sidebar */}
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/content" element={<Content />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;
