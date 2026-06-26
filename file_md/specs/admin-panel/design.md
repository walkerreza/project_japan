# Design Document - Panel Admin

## 1. Arsitektur Sistem

### 1.1 Stack Teknologi
- Backend: Laravel 12
- Frontend: React 18 + Inertia.js
- Database: SQLite (development)
- Styling: Tailwind CSS
- Rich Text Editor: TinyMCE atau Tiptap
- File Upload: Laravel Storage (local disk)

### 1.2 Pola Arsitektur
- MVC Pattern dengan Inertia.js untuk SPA experience
- Repository Pattern untuk data access (optional, bisa langsung Eloquent)
- Form Request untuk validasi
- Resource Classes untuk API responses
- Middleware untuk authorization

## 2. Database Design

### 2.1 Tabel yang Sudah Ada

#### levels
- id: bigint (PK)
- level_name: varchar(10) - N5, N4, N3, N2, N1
- stage: integer
- timestamps

#### modules
- id: bigint (PK)
- level_id: bigint (FK -> levels)
- title: varchar(255)
- week_number: integer
- timestamps

#### lessons
- id: bigint (PK)
- module_id: bigint (FK -> modules)
- title: varchar(255)
- content: text (nullable)
- timestamps

#### quizzes
- id: bigint (PK)
- lesson_id: bigint (FK -> lessons)
- type: varchar(50) - multiple_choice, typing, listening
- timestamps

#### questions
- id: bigint (PK)
- quiz_id: bigint (FK -> quizzes)
- question_text: text
- correct_answer: text
- explanation: text (nullable)
- timestamps

#### users
- id: bigint (PK)
- name: varchar(255)
- email: varchar(255)
- password: varchar(255)
- role: enum('student', 'Admin', 'superadmin')
- timestamps

#### progress
- id: bigint (PK)
- user_id: bigint (FK -> users)
- lesson_id: bigint (FK -> lessons)
- completed: boolean
- timestamps

#### attempts
- id: bigint (PK)
- user_id: bigint (FK -> users)
- quiz_id: bigint (FK -> quizzes)
- score: integer
- timestamps

### 2.2 Migrasi Database yang Diperlukan

#### Migration: add_missing_fields_to_existing_tables
```php
// modules table - tambah description
$table->text('description')->nullable()->after('week_number');

// lessons table - tambah order
$table->integer('order')->default(0)->after('content');

// quizzes table - tambah time_limit
$table->integer('time_limit')->nullable()->after('type');

// questions table - tambah options, audio_url, order
$table->json('options')->nullable()->after('question_text');
$table->string('audio_url')->nullable()->after('explanation');
$table->integer('order')->default(0)->after('audio_url');
```

#### Migration: create_kanji_cards_table (untuk Requirement Kanji - future)
```php
Schema::create('kanji_cards', function (Blueprint $table) {
    $table->id();
    $table->string('kanji', 10);
    $table->string('hiragana', 50);
    $table->string('romaji', 50);
    $table->string('meaning_id', 255);
    $table->string('meaning_en', 255);
    $table->text('example')->nullable();
    $table->text('mnemonic')->nullable();
    $table->integer('srs_level')->default(1);
    $table->timestamps();
});
```

#### Migration: create_lesson_kanji_table (untuk Requirement Kanji - future)
```php
Schema::create('lesson_kanji', function (Blueprint $table) {
    $table->id();
    $table->foreignId('lesson_id')->constrained()->onDelete('cascade');
    $table->foreignId('kanji_card_id')->constrained()->onDelete('cascade');
    $table->timestamps();
});
```

## 3. Backend Design

### 3.1 Routes (routes/web.php)

