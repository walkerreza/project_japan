import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import Button from '@/Components/UI/Button';
import Badge from '@/Components/UI/Badge';

// MUI Icons based on dependencies
import FlashOnIcon from '@mui/icons-material/FlashOn';
import BarChartIcon from '@mui/icons-material/BarChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

export default function Gamification() {
    // Basic Form State
    const [xpConfig, setXpConfig] = useState({
        baseXp: 10,
        perfectBonus: 50,
        streakMultiplier: 2.5,
        dailyCap: 2000
    });

    const [streakRules, setStreakRules] = useState({
        freezeEnabled: true,
        lossGracePeriod: 48,
        recoveryCost: 500
    });

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gamification Control Center</h2>}>
            <Head title="Admin - Gamification Settings" />
            
            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Details */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Gamification Control Center</h2>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Manage the core mechanics of learner engagement and progression systems.</p>
                    </div>

                    {/* Section 1: XP & Points */}
                    <Card className="!p-8 !rounded-2xl border-transparent shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                                <FlashOnIcon className="text-red-600" /> XP & Points Configuration
                            </h3>
                            <Button className="!bg-red-600 !text-white !rounded-xl !px-6 shadow-md shadow-red-500/20">Save Changes</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Base XP per Correct Answer</label>
                                    <input 
                                        type="number" 
                                        value={xpConfig.baseXp}
                                        onChange={(e) => setXpConfig({...xpConfig, baseXp: e.target.value})}
                                        className="w-full h-11 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Perfect Lesson Bonus</label>
                                    <input 
                                        type="number" 
                                        value={xpConfig.perfectBonus}
                                        onChange={(e) => setXpConfig({...xpConfig, perfectBonus: e.target.value})}
                                        className="w-full h-11 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2 flex justify-between">
                                        <span>Streak Multiplier (Max)</span>
                                        <span className="text-red-600">{xpConfig.streakMultiplier}x</span>
                                    </label>
                                    <div className="h-11 flex items-center">
                                        <input 
                                            type="range" 
                                            min="1" max="5" step="0.5" 
                                            value={xpConfig.streakMultiplier}
                                            onChange={(e) => setXpConfig({...xpConfig, streakMultiplier: e.target.value})}
                                            className="w-full accent-red-600"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Daily XP Cap</label>
                                    <input 
                                        type="number" 
                                        value={xpConfig.dailyCap}
                                        onChange={(e) => setXpConfig({...xpConfig, dailyCap: e.target.value})}
                                        className="w-full h-11 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Section 2: Level Thresholds */}
                    <Card className="!p-8 !rounded-2xl border-transparent shadow-sm">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6 text-lg">
                            <BarChartIcon className="text-red-600" /> Level Thresholds
                        </h3>

                        <div className="space-y-4">
                            {/* Level Card 1 */}
                            <div className="border border-gray-100 rounded-2xl p-4 bg-white relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"></div>
                                <div className="flex flex-col gap-4 pl-4 sm:flex-row sm:items-center sm:gap-6 w-full">
                                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-500/30 shrink-0">10</div>
                                    <div className="grid grid-cols-1 gap-4 flex-1 items-start sm:grid-cols-3 sm:items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Rank Title</p>
                                            <p className="font-bold text-gray-900">Shogun Master</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total XP Needed</p>
                                            <p className="font-bold text-gray-900">50,000 XP</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Unlocks</p>
                                            <p className="text-sm font-medium text-gray-600">Custom Avatar Frame, Gold Title</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-600 transition-colors shrink-0">
                                        <EditIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </div>
                            </div>

                            {/* Level Card 2 */}
                             <div className="border border-gray-100 rounded-2xl p-4 bg-white relative overflow-hidden group">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
                                <div className="flex flex-col gap-4 pl-4 sm:flex-row sm:items-center sm:gap-6 w-full">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-black text-xl shrink-0">09</div>
                                    <div className="grid grid-cols-1 gap-4 flex-1 items-start sm:grid-cols-3 sm:items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Rank Title</p>
                                            <p className="font-bold text-gray-900">Daimyo Elite</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total XP Needed</p>
                                            <p className="font-bold text-gray-900">35,000 XP</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Unlocks</p>
                                            <p className="text-sm font-medium text-gray-600">Silver Avatar Frame</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-600 transition-colors shrink-0">
                                        <EditIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </div>
                            </div>

                            <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-gray-400 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all hover:text-gray-600 mt-2">
                                <AddIcon sx={{ fontSize: 20 }} /> Add Level Tier
                            </button>
                        </div>
                    </Card>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Section 3: Badge Rules */}
                        <Card className="!p-8 !rounded-2xl border-transparent shadow-sm">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6 text-lg">
                                <EmojiEventsIcon className="text-red-600" /> Badge Rules
                            </h3>
                            <div className="space-y-6">
                                <div className="flex flex-col items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 sm:flex-row sm:items-center">
                                    <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm shrink-0">
                                        <ImageOutlinedIcon />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900 mb-1">Icon Upload</p>
                                        <Button variant="outline" className="!py-1.5 !px-3 !text-xs !rounded-lg bg-white">Choose File</Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Badge Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Kanji Master"
                                        className="w-full h-11 bg-gray-50 border-transparent rounded-xl px-4 text-sm focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Unlocking Logic</label>
                                    <select className="w-full h-11 bg-gray-50 border-transparent rounded-xl px-4 text-sm focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-700">
                                        <option>Lessons Completed</option>
                                        <option>Perfect Quizzes</option>
                                        <option>Longest Streak</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        {/* Section 4: Streak Rules */}
                        <Card className="!p-8 !rounded-2xl border-transparent shadow-sm">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6 text-lg">
                                <LocalFireDepartmentIcon className="text-red-600" /> Streak Rules
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                                    <div>
                                        <p className="font-bold text-gray-900">Streak Freeze</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Allow users to skip 1 day without loss.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={streakRules.freezeEnabled} onChange={() => setStreakRules({...streakRules, freezeEnabled: !streakRules.freezeEnabled})} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Loss Grace Period (Hours)</label>
                                    <input 
                                        type="number" 
                                        value={streakRules.lossGracePeriod}
                                        onChange={(e) => setStreakRules({...streakRules, lossGracePeriod: e.target.value})}
                                        className="w-full h-11 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-2">Recovery Cost (Gems)</label>
                                    <input 
                                        type="number" 
                                        value={streakRules.recoveryCost}
                                        onChange={(e) => setStreakRules({...streakRules, recoveryCost: e.target.value})}
                                        className="w-full h-11 bg-gray-50 border-transparent rounded-xl px-4 text-sm font-bold text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Section 5: Danger Zone */}
                    <div className="pt-4">
                        <Card className="!p-8 !rounded-2xl border border-red-100 bg-red-50/30 shadow-none">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                                <div>
                                    <h3 className="font-bold text-red-700 flex items-center gap-2 text-lg">
                                        Danger Zone
                                    </h3>
                                    <p className="text-sm text-red-600/80 mt-2 max-w-xl">
                                        Permanently reset gamification progress for all users. This includes levels, streaks, and badges. This action cannot be undone.
                                    </p>
                                </div>
                                <Button className="!bg-red-700 hover:!bg-red-800 !text-white !rounded-xl !px-6 shadow-md shadow-red-700/20 flex items-center gap-2 whitespace-nowrap shrink-0">
                                    <ErrorOutlineIcon sx={{ fontSize: 18 }} /> Reset All Progress
                                </Button>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
