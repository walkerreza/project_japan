import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { redrawBoard } from '@/Components/Features/Board/BoardCanvas';

const canvasSize = {
    width: 1280,
    height: 720,
};

const colorOptions = ['#111827', '#E64A19', '#2563EB', '#16A34A', '#F59E0B', '#DC2626'];

export default function EditorBoard({ board }) {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const currentStrokeRef = useRef(null);
    const [strokes, setStrokes] = useState(board.board_data?.strokes || []);
    const [tool, setTool] = useState('pen');
    const [color, setColor] = useState('#111827');
    const [size, setSize] = useState(5);
    const [status, setStatus] = useState(board.status || 'draft');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        redrawBoard(canvasRef.current, strokes);
    }, [strokes]);

    const getPoint = (event) => {
        const rect = canvasRef.current.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * (canvasSize.width / rect.width),
            y: (event.clientY - rect.top) * (canvasSize.height / rect.height),
        };
    };

    const redrawWithCurrentStroke = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        redrawBoard(canvas, strokes);
        if (currentStrokeRef.current) {
            redrawBoard(canvas, [...strokes, currentStrokeRef.current]);
        }
    };

    const startDrawing = (event) => {
        if (!canvasRef.current) return;

        event.preventDefault();
        canvasRef.current.setPointerCapture?.(event.pointerId);
        isDrawingRef.current = true;
        currentStrokeRef.current = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            tool,
            color,
            size: Number(size),
            points: [getPoint(event)],
        };
    };

    const draw = (event) => {
        if (!isDrawingRef.current || !currentStrokeRef.current) return;

        event.preventDefault();
        currentStrokeRef.current = {
            ...currentStrokeRef.current,
            points: [...currentStrokeRef.current.points, getPoint(event)],
        };
        redrawWithCurrentStroke();
    };

    const stopDrawing = (event) => {
        if (!isDrawingRef.current || !currentStrokeRef.current) return;

        event.preventDefault();
        const nextStroke = currentStrokeRef.current;
        isDrawingRef.current = false;
        currentStrokeRef.current = null;

        if ((nextStroke.points || []).length > 1) {
            setStrokes((items) => [...items, nextStroke]);
        }
    };

    const undoStroke = () => {
        setStrokes((items) => items.slice(0, -1));
    };

    const clearBoard = () => {
        if (!window.confirm('Bersihkan semua coretan pada board ini?')) return;
        setStrokes([]);
    };

    const saveBoard = () => {
        const canvas = canvasRef.current;
        setIsSaving(true);

        router.post(
            route('admin.boards.editor.save', board.id),
            {
                status,
                board_data: { strokes },
                snapshot_data: canvas ? canvas.toDataURL('image/png') : null,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSaving(false),
            },
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Editor Board - ${board.title}`} />

            <div className="min-h-screen bg-[#F7F2EA] px-4 py-6 dark:bg-gray-950 sm:px-6 lg:px-8">
                <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <Link href={route('admin.boards.index')} className="text-xs font-black uppercase tracking-[0.25em] text-orange-600 no-underline">
                            Kembali ke Board Ajar
                        </Link>
                        <h1 className="mt-2 text-2xl font-black text-gray-950 dark:text-white">{board.title}</h1>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                            Editor papan ajar untuk membuat catatan visual, coretan kanji, atau penjelasan singkat yang muncul di lesson user.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="h-11 rounded-xl border border-orange-100 bg-white px-4 text-sm font-bold text-gray-800 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                        <button
                            onClick={saveBoard}
                            disabled={isSaving}
                            className="h-11 rounded-xl bg-[#E64A19] px-5 text-sm font-black text-white shadow-lg shadow-orange-500/20 disabled:opacity-60"
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Board'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[230px_1fr]">
                    <aside className="rounded-3xl border border-orange-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                        <p className="text-xs font-black uppercase tracking-[0.22em] text-gray-400">Alat Gambar</p>
                        <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1">
                            <button
                                onClick={() => setTool('pen')}
                                className={`rounded-2xl px-4 py-3 text-sm font-black ${tool === 'pen' ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
                            >
                                Pena
                            </button>
                            <button
                                onClick={() => setTool('eraser')}
                                className={`rounded-2xl px-4 py-3 text-sm font-black ${tool === 'eraser' ? 'bg-gray-950 text-white dark:bg-white dark:text-gray-950' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
                            >
                                Penghapus
                            </button>
                        </div>

                        <div className="mt-5">
                            <p className="mb-2 text-xs font-black uppercase tracking-widest text-gray-400">Warna</p>
                            <div className="grid grid-cols-6 gap-2 xl:grid-cols-3">
                                {colorOptions.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setColor(item)}
                                        className={`h-9 rounded-xl border-2 ${color === item ? 'border-gray-950 dark:border-white' : 'border-transparent'}`}
                                        style={{ backgroundColor: item }}
                                        aria-label={`Pilih warna ${item}`}
                                    />
                                ))}
                            </div>
                            <input
                                type="color"
                                value={color}
                                onChange={(event) => setColor(event.target.value)}
                                className="mt-3 h-11 w-full rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-950"
                            />
                        </div>

                        <div className="mt-5">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Ukuran</p>
                                <span className="text-xs font-black text-gray-500">{size}px</span>
                            </div>
                            <input
                                type="range"
                                min="2"
                                max="30"
                                value={size}
                                onChange={(event) => setSize(event.target.value)}
                                className="w-full accent-orange-600"
                            />
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-1">
                            <button onClick={undoStroke} className="rounded-2xl border border-gray-200 px-4 py-3 text-sm font-black text-gray-600 dark:border-gray-700 dark:text-gray-300">
                                Undo
                            </button>
                            <button onClick={clearBoard} className="rounded-2xl border border-red-100 px-4 py-3 text-sm font-black text-red-600 dark:border-red-900/40">
                                Bersihkan
                            </button>
                        </div>
                    </aside>

                    <section className="rounded-[2rem] border border-orange-100 bg-white p-3 shadow-xl shadow-orange-900/5 dark:border-gray-800 dark:bg-gray-900 sm:p-5">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
                            <div>
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Canvas 16:9</p>
                                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Gunakan mouse, stylus, atau touch untuk menggambar.</p>
                            </div>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-500 dark:bg-gray-800 dark:text-gray-300">
                                {strokes.length} stroke
                            </span>
                        </div>
                        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white dark:border-gray-800">
                            <canvas
                                ref={canvasRef}
                                width={canvasSize.width}
                                height={canvasSize.height}
                                onPointerDown={startDrawing}
                                onPointerMove={draw}
                                onPointerUp={stopDrawing}
                                onPointerCancel={stopDrawing}
                                className="aspect-video w-full touch-none bg-white"
                            />
                        </div>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
