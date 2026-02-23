import { Link } from '@inertiajs/react';

export default function GuestAuthLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-b from-red-700 via-red-800 to-red-950 relative overflow-hidden flex-col justify-between p-12">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 text-[200px] font-black text-white/5 -rotate-12">文</div>
                    <div className="absolute bottom-20 right-10 text-[150px] font-black text-white/5 rotate-12">語</div>
                </div>

                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 no-underline mb-16">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white font-black text-xl border border-white/10">文</div>
                        <span className="text-xl font-extrabold text-white">Japanlingo</span>
                    </Link>
                </div>

                <div className="relative z-10 flex-1 flex items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white/90 px-4 py-2 rounded-full text-xs font-semibold mb-6 border border-white/10">
                            🎌 JLPT N3 STRUCTURED
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
                            <div className="w-full h-48 bg-gradient-to-br from-pink-200/20 to-red-200/10 rounded-xl flex items-center justify-center overflow-hidden">
                                <div className="text-center">
                                    <div className="text-6xl mb-2">🗻</div>
                                    <div className="text-3xl">🌸🌸🌸</div>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                            Master Japanese<br />One Level at a Time.
                        </h1>
                        <p className="text-base text-white/60 leading-relaxed max-w-md">
                            Join 20,000+ learners on Japanlingo. Gamified lessons designed to help you pass your N3 exam with confidence.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {['🧑', '👩', '👨'].map((e, i) => (
                            <span key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-red-800 flex items-center justify-center text-xs">{e}</span>
                        ))}
                    </div>
                    <div className="text-white/70 text-sm">
                        <span className="text-amber-400">★</span> <strong className="text-white">4.9/5</strong> Rating from our community
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col">
                <div className="lg:hidden p-6">
                    <Link href="/" className="flex items-center gap-2 no-underline">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-lg">文</div>
                        <span className="text-xl font-extrabold text-gray-900">Japanlingo</span>
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 py-8 lg:px-16">
                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>

                <div className="px-6 py-4 text-center text-xs text-gray-400 flex gap-4 justify-center">
                    <a href="#" className="hover:text-red-600 transition-colors no-underline">Privacy Policy</a>
                    <a href="#" className="hover:text-red-600 transition-colors no-underline">Terms of Service</a>
                </div>
            </div>
        </div>
    );
}