```php
// Admin Panel Routes - Protected by RoleMiddleware
Route::middleware(['auth', 'role:admin,superadmin'])->prefix('admin')->name('admin.')->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Levels
    Route::get('/levels', [AdminLevelController::class, 'index'])->name('levels.index');
    Route::get('/levels/{level}', [AdminLevelController::class, 'show'])->name('levels.show');
    Route::put('/levels/{level}', [AdminLevelController::class, 'update'])->name('levels.update');
    
    // Modules
    Route::resource('modules', AdminModuleController::class);
    
    // Lessons
    Route::resource('lessons', AdminLessonController::class);
    Route::post('/lessons/{lesson}/reorder', [AdminLessonController::class, 'reorder'])->name('lessons.reorder');
    Route::get('/lessons/{lesson}/preview', [AdminLessonController::class, 'preview'])->name('lessons.preview');
    
    // Quizzes
    Route::resource('quizzes', AdminQuizController::class);
    Route::get('/quizzes/{quiz}/preview', [AdminQuizController::class, 'preview'])->name('quizzes.preview');
    
    // Questions
    Route::resource('questions', AdminQuestionController::class);
    Route::post('/questions/bulk-import', [AdminQuestionController::class, 'bulkImport'])->name('questions.bulk-import');
    Route::post('/questions/{question}/reorder', [AdminQuestionController::class, 'reorder'])->name('questions.reorder');
});
```

### 3.2 Controllers

#### AdminDashboardController
```php
class AdminDashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_modules' => Module::count(),
            'total_lessons' => Lesson::count(),
            'total_quizzes' => Quiz::count(),
            'total_questions' => Question::count(),
        ];
        
        $recentActivities = $this->getRecentActivities();
        
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
        ]);
    }
    
    private function getRecentActivities()
    {
        // Gabungkan created_at dan updated_at dari modules, lessons, quizzes
        // Return 10 aktivitas terbaru
    }
}
```

#### AdminModuleController
```php
class AdminModuleController extends Controller
{
    public function index(Request $request)
    {
        $query = Module::with('level');
        
        if ($request->has('level_id')) {
            $query->where('level_id', $request->level_id);
        }
        
        $modules = $query->paginate(20);
        $levels = Level::all();
        
        return Inertia::render('Admin/Modules/Index', [
            'modules' => $modules,
            'levels' => $levels,
        ]);
    }
    
    public function create()
    {
        $levels = Level::all();
        return Inertia::render('Admin/Modules/Create', ['levels' => $levels]);
    }
    
    public function store(StoreModuleRequest $request)
    {
        $module = Module::create($request->validated());
        
        return redirect()->route('admin.modules.index')
            ->with('success', 'Module berhasil dibuat');
    }
    
    public function show(Module $module)
    {
        $module->load(['level', 'lessons']);
        return Inertia::render('Admin/Modules/Show', ['module' => $module]);
    }
    
    public function edit(Module $module)
    {
        $levels = Level::all();
        return Inertia::render('Admin/Modules/Edit', [
            'module' => $module,
            'levels' => $levels,
        ]);
    }
    
    public function update(UpdateModuleRequest $request, Module $module)
    {
        $module->update($request->validated());
        
        return redirect()->route('admin.modules.index')
            ->with('success', 'Module berhasil diupdate');
    }
    
    public function destroy(Module $module)
    {
        if ($module->lessons()->count() > 0) {
            return back()->with('error', 
                "Module tidak dapat dihapus karena masih memiliki {$module->lessons()->count()} lesson");
        }
        
        $module->delete();
        
        return redirect()->route('admin.modules.index')
            ->with('success', 'Module berhasil dihapus');
    }
}
```

