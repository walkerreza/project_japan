import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/Navigation/ApplicationLogo';
import Button from '@/Components/UI/Button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// MUI Icons
import SettingsIcon from '@mui/icons-material/Settings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';

export default function QuizBuilder() {
    const [activeQuestion, setActiveQuestion] = useState(1);
    
    // Stub data for questions
    const [questions, setQuestions] = useState([
        { id: 1, type: 'Multiple Choice', text: 'Choose the correct reading for: 経済', pts: 10, difficulty: 'N3' },
        { id: 2, type: 'Fill-In', text: 'Sentence completion: ___に行く。', pts: 15, difficulty: 'N4' },
        { id: 3, type: 'Multiple Choice', text: "Antonym of '高い'", pts: 10, difficulty: 'N5' },
    ]);

    return (
        <AuthenticatedLayout>
            <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
            <Head title="Quiz Builder - Japanlingo" />

            {/* Top Navigation Bar (Builder Specific) */}
            <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/admin/modules" className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <div className="h-6 w-px bg-gray-200"></div>
                 
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">文A</div>
                        <div>
                            <h1 className="text-sm font-black text-gray-900 leading-none tracking-tight">JapanLingo Quiz Builder</h1>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Untitled JLPT N3 Set</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button className="px-4 h-9 rounded-lg text-sm font-bold text-red-600 bg-red-50 transition-colors flex items-center gap-2">
                         <FormatListBulletedIcon sx={{ fontSize: 16 }} /> Questions
                    </button>
                    <button className="px-4 h-9 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2">
                         <SettingsIcon sx={{ fontSize: 16 }} /> Settings
                    </button>
                    <button className="px-4 h-9 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2">
                         <AssessmentIcon sx={{ fontSize: 16 }} /> Analysis
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button className="px-4 h-9 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2">
                        <VisibilityIcon sx={{ fontSize: 18 }} /> Preview
                    </button>
                    <Button className="!bg-[#E64A19] hover:!bg-[#D84315] !text-white !rounded-xl !px-6 !h-9 shadow-md shadow-orange-500/20">
                        Publish Quiz
                    </Button>
                </div>
            </header>

            {/* Builder Workspace */}
            <main className="flex-1 flex overflow-hidden">
                
                {/* Left Panel: Question List */}
                <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Questions ({questions.length})</span>
                        <span className="text-xs font-bold text-red-600">Points: 35</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {questions.map((q, i) => (
                            <button 
                                key={q.id}
                                onClick={() => setActiveQuestion(q.id)}
                                className={`w-full text-left p-3 rounded-xl border transition-all ${
                                    activeQuestion === q.id 
                                    ? 'border-red-500 bg-red-50 shadow-sm ring-1 ring-red-500' 
                                    : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${activeQuestion === q.id ? 'text-red-700' : 'text-gray-400'}`}>
                                        Q{i + 1} • {q.type}
                                    </span>
                                </div>
                                <p className={`text-sm font-bold truncate ${activeQuestion === q.id ? 'text-red-900' : 'text-gray-700'}`}>
                                    {q.text}
                                </p>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white">
                        <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 transition-all">
                            <AddIcon sx={{ fontSize: 18 }} /> Add Question
                        </button>
                    </div>
                </aside>

                {/* Center Panel: Editor Canvas */}
                <section className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-3xl mx-auto space-y-6">
                        
                        {/* Editor Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-[#E64A19] overflow-hidden">
                            {/* Editor Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                    </div>
                                    <h2 className="font-black text-gray-900">Q1</h2>
                                    <select className="bg-transparent font-medium text-sm text-gray-600 focus:outline-none cursor-pointer">
                                        <option>Multiple Choice</option>
                                        <option>Fill in Blank</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</span>
                                        <span className="text-xs font-black text-[#E64A19] bg-orange-50 px-2 py-0.5 rounded">N3</span>
                                    </div>
                                    <button className="text-gray-300 hover:text-red-500 transition-colors">
                                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Question Text Input */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Question Text (Kanji Supported)</label>
                                    <div className="relative">
                                        <textarea 
                                            defaultValue="e.g. Choose the correct reading for: 経済"
                                            className="w-full min-h-[100px] bg-gray-50 border-transparent rounded-xl p-4 text-base font-medium text-gray-900 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all resize-none outline-none"
                                        />
                                        <div className="absolute right-4 bottom-4 flex gap-2">
                                            <button className="p-1.5 bg-white shadow-sm rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><ImageOutlinedIcon sx={{ fontSize: 18 }} /></button>
                                            <button className="p-1.5 bg-white shadow-sm rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><MicNoneOutlinedIcon sx={{ fontSize: 18 }} /></button>
                                        </div>
                                    </div>
                                </div>

                                {/* Answers Input */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 text-white rounded flex items-center justify-center text-xs font-bold z-10">A</div>
                                        <input type="text" defaultValue="けいざい" className="w-full h-14 bg-green-50/50 border border-green-500 rounded-xl pl-14 pr-12 text-sm font-bold text-green-900 focus:outline-none focus:ring-4 focus:ring-green-500/20" />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"><CheckCircleIcon sx={{ fontSize: 22 }} /></button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 text-gray-400 rounded flex items-center justify-center text-xs font-bold z-10 group-hover:bg-gray-200">B</div>
                                        <input type="text" defaultValue="けいさい" className="w-full h-14 bg-white border border-gray-200 rounded-xl pl-14 pr-12 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400" />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"><RadioButtonUncheckedIcon sx={{ fontSize: 22 }} /></button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 text-gray-400 rounded flex items-center justify-center text-xs font-bold z-10 group-hover:bg-gray-200">C</div>
                                        <input type="text" defaultValue="けさい" className="w-full h-14 bg-white border border-gray-200 rounded-xl pl-14 pr-12 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400" />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"><RadioButtonUncheckedIcon sx={{ fontSize: 22 }} /></button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 text-gray-400 rounded flex items-center justify-center text-xs font-bold z-10 group-hover:bg-gray-200">D</div>
                                        <input type="text" defaultValue="けいぜい" className="w-full h-14 bg-white border border-gray-200 rounded-xl pl-14 pr-12 text-sm font-medium text-gray-700 focus:outline-none focus:border-gray-400" />
                                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"><RadioButtonUncheckedIcon sx={{ fontSize: 22 }} /></button>
                                    </div>
                                </div>

                                {/* Explanation Input */}
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Explanation for Correct Answer
                                    </label>
                                    <textarea 
                                        defaultValue="e.g. 経済 (Keizai) means economy. The kanji 経 is read as けい and 済 as ざい."
                                        className="w-full min-h-[80px] bg-gray-50 border-transparent rounded-xl p-4 text-sm font-medium text-gray-500 focus:bg-white focus:border-red-100 focus:ring-4 focus:ring-red-500/10 transition-all resize-none outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    
                    {/* Add New Question Button Floating Bottom */}
                    <div className="fixed bottom-8 right-[340px]">
                         <button className="w-14 h-14 bg-[#E64A19] hover:bg-[#D84315] text-white rounded-full shadow-xl shadow-orange-500/30 flex items-center justify-center transition-transform hover:scale-105">
                            <AddIcon sx={{ fontSize: 28 }} />
                        </button>
                    </div>

                </section>

                {/* Right Panel: Preview & Summary */}
                <aside className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col shrink-0 p-6 space-y-6">
                    
                    {/* Phone Mockup Canvas (Student Preview) */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-200 h-[500px] overflow-hidden flex flex-col relative">
                        {/* Mockup Header */}
                        <div className="bg-[#E64A19] h-12 flex items-center px-4 justify-between shrink-0">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Student Preview</span>
                            <div className="w-2 h-2 rounded-full bg-white/50"></div>
                        </div>

                        {/* Mockup Content */}
                        <div className="flex-1 p-6 flex flex-col">
                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-gray-100 rounded-full mb-8">
                                <div className="h-1.5 bg-[#E64A19] rounded-full w-[25%]"></div>
                            </div>

                            <div className="text-center mb-8">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Question 1</p>
                                <h3 className="text-lg font-black text-gray-900 leading-tight">
                                    Choose the correct reading for: <span className="text-[#E64A19]">経済</span>
                                </h3>
                            </div>

                            <div className="space-y-3 mb-auto">
                                {['けいざい', 'けいさい', 'けさい', 'けいぜい'].map((opt, i) => (
                                    <div key={i} className="border border-gray-200 rounded-xl px-4 py-3 text-center text-sm font-bold text-gray-700">
                                        {opt}
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-3 bg-gray-100 rounded-xl text-gray-400 font-bold text-sm mt-6">
                                Next Question
                            </button>
                        </div>
                        
                        {/* Mockup Footer Stats */}
                         <div className="h-10 bg-gray-50 border-t border-gray-100 flex items-center justify-between px-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time: 00:30</span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Points: 10</span>
                        </div>
                    </div>

                    {/* Set Summary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                        <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Set Summary</h4>
                        <div className="flex justify-between gap-4">
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Est. Time</p>
                                <p className="text-lg font-black text-gray-900">12 min</p>
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Avg. Grade</p>
                                <p className="text-lg font-black text-[#E64A19]">N3</p>
                            </div>
                        </div>
                    </div>

                </aside>

            </main>
            </div>
        </AuthenticatedLayout>
    );
}
