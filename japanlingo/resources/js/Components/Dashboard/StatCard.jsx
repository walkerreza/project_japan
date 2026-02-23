export default function StatCard({ icon, title, value, change, changeType = 'up', className = '' }) {
    return (
        <div className={`bg-white border border-gray-200 rounded-2xl p-5 ${className}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl">{icon}</div>
                {change && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {changeType === 'up' ? '↑' : '↓'} {change}
                    </span>
                )}
            </div>
            <div className="text-2xl font-extrabold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{title}</div>
        </div>
    );
}
