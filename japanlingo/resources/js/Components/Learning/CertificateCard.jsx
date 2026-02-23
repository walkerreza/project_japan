import LevelBadge from './LevelBadge';

export default function CertificateCard({ title, level, date, status = 'locked', onDownload, className = '' }) {
    const statuses = {
        locked: { bg: 'opacity-50', label: '🔒 Locked', action: false },
        available: { bg: 'border-amber-300 bg-amber-50', label: '📋 Take Exam', action: true },
        earned: { bg: 'border-green-300 bg-green-50', label: '✅ Earned', action: true },
    };
    const s = statuses[status];

    return (
        <div className={`bg-white border border-gray-200 rounded-2xl p-6 text-center transition-all ${s.bg} ${className}`}>
            <div className="text-4xl mb-3">{status === 'earned' ? '🏅' : '📜'}</div>
            <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
            <LevelBadge level={level} className="mb-3" />
            {date && <p className="text-xs text-gray-400 mb-3">{date}</p>}
            <div className="text-sm font-semibold text-gray-600">{s.label}</div>
            {status === 'earned' && onDownload && (
                <button onClick={onDownload} className="mt-3 text-xs text-red-600 font-semibold hover:underline">
                    Download PDF
                </button>
            )}
        </div>
    );
}
