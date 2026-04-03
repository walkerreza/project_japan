# Tasks - Panel Admin

## Phase 1: Database Setup

- [ ] 1.1 Create migration untuk menambahkan field yang hilang
  - [ ] 1.1.1 Tambah field `description` ke tabel `modules`
  - [ ] 1.1.2 Tambah field `order` ke tabel `lessons`
  - [ ] 1.1.3 Tambah field `time_limit` ke tabel `quizzes`
  - [ ] 1.1.4 Tambah field `options`, `audio_url`, `order` ke tabel `questions`

- [ ] 1.2 Update Model relationships
  - [ ] 1.2.1 Update `Module` model dengan fillable dan relationships
  - [ ] 1.2.2 Update `Lesson` model dengan fillable dan relationships
  - [ ] 1.2.3 Update `Quiz` model dengan fillable dan relationships
  - [ ] 1.2.4 Update `Question` model dengan fillable, casts, dan relationships

- [ ] 1.3 Create database indexes untuk optimasi
  - [ ] 1.3.1 Index pada `modules.level_id`
  - [ ] 1.3.2 Index pada `lessons.module_id` dan `lessons.order`
  - [ ] 1.3.3 Index pada `quizzes.lesson_id`
  - [ ] 1.3.4 Index pada `questions.quiz_id` dan `questions.order`

## Phase 2: Backend - Authentication & Authorization

- [ ] 2.1 Verify dan update CheckRole middleware
  - [ ] 2.1.1 Pastikan middleware menerima multiple roles
  - [ ] 2.1.2 Test middleware dengan role Admin dan superadmin

- [ ] 2.2 Register middleware di Kernel
  - [ ] 2.2.1 Register `role` middleware alias

## Phase 3: Backend - Controllers & Routes

- [ ] 3.1 Create AdminDashboardController
  - [ ] 3.1.1 Implement `index()` method dengan statistics
  - [ ] 3.1.2 Implement `getRecentActivities()` helper method

- [ ] 3.2 Create AdminLevelController
  - [ ] 3.2.1 Implement `index()` method
  - [ ] 3.2.2 Implement `show()` method
  - [ ] 3.2.3 Implement `update()` method

- [ ] 3.3 Create AdminModuleController
  - [ ] 3.3.1 Implement `index()` method dengan filter
  - [ ] 3.3.2 Implement `create()` method
  - [ ] 3.3.3 Implement `store()` method
  - [ ] 3.3.4 Implement `show()` method
  - [ ] 3.3.5 Implement `edit()` method
  - [ ] 3.3.6 Implement `update()` method
  - [ ] 3.3.7 Implement `destroy()` method dengan dependency check

- [ ] 3.4 Create AdminLessonController
  - [ ] 3.4.1 Implement `index()` method dengan filter
  - [ ] 3.4.2 Implement `create()` method
  - [ ] 3.4.3 Implement `store()` method
  - [ ] 3.4.4 Implement `show()` method
  - [ ] 3.4.5 Implement `edit()` method
  - [ ] 3.4.6 Implement `update()` method
  - [ ] 3.4.7 Implement `destroy()` method dengan dependency check
  - [ ] 3.4.8 Implement `reorder()` method
  - [ ] 3.4.9 Implement `preview()` method

- [ ] 3.5 Create AdminQuizController
  - [ ] 3.5.1 Implement `index()` method dengan filter
  - [ ] 3.5.2 Implement `create()` method
  - [ ] 3.5.3 Implement `store()` method
  - [ ] 3.5.4 Implement `show()` method
  - [ ] 3.5.5 Implement `edit()` method
  - [ ] 3.5.6 Implement `update()` method
  - [ ] 3.5.7 Implement `destroy()` method dengan dependency check
  - [ ] 3.5.8 Implement `preview()` method

- [ ] 3.6 Create AdminQuestionController
  - [ ] 3.6.1 Implement `index()` method dengan filter
  - [ ] 3.6.2 Implement `create()` method
  - [ ] 3.6.3 Implement `store()` method
  - [ ] 3.6.4 Implement `edit()` method
  - [ ] 3.6.5 Implement `update()` method
  - [ ] 3.6.6 Implement `destroy()` method
  - [ ] 3.6.7 Implement `reorder()` method
  - [ ] 3.6.8 Implement `bulkImport()` method
  - [ ] 3.6.9 Implement CSV parser helper
  - [ ] 3.6.10 Implement JSON parser helper

