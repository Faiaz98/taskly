import { useTaskStore } from './store/taskStore';
import { CategorySection } from './components/CategorySection';
import { CheckSquare, Wifi, WifiOff } from 'lucide-react';

function App() {
  const categories = useTaskStore((state) => state.categories);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CheckSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
              Taskly
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-[15px] leading-relaxed font-medium">
            Collaborate with your family in real-time. Track tasks, share progress, and stay organized together.
          </p>
          
          {/* Status badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 font-medium shadow-sm">
            <div className="relative flex items-center">
              <WifiOff className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <span className="text-xs">Local mode • Real-time sync coming soon</span>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 mb-12">
          {categories.map((category, index) => (
            <div 
              key={category.id}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategorySection category={category} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-400 font-medium">
            <span>Powered by</span>
            <span className="text-gray-600 font-semibold">AirState</span>
            <span>•</span>
            <span>Built with React & TypeScript</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