#### AdminLessonController
```php
class AdminLessonController extends Controller
{
    public function index(Request $request)
    {
        $query = Lesson::with('module');
        
        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }
        
        $lessons = $query->orderBy('order')->paginate(20);
        $modules = Module::all();
        
        return Inertia::render('Admin/Lessons/Index', [
            'lessons' => $lessons,
            'modules' => $modules,
        ]);
    }
    
    public function store(StoreLessonRequest $request)
    {
        $lesson = Lesson::create($request->validated());
        
        return redirect()->route('admin.lessons.index')
            ->with('success', 'Lesson berhasil dibuat');
    }
    
    public function destroy(Lesson $lesson)
    {
        if ($lesson->quiz) {
            return back()->with('error', 'Lesson tidak dapat dihapus karena masih memiliki quiz');
        }
        
        if ($lesson->progress()->count() > 0) {
            return back()->with('error', 
                'Lesson tidak dapat dihapus karena sudah ada student yang menyelesaikannya');
        }
        
        $lesson->delete();
        
        return redirect()->route('admin.lessons.index')
            ->with('success', 'Lesson berhasil dihapus');
    }
    
    public function reorder(Request $request, Lesson $lesson)
    {
        $request->validate(['order' => 'required|integer']);
        
        // Update order untuk lesson yang terpengaruh
        $lesson->update(['order' => $request->order]);
        
        return back()->with('success', 'Urutan lesson berhasil diupdate');
    }
    
    public function preview(Lesson $lesson)
    {
        $lesson->load('module');
        return Inertia::render('Admin/Lessons/Preview', ['lesson' => $lesson]);
    }
}
```

#### AdminQuizController
```php
class AdminQuizController extends Controller
{
    public function index(Request $request)
    {
        $query = Quiz::with('lesson');
        
        if ($request->has('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }
        
        $quizzes = $query->paginate(20);
        $lessons = Lesson::all();
        
        return Inertia::render('Admin/Quizzes/Index', [
            'quizzes' => $quizzes,
            'lessons' => $lessons,
        ]);
    }
    
    public function store(StoreQuizRequest $request)
    {
        $quiz = Quiz::create($request->validated());
        
        return redirect()->route('admin.quizzes.index')
            ->with('success', 'Quiz berhasil dibuat');
    }
    
    public function destroy(Quiz $quiz)
    {
        if ($quiz->attempts()->count() > 0) {
            return back()->with('error', 
                'Quiz tidak dapat dihapus karena sudah ada student yang mencobanya');
        }
        
        $quiz->delete();
        
        return redirect()->route('admin.quizzes.index')
            ->with('success', 'Quiz berhasil dihapus');
    }
    
    public function preview(Quiz $quiz)
    {
        $quiz->load(['lesson', 'questions']);
        return Inertia::render('Admin/Quizzes/Preview', ['quiz' => $quiz]);
    }
}
```

#### AdminQuestionController
```php
class AdminQuestionController extends Controller
{
    public function index(Request $request)
    {
        $query = Question::with('quiz');
        
        if ($request->has('quiz_id')) {
            $query->where('quiz_id', $request->quiz_id);
        }
        
        $questions = $query->orderBy('order')->paginate(20);
        $quizzes = Quiz::all();
        
        return Inertia::render('Admin/Questions/Index', [
            'questions' => $questions,
            'quizzes' => $quizzes,
        ]);
    }
    
    public function store(StoreQuestionRequest $request)
    {
        $question = Question::create($request->validated());
        
        return redirect()->route('admin.questions.index')
            ->with('success', 'Question berhasil dibuat');
    }
    
    public function destroy(Question $question)
    {
        $question->delete();
        
        return redirect()->route('admin.questions.index')
            ->with('success', 'Question berhasil dihapus');
    }
    
    public function reorder(Request $request, Question $question)
    {
        $request->validate(['order' => 'required|integer']);
        
        $question->update(['order' => $request->order]);
        
        return back()->with('success', 'Urutan question berhasil diupdate');
    }
    
    public function bulkImport(BulkImportQuestionRequest $request)
    {
        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        
        if ($extension === 'csv') {
            $questions = $this->parseCsv($file);
        } elseif ($extension === 'json') {
            $questions = $this->parseJson($file);
        }
        
        $count = 0;
        foreach ($questions as $index => $questionData) {
            Question::create([
                'quiz_id' => $request->quiz_id,
                'question_text' => $questionData['question_text'],
                'options' => $questionData['options'] ?? null,
                'correct_answer' => $questionData['correct_answer'],
                'explanation' => $questionData['explanation'] ?? null,
                'audio_url' => $questionData['audio_url'] ?? null,
                'order' => $index + 1,
            ]);
            $count++;
        }
        
        return back()->with('success', "{$count} question berhasil diimport");
    }
}
```

### 3.3 Form Requests