- [ ] 3.7 Create File Upload Controller
  - [ ] 3.7.1 Implement `uploadImage()` method
  - [ ] 3.7.2 Implement `uploadAudio()` method

- [ ] 3.8 Register routes di web.php
  - [ ] 3.8.1 Register dashboard route
  - [ ] 3.8.2 Register level routes
  - [ ] 3.8.3 Register module resource routes
  - [ ] 3.8.4 Register lesson resource routes + custom routes
  - [ ] 3.8.5 Register quiz resource routes + custom routes
  - [ ] 3.8.6 Register question resource routes + custom routes
  - [ ] 3.8.7 Register file upload routes

## Phase 4: Backend - Form Requests

- [ ] 4.1 Create StoreModuleRequest
  - [ ] 4.1.1 Define validation rules
  - [ ] 4.1.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.2 Create UpdateModuleRequest
  - [ ] 4.2.1 Define validation rules
  - [ ] 4.2.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.3 Create StoreLessonRequest
  - [ ] 4.3.1 Define validation rules
  - [ ] 4.3.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.4 Create UpdateLessonRequest
  - [ ] 4.4.1 Define validation rules
  - [ ] 4.4.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.5 Create StoreQuizRequest
  - [ ] 4.5.1 Define validation rules
  - [ ] 4.5.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.6 Create UpdateQuizRequest
  - [ ] 4.6.1 Define validation rules
  - [ ] 4.6.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.7 Create StoreQuestionRequest
  - [ ] 4.7.1 Define validation rules (conditional untuk multiple_choice)
  - [ ] 4.7.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.8 Create UpdateQuestionRequest
  - [ ] 4.8.1 Define validation rules (conditional untuk multiple_choice)
  - [ ] 4.8.2 Define custom error messages dalam Bahasa Indonesia

- [ ] 4.9 Create BulkImportQuestionRequest
  - [ ] 4.9.1 Define validation rules untuk file upload
  - [ ] 4.9.2 Define custom error messages dalam Bahasa Indonesia

## Phase 5: Frontend - Layout & Common Components

- [ ] 5.1 Create AdminLayout component
  - [ ] 5.1.1 Implement layout structure dengan sidebar
  - [ ] 5.1.2 Implement responsive behavior

- [ ] 5.2 Create Sidebar component
  - [ ] 5.2.1 Implement navigation menu
  - [ ] 5.2.2 Implement active state highlighting
  - [ ] 5.2.3 Implement collapse behavior untuk mobile

- [ ] 5.3 Create Breadcrumb component
  - [ ] 5.3.1 Implement breadcrumb navigation
  - [ ] 5.3.2 Implement dynamic breadcrumb items

- [ ] 5.4 Create Toast component
  - [ ] 5.4.1 Implement success toast (green, auto-dismiss)
  - [ ] 5.4.2 Implement error toast (red, manual dismiss)
  - [ ] 5.4.3 Implement toast positioning

- [ ] 5.5 Create ConfirmDialog component
  - [ ] 5.5.1 Implement modal dialog
  - [ ] 5.5.2 Implement confirmation buttons
  - [ ] 5.5.3 Implement backdrop click handling

- [ ] 5.6 Create DataTable component
  - [ ] 5.6.1 Implement table structure
  - [ ] 5.6.2 Implement sortable columns
  - [ ] 5.6.3 Implement action buttons (Edit, Delete)
  - [ ] 5.6.4 Implement empty state

- [ ] 5.7 Create Pagination component
  - [ ] 5.7.1 Implement pagination controls
  - [ ] 5.7.2 Implement page number display
  - [ ] 5.7.3 Implement navigation buttons

- [ ] 5.8 Create RichTextEditor component
  - [ ] 5.8.1 Integrate TinyMCE
  - [ ] 5.8.2 Configure toolbar options
  - [ ] 5.8.3 Implement image upload integration

## Phase 6: Frontend - Dashboard

