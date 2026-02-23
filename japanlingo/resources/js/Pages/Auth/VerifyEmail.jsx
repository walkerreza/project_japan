import GuestAuthLayout from '@/Components/Layout/GuestAuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestAuthLayout>
            <Head title="Email Verification" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📧</div>
                    <h2 className="text-xl font-extrabold text-gray-900 mb-1">Verify Your Email</h2>
                    <p className="text-sm text-gray-500">
                        Thanks for signing up! Before getting started, please verify your email address by clicking the link we sent you.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-lg text-center">
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4">
                    <button type="submit" disabled={processing} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 text-sm">
                        Resend Verification Email (再送信)
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link href={route('logout')} method="post" as="button" className="text-sm text-gray-500 hover:text-red-600 transition-colors no-underline">
                        Log Out
                    </Link>
                </div>
            </div>
        </GuestAuthLayout>
    );
}