#### StoreModuleRequest
```php
class StoreModuleRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'level_id' => 'required|exists:levels,id',
            'week_number' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ];
    }
    
    public function messages()
    {
        return [
            'title.required' => 'Field title wajib diisi',
            'title.max' => 'Field title maksimal 255 karakter',
            'level_id.required' => 'Field level wajib diisi',
            'level_id.exists' => 'Level tidak ditemukan',
            'week_number.required' => 'Field week number wajib diisi',
            'week_number.integer' => 'Field week number harus berupa angka',
            'week_number.min' => 'Field week number minimal 1',
        ];
    }
}
```

#### StoreLessonRequest
```php
class StoreLessonRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'module_id' => 'required|exists:modules,id',
            'content' => 'nullable|string',
            'order' => 'required|integer|min:0',
        ];
    }
    
    public function messages()
    {
        return [
            'title.required' => 'Field title wajib diisi',
            'title.max' => 'Field title maksimal 255 karakter',
            'module_id.required' => 'Field module wajib diisi',
            'module_id.exists' => 'Module tidak ditemukan',
            'order.required' => 'Field order wajib diisi',
            'order.integer' => 'Field order harus berupa angka',
        ];
    }
}
```

#### StoreQuizRequest
```php
class StoreQuizRequest extends FormRequest
{
    public function rules()
    {
        return [
            'lesson_id' => 'required|exists:lessons,id',
            'type' => 'required|in:multiple_choice,typing,listening',
            'time_limit' => 'nullable|integer|min:1',
        ];
    }
    
    public function messages()
    {
        return [
            'lesson_id.required' => 'Field lesson wajib diisi',
            'lesson_id.exists' => 'Lesson tidak ditemukan',
            'type.required' => 'Field type wajib diisi',
            'type.in' => 'Type harus salah satu dari: multiple_choice, typing, listening',
            'time_limit.integer' => 'Field time limit harus berupa angka',
            'time_limit.min' => 'Field time limit minimal 1 menit',
        ];
    }
}
```

#### StoreQuestionRequest
```php
class StoreQuestionRequest extends FormRequest
{
    public function rules()
    {
        $rules = [
            'quiz_id' => 'required|exists:quizzes,id',
            'question_text' => 'required|string',
            'correct_answer' => 'required|string',
            'explanation' => 'nullable|string',
            'audio_url' => 'nullable|string',
            'order' => 'nullable|integer|min:0',
        ];
        
        // Jika quiz type adalah multiple_choice, options wajib
        $quiz = Quiz::find($this->quiz_id);
        if ($quiz && $quiz->type === 'multiple_choice') {
            $rules['options'] = 'required|json';
        }
        
        return $rules;
    }
    
    public function messages()
    {
        return [
            'quiz_id.required' => 'Field quiz wajib diisi',
            'quiz_id.exists' => 'Quiz tidak ditemukan',
            'question_text.required' => 'Field question text wajib diisi',
            'correct_answer.required' => 'Field correct answer wajib diisi',
            'options.required' => 'Field options wajib diisi untuk multiple choice',
            'options.json' => 'Format JSON tidak valid',
        ];
    }
}
```

### 3.4 Middleware

#### CheckRole (sudah ada, perlu dipastikan)
```php
class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            abort(403, 'Unauthorized action.');
        }
        
        return $next($request);
    }
}
```

### 3.5 Models (Update yang diperlukan)

#### Module Model
```php
class Module extends Model
{
    protected $fillable = ['level_id', 'title', 'week_number', 'description'];
    
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
    
    public function lessons()
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }
}
```

#### Lesson Model
```php
class Lesson extends Model
{
    protected $fillable = ['module_id', 'title', 'content', 'order'];
    
    public function module()
    {
        return $this->belongsTo(Module::class);
    }
    
    public function quiz()
    {
        return $this->hasOne(Quiz::class);
    }
    
    public function progress()
    {
        return $this->hasMany(Progress::class);
    }
}
```