- [ ] 6.1 Create Dashboard page
  - [ ] 6.1.1 Implement StatCard component
  - [ ] 6.1.2 Implement QuickActions component
  - [ ] 6.1.3 Implement RecentActivities component
  - [ ] 6.1.4 Implement grid layout

## Phase 7: Frontend - Module Management

- [ ] 7.1 Create Modules/Index page
  - [ ] 7.1.1 Implement module list dengan DataTable
  - [ ] 7.1.2 Implement level filter dropdown
  - [ ] 7.1.3 Implement search functionality
  - [ ] 7.1.4 Implement delete confirmation

- [ ] 7.2 Create Modules/Create page
  - [ ] 7.2.1 Implement ModuleForm component
  - [ ] 7.2.2 Implement form submission
  - [ ] 7.2.3 Implement validation error display

- [ ] 7.3 Create Modules/Edit page
  - [ ] 7.3.1 Reuse ModuleForm component
  - [ ] 7.3.2 Implement form submission untuk update
  - [ ] 7.3.3 Implement validation error display

- [ ] 7.4 Create Modules/Show page
  - [ ] 7.4.1 Implement module detail display
  - [ ] 7.4.2 Implement lessons list dalam module
  - [ ] 7.4.3 Implement action buttons (Edit, Delete)

- [ ] 7.5 Create ModuleForm component
  - [ ] 7.5.1 Implement form fields (title, level, week_number, description)
  - [ ] 7.5.2 Implement form validation
  - [ ] 7.5.3 Implement submit dan cancel buttons

## Phase 8: Frontend - Lesson Management

- [ ] 8.1 Create Lessons/Index page
  - [ ] 8.1.1 Implement lesson list dengan DataTable
  - [ ] 8.1.2 Implement module filter dropdown
  - [ ] 8.1.3 Implement search functionality
  - [ ] 8.1.4 Implement delete confirmation
  - [ ] 8.1.5 Implement drag-and-drop reorder

- [ ] 8.2 Create Lessons/Create page
  - [ ] 8.2.1 Implement LessonForm component
  - [ ] 8.2.2 Implement RichTextEditor integration
  - [ ] 8.2.3 Implement form submission
  - [ ] 8.2.4 Implement validation error display

- [ ] 8.3 Create Lessons/Edit page
  - [ ] 8.3.1 Reuse LessonForm component
  - [ ] 8.3.2 Implement form submission untuk update
  - [ ] 8.3.3 Implement validation error display

- [ ] 8.4 Create Lessons/Show page
  - [ ] 8.4.1 Implement lesson detail display
  - [ ] 8.4.2 Implement quiz info jika ada
  - [ ] 8.4.3 Implement action buttons (Edit, Delete, Preview)

- [ ] 8.5 Create Lessons/Preview page
  - [ ] 8.5.1 Implement student view layout
  - [ ] 8.5.2 Implement content rendering
  - [ ] 8.5.3 Implement "Kembali ke Panel Admin" button

- [ ] 8.6 Create LessonForm component
  - [ ] 8.6.1 Implement form fields (title, module, content, order)
  - [ ] 8.6.2 Implement RichTextEditor untuk content
  - [ ] 8.6.3 Implement form validation
  - [ ] 8.6.4 Implement submit dan cancel buttons

## Phase 9: Frontend - Quiz Management

- [ ] 9.1 Create Quizzes/Index page
  - [ ] 9.1.1 Implement quiz list dengan DataTable
  - [ ] 9.1.2 Implement lesson filter dropdown
  - [ ] 9.1.3 Implement search functionality
  - [ ] 9.1.4 Implement delete confirmation

- [ ] 9.2 Create Quizzes/Create page
  - [ ] 9.2.1 Implement QuizForm component
  - [ ] 9.2.2 Implement form submission
  - [ ] 9.2.3 Implement validation error display

- [ ] 9.3 Create Quizzes/Edit page
  - [ ] 9.3.1 Reuse QuizForm component
  - [ ] 9.3.2 Implement form submission untuk update
  - [ ] 9.3.3 Implement validation error display

- [ ] 9.4 Create Quizzes/Show page
  - [ ] 9.4.1 Implement quiz detail display
  - [ ] 9.4.2 Implement questions list dalam quiz
  - [ ] 9.4.3 Implement action buttons (Edit, Delete, Preview)

