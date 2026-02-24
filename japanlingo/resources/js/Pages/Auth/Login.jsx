import GuestAuthLayout from '@/Components/Layout/GuestAuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestAuthLayout>
            <Head title="Log in" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button className="flex-1 pb-3 text-sm font-bold text-red-600 border-b-2 border-red-600">
                        Login ログイン
                    </button>
                    <Link href={route('register')} className="flex-1 pb-3 text-sm font-medium text-gray-400 text-center no-underline hover:text-gray-600 transition-colors">
                        Register 登録
                    </Link>
                </div>

                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Welcome back!</h2>
                <p className="text-sm text-gray-500 mb-6">Ready to continue your N3 journey?</p>

                {status && <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-lg">{status}</div>}

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">✉</span>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@example.com"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                            />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            {canResetPassword && (
                                <Link href={route('password.request')} className="text-xs text-red-600 font-semibold no-underline hover:underline">
                                    Forgot password?
                                </Link>
                            )}
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                            />
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600/20" />
                        <span className="text-sm text-gray-600">Remember me</span>
                    </label>

                    <button type="submit" disabled={processing} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 text-sm">
                        Start Learning (始める)
                    </button>

                    <div className="relative flex items-center justify-center my-4">
                        <div className="border-t border-gray-200 w-full" />
                        <span className="absolute bg-white px-3 text-xs text-gray-400">Or continue with</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                            <img src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000" className="w-5 h-5" alt="" />
                            <span>Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                            <img src="https://img.icons8.com/color/480/facebook-new.png" className="w-5 h-5" alt="Facebook logo" /> Facebook
                        </button>
                    </div>
                </form>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
                Don't have an account yet? <Link href={route('register')} className="text-red-600 font-semibold no-underline hover:underline">Sign up for free</Link>
            </p>
        </GuestAuthLayout>
    );
}