#### Quiz Model
```php
class Quiz extends Model
{
    protected $fillable = ['lesson_id', 'type', 'time_limit'];
    
    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
    
    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('order');
    }
    
    public function attempts()
    {
        return $this->hasMany(Attempt::class);
    }
}
```

#### Question Model
```php
class Question extends Model
{
    protected $fillable = [
        'quiz_id', 'question_text', 'options', 
        'correct_answer', 'explanation', 'audio_url', 'order'
    ];
    
    protected $casts = [
        'options' => 'array',
    ];
    
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}
```

## 4. Frontend Design

### 4.1 Struktur Komponen React

```
resources/js/Pages/Admin/
├── Dashboard.jsx
├── Modules/
│   ├── Index.jsx
│   ├── Create.jsx
│   ├── Edit.jsx
│   └── Show.jsx
├── Lessons/
│   ├── Index.jsx
│   ├── Create.jsx
│   ├── Edit.jsx
│   ├── Show.jsx
│   └── Preview.jsx
├── Quizzes/
│   ├── Index.jsx
│   ├── Create.jsx
│   ├── Edit.jsx
│   ├── Show.jsx
│   └── Preview.jsx
└── Questions/
    ├── Index.jsx
    ├── Create.jsx
    ├── Edit.jsx
    └── BulkImport.jsx

resources/js/Components/Admin/
├── Layout/
│   ├── AdminLayout.jsx
│   ├── Sidebar.jsx
│   └── Breadcrumb.jsx
├── Common/
│   ├── ConfirmDialog.jsx
│   ├── Toast.jsx
│   ├── DataTable.jsx
│   └── Pagination.jsx
├── Forms/
│   ├── ModuleForm.jsx
│   ├── LessonForm.jsx
│   ├── QuizForm.jsx
│   └── QuestionForm.jsx
└── RichTextEditor.jsx
```

### 4.2 Komponen Utama

#### AdminLayout.jsx
```jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';
import Toast from '../Common/Toast';

export default function AdminLayout({ children, breadcrumbs }) {
    const [toast, setToast] = useState(null);
    
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm">
                    <div className="px-6 py-4">
                        <Breadcrumb items={breadcrumbs} />
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
}
```

#### Dashboard.jsx
```jsx
import AdminLayout from '@/Components/Admin/Layout/AdminLayout';
import { Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentActivities }) {
    return (
        <AdminLayout breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }]}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <StatCard title="Total Modules" value={stats.total_modules} icon="📚" />
                <StatCard title="Total Lessons" value={stats.total_lessons} icon="📖" />
                <StatCard title="Total Quizzes" value={stats.total_quizzes} icon="📝" />
                <StatCard title="Total Questions" value={stats.total_questions} icon="❓" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickActions />
                <RecentActivities activities={recentActivities} />
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );
}
```

#### DataTable.jsx (Reusable Component)
```jsx
import { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function DataTable({ columns, data, actions, onDelete }) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {col.label}
                            </th>
                        ))}
                        {actions && <th className="px-6 py-3 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row) => (
                        <tr key={row.id}>
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                                    {col.render ? col.render(row) : row[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Link href={actions.edit(row.id)} className="text-blue-600 hover:text-blue-900 mr-3">
                                        Edit
                                    </Link>
                                    <button onClick={() => onDelete(row.id)} className="text-red-600 hover:text-red-900">
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
```

#### ConfirmDialog.jsx
```jsx
export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
```

#### RichTextEditor.jsx
```jsx
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function RichTextEditor({ value, onChange }) {
    const editorRef = useRef(null);
    
    return (
        <Editor
            apiKey="your-tinymce-api-key"
            onInit={(evt, editor) => editorRef.current = editor}
            value={value}
            onEditorChange={onChange}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | image media | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
}
```