- [ ] 9.5 Create Quizzes/Preview page
  - [ ] 9.5.1 Implement student view layout
  - [ ] 9.5.2 Implement quiz interaction (test mode)
  - [ ] 9.5.3 Implement result display (tanpa save ke database)
  - [ ] 9.5.4 Implement "Kembali ke Panel Admin" button

- [ ] 9.6 Create QuizForm component
  - [ ] 9.6.1 Implement form fields (lesson, type, time_limit)
  - [ ] 9.6.2 Implement form validation
  - [ ] 9.6.3 Implement submit dan cancel buttons

## Phase 10: Frontend - Question Management

- [ ] 10.1 Create Questions/Index page
  - [ ] 10.1.1 Implement question list dengan DataTable
  - [ ] 10.1.2 Implement quiz filter dropdown
  - [ ] 10.1.3 Implement search functionality
  - [ ] 10.1.4 Implement delete confirmation
  - [ ] 10.1.5 Implement drag-and-drop reorder

- [ ] 10.2 Create Questions/Create page
  - [ ] 10.2.1 Implement QuestionForm component
  - [ ] 10.2.2 Implement conditional fields berdasarkan quiz type
  - [ ] 10.2.3 Implement form submission
  - [ ] 10.2.4 Implement validation error display

- [ ] 10.3 Create Questions/Edit page
  - [ ] 10.3.1 Reuse QuestionForm component
  - [ ] 10.3.2 Implement form submission untuk update
  - [ ] 10.3.3 Implement validation error display

- [ ] 10.4 Create Questions/BulkImport page
  - [ ] 10.4.1 Implement file upload component
  - [ ] 10.4.2 Implement CSV/JSON format instructions
  - [ ] 10.4.3 Implement file validation
  - [ ] 10.4.4 Implement import submission
  - [ ] 10.4.5 Implement success/error feedback

- [ ] 10.5 Create QuestionForm component
  - [ ] 10.5.1 Implement form fields (question_text, correct_answer, explanation)
  - [ ] 10.5.2 Implement options fields untuk multiple_choice
  - [ ] 10.5.3 Implement audio_url field untuk listening
  - [ ] 10.5.4 Implement form validation
  - [ ] 10.5.5 Implement submit dan cancel buttons

## Phase 11: File Upload Integration

- [ ] 11.1 Setup Laravel Storage
  - [ ] 11.1.1 Configure filesystem disk untuk public storage
  - [ ] 11.1.2 Create symbolic link (storage:link)
  - [ ] 11.1.3 Create directories untuk images dan audio

- [ ] 11.2 Implement image upload untuk RichTextEditor
  - [ ] 11.2.1 Create upload endpoint
  - [ ] 11.2.2 Integrate dengan TinyMCE image upload
  - [ ] 11.2.3 Implement validation (type, size)

- [ ] 11.3 Implement audio upload untuk listening questions
  - [ ] 11.3.1 Create upload endpoint
  - [ ] 11.3.2 Create audio upload component
  - [ ] 11.3.3 Implement validation (type, size)
  - [ ] 11.3.4 Implement audio preview

## Phase 12: Testing

- [ ] 12.1 Unit Tests
  - [ ] 12.1.1 Test Module model relationships
  - [ ] 12.1.2 Test Lesson model relationships
  - [ ] 12.1.3 Test Quiz model relationships
  - [ ] 12.1.4 Test Question model relationships
  - [ ] 12.1.5 Test Form Request validation rules

- [ ] 12.2 Feature Tests - Module Management
  - [ ] 12.2.1 Test create module dengan valid data
  - [ ] 12.2.2 Test create module dengan invalid data
  - [ ] 12.2.3 Test update module
  - [ ] 12.2.4 Test delete module tanpa lessons
  - [ ] 12.2.5 Test delete module dengan lessons (should fail)
  - [ ] 12.2.6 Test authorization (Admin dapat akses, student tidak)

