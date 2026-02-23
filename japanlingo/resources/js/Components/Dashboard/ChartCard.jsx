export default function ChartCard({ title, subtitle, children, action, className = '' }) {
    return (
        <div className={`bg-white border border-gray-200 rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>
            <div>{children}</div>
        </div>
    );
}