#### ModuleForm.jsx
```jsx
import { useForm } from '@inertiajs/react';
import RichTextEditor from '../RichTextEditor';

export default function ModuleForm({ module, levels, onSubmit }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title: module?.title || '',
        level_id: module?.level_id || '',
        week_number: module?.week_number || 1,
        description: module?.description || '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (module) {
            put(route('admin.modules.update', module.id));
        } else {
            post(route('admin.modules.store'));
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Level JLPT</label>
                <select
                    value={data.level_id}
                    onChange={e => setData('level_id', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                >
                    <option value="">Pilih Level</option>
                    {levels.map(level => (
                        <option key={level.id} value={level.id}>{level.level_name}</option>
                    ))}
                </select>
                {errors.level_id && <p className="mt-1 text-sm text-red-600">{errors.level_id}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Week Number</label>
                <input
                    type="number"
                    value={data.week_number}
                    onChange={e => setData('week_number', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {errors.week_number && <p className="mt-1 text-sm text-red-600">{errors.week_number}</p>}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
```

#### QuestionForm.jsx
```jsx
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function QuestionForm({ question, quiz, onSubmit }) {
    const { data, setData, post, put, processing, errors } = useForm({
        quiz_id: question?.quiz_id || quiz?.id || '',
        question_text: question?.question_text || '',
        options: question?.options || ['', '', '', ''],
        correct_answer: question?.correct_answer || '',
        explanation: question?.explanation || '',
        audio_url: question?.audio_url || '',
    });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const payload = {
            ...data,
            options: quiz?.type === 'multiple_choice' ? JSON.stringify(data.options) : null,
        };
        
        if (question) {
            put(route('admin.questions.update', question.id), payload);
        } else {
            post(route('admin.questions.store'), payload);
        }
    };
    
    const updateOption = (index, value) => {
        const newOptions = [...data.options];
        newOptions[index] = value;
        setData('options', newOptions);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Question Text</label>
                <textarea
                    value={data.question_text}
                    onChange={e => setData('question_text', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {errors.question_text && <p className="mt-1 text-sm text-red-600">{errors.question_text}</p>}
            </div>
            
            {quiz?.type === 'multiple_choice' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    {data.options.map((option, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                value={option}
                                onChange={e => updateOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                    ))}
                    {errors.options && <p className="mt-1 text-sm text-red-600">{errors.options}</p>}
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                <input
                    type="text"
                    value={data.correct_answer}
                    onChange={e => setData('correct_answer', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                {errors.correct_answer && <p className="mt-1 text-sm text-red-600">{errors.correct_answer}</p>}
            </div>
            
            {quiz?.type === 'listening' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">Audio URL</label>
                    <input
                        type="text"
                        value={data.audio_url}
                        onChange={e => setData('audio_url', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                    {errors.audio_url && <p className="mt-1 text-sm text-red-600">{errors.audio_url}</p>}
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Explanation (Optional)</label>
                <textarea
                    value={data.explanation}
                    onChange={e => setData('explanation', e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
            </div>
            
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>
        </form>
    );
}
```

## 5. UI/UX Design Patterns

### 5.1 Layout Pattern
- Sidebar navigation di kiri dengan menu: Dashboard, Levels, Modules, Lessons, Quizzes, Questions
- Breadcrumb navigation di atas konten untuk menunjukkan hierarki
- Responsive design: sidebar collapse pada mobile

### 5.2 List View Pattern (Index Pages)
- Search bar di atas tabel
- Filter dropdown (by level, module, lesson, quiz)
- DataTable dengan kolom sortable
- Pagination di bawah tabel
- Action buttons: Create New, Edit, Delete
- Bulk actions (future enhancement)

### 5.3 Form Pattern (Create/Edit Pages)
- Form fields dengan label jelas dalam Bahasa Indonesia
- Inline validation errors di bawah setiap field
- Required fields ditandai dengan asterisk (*)
- Submit button disabled saat processing
- Cancel button untuk kembali ke list view

### 5.4 Confirmation Pattern
- Modal dialog untuk konfirmasi delete
- Pesan jelas: "Apakah Anda yakin ingin menghapus [tipe konten] ini?"
- Dua tombol: "Batal" (secondary) dan "Hapus" (danger)

### 5.5 Feedback Pattern
- Toast notification untuk success/error messages
- Success toast: hijau, auto-dismiss setelah 3 detik
- Error toast: merah, manual dismiss
- Loading spinner pada button saat processing

