import Button from '@/Components/UI/Button';
import ApplicationLogo from '@/Components/Navigation/ApplicationLogo';

export default function GuestNavbar() {
    return (
        <nav className="flex items-center justify-between px-6 lg:px-20 py-4 bg-white border-b border-gray-200 sticky top-0 z-50">
            <ApplicationLogo />
            <ul className="hidden md:flex gap-8 list-none">
                <li><a href="/" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors no-underline">Home</a></li>
                <li><a href="pricing" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors no-underline">Pricing</a></li>
                <li><a href="/about" className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors no-underline">About</a></li>
            </ul>
            <div className="flex items-center gap-3">
                <Button variant="ghost" href="/login" className="hidden sm:inline-flex">Login</Button>
                <Button href="/register">Sign Up Free</Button>
            </div>
        </nav>
    );
}
