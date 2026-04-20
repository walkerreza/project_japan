import GuestAuthLayout from '@/Components/Layout/GuestAuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms_accepted: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestAuthLayout>
            <Head title="Register" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <Link href={route('login')} className="flex-1 pb-3 text-sm font-medium text-gray-400 text-center no-underline hover:text-gray-600 transition-colors">
                        Login ログイン
                    </Link>
                    <button className="flex-1 pb-3 text-sm font-bold text-red-600 border-b-2 border-red-600">
                        Register 登録
                    </button>
                </div>

                <h2 className="text-xl font-extrabold text-gray-900 mb-1">Create your account</h2>
                <p className="text-sm text-gray-500 mb-6">Start your Japanese learning journey today!</p>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                            <input
                                type="text"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="Your name"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                            />
                        </div>
                        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                    </div>

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
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                            />
                        </div>
                        {errors.password_confirmation && <p className="mt-1 text-xs text-red-600">{errors.password_confirmation}</p>}
                    </div>

                    <div>
                        <label className="flex items-start gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.terms_accepted}
                                onChange={(e) => setData('terms_accepted', e.target.checked)}
                                className="mt-1 w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                                required
                            />
                            <span className="text-sm text-gray-500">
                                I agree to the <Link href="#" className="font-medium text-red-600 hover:underline">Terms & Conditions</Link> and <Link href="#" className="font-medium text-red-600 hover:underline">Privacy Policy</Link>.
                            </span>
                        </label>
                        {errors.terms_accepted && <p className="mt-1 text-xs text-red-600">{errors.terms_accepted}</p>}
                    </div>

                    <button type="submit" disabled={processing || !data.terms_accepted} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 text-sm">
                        Create Account (登録する)
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
                Already have an account? <Link href={route('login')} className="text-red-600 font-semibold no-underline hover:underline">Log in</Link>
            </p>
        </GuestAuthLayout>
    );
}