### 5.6 Preview Pattern
- Preview button pada list view
- Preview page menampilkan konten seperti student view
- "Kembali ke Panel Admin" button untuk exit preview

## 6. File Upload Design

### 6.1 Image Upload (untuk Lesson Content)
```php
// Controller method
public function uploadImage(Request $request)
{
    $request->validate([
        'image' => 'required|image|max:2048', // 2MB max
    ]);
    
    $path = $request->file('image')->store('lessons/images', 'public');
    
    return response()->json([
        'url' => Storage::url($path),
    ]);
}
```

### 6.2 Audio Upload (untuk Listening Questions)
```php
// Controller method
public function uploadAudio(Request $request)
{
    $request->validate([
        'audio' => 'required|mimes:mp3,wav,ogg|max:5120', // 5MB max
    ]);
    
    $path = $request->file('audio')->store('questions/audio', 'public');
    
    return response()->json([
        'url' => Storage::url($path),
    ]);
}
```

### 6.3 Bulk Import CSV Format
```csv
question_text,options,correct_answer,explanation
"Apa arti 'こんにちは'?","[""Selamat pagi"",""Selamat siang"",""Selamat malam"",""Selamat tinggal""]","Selamat siang","こんにちは digunakan untuk menyapa di siang hari"
```

### 6.4 Bulk Import JSON Format
```json
[
  {
    "question_text": "Apa arti 'こんにちは'?",
    "options": ["Selamat pagi", "Selamat siang", "Selamat malam", "Selamat tinggal"],
    "correct_answer": "Selamat siang",
    "explanation": "こんにちは digunakan untuk menyapa di siang hari"
  }
]
```

## 7. Security Considerations

### 7.1 Authorization
- Semua routes Admin panel dilindungi oleh middleware `auth` dan `role:admin,superadmin`
- Validasi role di setiap controller method
- CSRF protection untuk semua form submissions (Laravel default)

### 7.2 Input Validation
- Server-side validation menggunakan Form Requests
- Sanitize HTML content dari rich text editor
- Validate file uploads (type, size, extension)
- Prevent SQL injection dengan Eloquent ORM

### 7.3 File Upload Security
- Whitelist allowed file extensions
- Validate MIME types
- Store uploaded files outside public directory
- Generate unique filenames
- Limit file sizes

### 7.4 XSS Prevention
- Escape output dalam Blade/React components
- Sanitize rich text content sebelum disimpan
- Use Content Security Policy headers

## 8. Performance Optimization

### 8.1 Database Optimization
- Index pada foreign keys (level_id, module_id, lesson_id, quiz_id)
- Eager loading relationships untuk menghindari N+1 queries
- Pagination untuk list views (20 items per page)

### 8.2 Frontend Optimization
- Lazy loading untuk komponen besar
- Debounce search input
- Cache static assets
- Optimize images sebelum upload

### 8.3 Caching Strategy
- Cache level list (jarang berubah)
- Cache dashboard statistics (refresh setiap 5 menit)
- Clear cache saat konten diupdate

## 9. Testing Strategy

### 9.1 Unit Tests
- Test Form Request validation rules
- Test Model relationships
- Test helper functions

### 9.2 Feature Tests
- Test CRUD operations untuk setiap resource
- Test authorization (Admin dapat akses, student tidak dapat)
- Test validation errors
- Test file uploads
- Test bulk import

### 9.3 Browser Tests (Dusk)
- Test user flow: create module → create lesson → create quiz → create questions
- Test delete confirmation dialog
- Test preview functionality
- Test form validation UI

## 10. Error Handling

### 10.1 Validation Errors
- Display inline errors di bawah form fields
- Error messages dalam Bahasa Indonesia
- Highlight invalid fields dengan border merah

### 10.2 Database Errors
- Catch foreign key constraint violations
- Display user-friendly error messages
- Log technical errors untuk debugging

### 10.3 File Upload Errors
- Validate file before upload
- Display clear error messages (file too large, invalid format, etc.)
- Rollback database changes jika upload gagal

