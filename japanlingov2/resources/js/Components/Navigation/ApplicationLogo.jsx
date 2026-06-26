import { Link } from '@inertiajs/react';

export default function ApplicationLogo({ className = '' }) {
    return (
        <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-lg">J</div>
            <span className="text-xl font-extrabold text-gray-900">Japanlingo</span>
        </Link>
    );
}