- [ ] 12.3 Feature Tests - Lesson Management
  - [ ] 12.3.1 Test create lesson dengan valid data
  - [ ] 12.3.2 Test create lesson dengan invalid data
  - [ ] 12.3.3 Test update lesson
  - [ ] 12.3.4 Test delete lesson tanpa dependencies
  - [ ] 12.3.5 Test delete lesson dengan quiz (should fail)
  - [ ] 12.3.6 Test delete lesson dengan progress (should fail)
  - [ ] 12.3.7 Test reorder lessons

- [ ] 12.4 Feature Tests - Quiz Management
  - [ ] 12.4.1 Test create quiz dengan valid data
  - [ ] 12.4.2 Test create quiz dengan invalid data
  - [ ] 12.4.3 Test update quiz
  - [ ] 12.4.4 Test delete quiz tanpa attempts
  - [ ] 12.4.5 Test delete quiz dengan attempts (should fail)

- [ ] 12.5 Feature Tests - Question Management
  - [ ] 12.5.1 Test create question dengan valid data
  - [ ] 12.5.2 Test create question dengan invalid data
  - [ ] 12.5.3 Test update question
  - [ ] 12.5.4 Test delete question
  - [ ] 12.5.5 Test reorder questions
  - [ ] 12.5.6 Test bulk import CSV
  - [ ] 12.5.7 Test bulk import JSON

- [ ] 12.6 Feature Tests - File Upload
  - [ ] 12.6.1 Test image upload dengan valid file
  - [ ] 12.6.2 Test image upload dengan invalid file type
  - [ ] 12.6.3 Test image upload dengan file too large
  - [ ] 12.6.4 Test audio upload dengan valid file
  - [ ] 12.6.5 Test audio upload dengan invalid file type

## Phase 13: Documentation & Deployment

- [ ] 13.1 Create API documentation
  - [ ] 13.1.1 Document all endpoints
  - [ ] 13.1.2 Document request/response formats
  - [ ] 13.1.3 Document error codes

- [ ] 13.2 Create user guide untuk Admin
  - [ ] 13.2.1 Guide untuk create module
  - [ ] 13.2.2 Guide untuk create lesson dengan rich text
  - [ ] 13.2.3 Guide untuk create quiz dan questions
  - [ ] 13.2.4 Guide untuk bulk import questions

- [ ] 13.3 Setup environment configuration
  - [ ] 13.3.1 Configure .env variables
  - [ ] 13.3.2 Setup TinyMCE API key
  - [ ] 13.3.3 Configure file upload limits

- [ ] 13.4 Run migrations dan seeders
  - [ ] 13.4.1 Run database migrations
  - [ ] 13.4.2 Seed initial levels data
  - [ ] 13.4.3 Create sample Admin user

- [ ] 13.5 Build dan deploy
  - [ ] 13.5.1 Run npm build
  - [ ] 13.5.2 Clear cache
  - [ ] 13.5.3 Test all features di production environment

## Phase 14: Future Enhancements (Optional)

- [ ] 14.1 Kanji Management System
  - [ ] 14.1.1 Create kanji_cards migration
  - [ ] 14.1.2 Create lesson_kanji pivot migration
  - [ ] 14.1.3 Create KanjiCard model
  - [ ] 14.1.4 Create AdminKanjiController
  - [ ] 14.1.5 Create Kanji CRUD pages
  - [ ] 14.1.6 Implement SRS algorithm

- [ ] 14.2 Bulk Operations
  - [ ] 14.2.1 Implement bulk delete modules
  - [ ] 14.2.2 Implement bulk delete lessons
  - [ ] 14.2.3 Implement bulk assign level
  - [ ] 14.2.4 Implement bulk export (JSON)
  - [ ] 14.2.5 Implement bulk import (JSON)

- [ ] 14.3 Content Analytics
  - [ ] 14.3.1 Track lesson view count
  - [ ] 14.3.2 Calculate quiz completion rate
  - [ ] 14.3.3 Calculate average quiz scores
  - [ ] 14.3.4 Create analytics dashboard

- [ ] 14.4 Advanced Editor Features
  - [ ] 14.4.1 Implement drag-and-drop image upload
  - [ ] 14.4.2 Implement YouTube embed
  - [ ] 14.4.3 Implement LaTeX support
  - [ ] 14.4.4 Implement code syntax highlighting