### 10.4 404 Errors
- Custom 404 page untuk Admin panel
- Breadcrumb navigation tetap visible
- Link kembali ke dashboard

## 11. Deployment Considerations

### 11.1 Environment Configuration
```env
# File Upload
FILESYSTEM_DISK=public
MAX_UPLOAD_SIZE=5120

# TinyMCE
TINYMCE_API_KEY=your-api-key-here

# Session
SESSION_DRIVER=database
SESSION_LIFETIME=120
```

### 11.2 Storage Setup
```bash
# Create symbolic link untuk public storage
php artisan storage:link

# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 11.3 Database Migrations
```bash
# Run migrations
php artisan migrate

# Seed initial data (levels, sample modules)
php artisan db:seed
```

### 11.4 Asset Compilation
```bash
# Install dependencies
npm install

# Build for production
npm run build
```

## 12. Future Enhancements

### 12.1 Kanji Management System
- CRUD kanji cards
- Assign kanji ke lessons
- Spaced repetition algorithm (SRS levels 1-8)
- Import kanji dari Kanji Senpai/Duolingo reference

### 12.2 Bulk Operations
- Bulk delete modules/lessons/quizzes/questions
- Bulk assign level
- Bulk export/import content (JSON format)

### 12.3 Content Analytics
- View count per lesson
- Quiz completion rate
- Average quiz scores
- Student progress tracking

### 12.4 Collaboration Features
- Multiple Admin dapat edit konten
- Version history untuk konten
- Comment system untuk review

### 12.5 Advanced Editor Features
- Drag-and-drop image upload dalam rich text editor
- Embed video dari YouTube
- LaTeX support untuk mathematical expressions
- Code syntax highlighting

## 13. API Endpoints Summary

### Dashboard
- GET `/admin/dashboard` - Dashboard overview

### Levels
- GET `/admin/levels` - List all levels
- GET `/admin/levels/{id}` - Show level detail
- PUT `/admin/levels/{id}` - Update level

### Modules
- GET `/admin/modules` - List modules (with filter)
- GET `/admin/modules/create` - Show create form
- POST `/admin/modules` - Store new module
- GET `/admin/modules/{id}` - Show module detail
- GET `/admin/modules/{id}/edit` - Show edit form
- PUT `/admin/modules/{id}` - Update module
- DELETE `/admin/modules/{id}` - Delete module

### Lessons
- GET `/admin/lessons` - List lessons (with filter)
- GET `/admin/lessons/create` - Show create form
- POST `/admin/lessons` - Store new lesson
- GET `/admin/lessons/{id}` - Show lesson detail
- GET `/admin/lessons/{id}/edit` - Show edit form
- PUT `/admin/lessons/{id}` - Update lesson
- DELETE `/admin/lessons/{id}` - Delete lesson
- POST `/admin/lessons/{id}/reorder` - Reorder lesson
- GET `/admin/lessons/{id}/preview` - Preview lesson

### Quizzes
- GET `/admin/quizzes` - List quizzes (with filter)
- GET `/admin/quizzes/create` - Show create form
- POST `/admin/quizzes` - Store new quiz
- GET `/admin/quizzes/{id}` - Show quiz detail
- GET `/admin/quizzes/{id}/edit` - Show edit form
- PUT `/admin/quizzes/{id}` - Update quiz
- DELETE `/admin/quizzes/{id}` - Delete quiz
- GET `/admin/quizzes/{id}/preview` - Preview quiz

### Questions
- GET `/admin/questions` - List questions (with filter)
- GET `/admin/questions/create` - Show create form
- POST `/admin/questions` - Store new question
- GET `/admin/questions/{id}/edit` - Show edit form
- PUT `/admin/questions/{id}` - Update question
- DELETE `/admin/questions/{id}` - Delete question
- POST `/admin/questions/{id}/reorder` - Reorder question
- POST `/admin/questions/bulk-import` - Bulk import questions

### File Uploads
- POST `/admin/upload/image` - Upload image for lesson content
- POST `/admin/upload/audio` - Upload audio for listening questions
