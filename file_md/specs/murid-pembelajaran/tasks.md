# Implementation Plan: Murid Pembelajaran

## Overview

Implementasi fitur Murid Pembelajaran menggunakan Laravel 12 (backend) + React 18 + Inertia.js (frontend) dengan pendekatan incremental. Setiap task membangun di atas task sebelumnya, dimulai dari setup dasar, kemudian implementasi backend services, controllers, frontend components, dan integrasi dengan sistem gamifikasi.

## Tasks

- [ ] 1. Setup struktur proyek dan konfigurasi dasar
  - Buat direktori struktur untuk controllers, services, events, middleware
  - Setup routes untuk fitur pembelajaran di routes/web.php
  - Konfigurasi middleware groups (auth, role:student, subscription)
  - Setup Inertia.js shared data untuk user subscription status
  - _Requirements: 14.1, 14.2_

- [ ] 2. Implementasi Models dan Relationships
  - [ ] 2.1 Update Model User dengan relationships
    - Tambahkan relationship hasMany ke Progress dan Attempt
    - _Requirements: 11.1, 12.1_
  
  - [ ] 2.2 Implementasi Model Module dengan relationships dan methods
    - Tambahkan relationship belongsTo ke Level
    - Tambahkan relationship hasMany ke Lesson
    - Tambahkan relationship hasManyThrough ke Progress
    - _Requirements: 2.2, 3.1, 3.2, 3.3_
  
  - [ ] 2.3 Implementasi Model Lesson dengan relationships dan methods
    - Tambahkan relationship belongsTo ke Module
    - Tambahkan relationship hasOne ke Quiz
    - Tambahkan relationship hasMany ke Progress
    - Tambahkan method userProgress(int $userId)
    - _Requirements: 4.2, 5.1, 11.1_
  
  - [ ] 2.4 Implementasi Model Quiz dengan relationships
    - Tambahkan relationship belongsTo ke Lesson
    - Tambahkan relationship hasMany ke Question
    - Tambahkan relationship hasMany ke Attempt
    - _Requirements: 6.1, 7.1, 8.1, 12.1_
  
  - [ ] 2.5 Implementasi Model Question
    - Setup fillable fields dan casts (options sebagai array)
    - Tambahkan relationship belongsTo ke Quiz
    - _Requirements: 6.1, 6.3_
  
  - [ ] 2.6 Implementasi Model Progress
    - Setup fillable fields dan casts (completed_at sebagai datetime)
    - Tambahkan relationship belongsTo ke User dan Lesson
    - Tambahkan unique constraint (user_id, lesson_id)
    - _Requirements: 11.1, 11.2_
  
  - [ ] 2.7 Implementasi Model Attempt
    - Setup fillable fields dan casts (attempted_at sebagai datetime)
    - Tambahkan relationship belongsTo ke User dan Quiz
    - _Requirements: 12.1, 12.3_

- [ ] 3. Implementasi Service Layer - ModuleService
  - [ ] 3.1 Implementasi method getAccessibleModules()
    - Tentukan accessible levels berdasarkan user subscription
    - Query modules dengan filter level dan eager load relationships
    - Hitung progress untuk setiap module menggunakan calculateModuleProgress()
    - Tentukan status (locked/unlocked/completed) menggunakan isModuleUnlocked()
    - Return collection dengan metadata
    - _Requirements: 1.1, 1.2, 2.2, 2.5, 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 3.2 Write property test untuk getAccessibleModules()
    - **Property 1: Subscription-Based Level Access Control**
    - **Property 2: Module List Filtering by Level**
    - **Property 5: Module Status Determination**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.2, 2.5, 3.1, 3.2, 3.3, 3.4**
  
  - [ ] 3.3 Implementasi method getModuleWithLessons()
    - Query module dengan lessons (ordered by order)
    - Hitung progress module menggunakan calculateModuleProgress()
    - Untuk setiap lesson, tentukan status menggunakan LessonService->isLessonUnlocked()
    - Return array dengan module data, lessons, dan metadata
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 3.4 Write property test untuk getModuleWithLessons()
    - **Property 6: Module Detail Rendering Completeness**
    - **Property 7: Lesson Status Determination**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**
  
  - [ ] 3.5 Implementasi method calculateModuleProgress()
    - Query total lessons dalam module
    - Query completed lessons (progress dengan completed_at not null)
    - Hitung percentage: (completed / total) * 100
    - Handle edge case: module tanpa lessons return 0%
    - _Requirements: 11.3, 11.4, 16.1, 16.2, 16.3, 16.4_
  
  - [ ]* 3.6 Write property test untuk calculateModuleProgress()
    - **Property 23: Module Progress Calculation**
    - **Validates: Requirements 11.3, 11.4, 16.1, 16.2, 16.3, 16.4**
  
  - [ ] 3.7 Implementasi method isModuleUnlocked()
    - Cek apakah module adalah pertama di level (return true)
    - Query module sebelumnya berdasarkan week_number
    - Cek apakah module sebelumnya completed (progress 100%)
    - Return boolean
    - _Requirements: 3.1, 3.3, 3.4_
  
  - [ ]* 3.8 Write unit tests untuk ModuleService edge cases
    - Test module pertama selalu unlocked
    - Test module tanpa lessons (progress 0%)
    - Test search dengan empty query
    - _Requirements: 2.4, 3.4_

- [ ] 4. Checkpoint - Pastikan semua tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implementasi Service Layer - LessonService
  - [ ] 5.1 Implementasi method getLessonWithProgress()
    - Query lesson dengan module info dan quiz
    - Query user progress untuk lesson ini
    - Query previous lesson (order - 1) dan next lesson (order + 1)
    - Hitung lesson position dalam module untuk progress bar
    - Return array dengan lesson data dan metadata
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 11.2_
  
  - [ ]* 5.2 Write property test untuk getLessonWithProgress()
    - **Property 8: Lesson Progress Bar Calculation**
    - **Property 10: Lesson Navigation**
    - **Validates: Requirements 5.1, 5.4, 5.5**
  
  - [ ] 5.3 Implementasi method markAsComplete()
    - Validate lesson exists dan user authorized
    - Create atau update Progress record dengan completed_at dan score
    - Dispatch LessonCompleted event (queued)
    - Return progress model
    - _Requirements: 5.7, 11.1, 13.1_
  
  - [ ]* 5.4 Write property test untuk markAsComplete()
    - **Property 11: Lesson Completion Persistence**
    - **Property 26: Lesson Completion Event Dispatch**
    - **Validates: Requirements 5.7, 11.1, 13.1**
  
  - [ ] 5.5 Implementasi method isLessonUnlocked()
    - Cek apakah lesson adalah pertama di module (return true)
    - Query lesson sebelumnya berdasarkan order
    - Cek apakah lesson sebelumnya completed (progress exists dengan completed_at)
    - Return boolean
    - _Requirements: 4.3, 4.4_
  
  - [ ]* 5.6 Write unit tests untuk LessonService edge cases
    - Test lesson pertama selalu unlocked
    - Test lesson terakhir (no next lesson)
    - Test navigation boundaries
    - _Requirements: 4.3, 5.4, 5.5_

- [ ] 6. Implementasi Service Layer - QuizService
  - [ ] 6.1 Implementasi method getQuizWithQuestions()
    - Query quiz dengan questions dan lesson info
    - Optional: shuffle options untuk multiple choice
    - Return array dengan quiz data dan questions
    - _Requirements: 6.1, 7.1, 8.1_
  
  - [ ]* 6.2 Write property test untuk getQuizWithQuestions()
    - **Property 12: Multiple Choice Quiz Rendering**
    - **Property 14: Typing Quiz Rendering**
    - **Property 15: Listening Quiz Rendering**
    - **Validates: Requirements 6.1, 7.1, 8.1, 8.3**
  
  - [ ] 6.3 Implementasi method validateAnswer()
    - Untuk multiple choice: exact match dengan correct_answer
    - Untuk typing/listening: case-insensitive, trimmed match
    - Return boolean
    - _Requirements: 6.3, 6.4, 6.5, 7.3_
  
  - [ ]* 6.4 Write property test untuk validateAnswer()
    - **Property 13: Quiz Answer Validation**
    - **Validates: Requirements 6.3, 6.4, 6.5, 7.3**
  
  - [ ] 6.5 Implementasi method calculateXP()
    - Formula: (score / 100) * totalQuestions * 10
    - Return XP sebagai integer
    - _Requirements: 12.2_
  
  - [ ]* 6.6 Write property test untuk calculateXP()
    - **Property 25: XP Calculation from Quiz Score**
    - **Validates: Requirements 12.2**
  
  - [ ] 6.7 Implementasi method submitQuiz()
    - Query quiz dengan questions dan correct answers
    - Validate setiap answer menggunakan validateAnswer()
    - Hitung score: (correct / total) * 100
    - Hitung XP menggunakan calculateXP()
    - Create Attempt record
    - Dispatch QuizCompleted event (queued)
    - Return result array dengan score, xp, breakdown
    - _Requirements: 10.1, 10.2, 10.3, 12.1, 12.3, 13.2_
  
  - [ ]* 6.8 Write property test untuk submitQuiz()
    - **Property 18: Quiz Score Calculation**
    - **Property 24: Quiz Attempt Persistence**
    - **Property 27: Quiz Completion Event Dispatch**
    - **Validates: Requirements 10.1, 12.1, 12.3, 13.2**
  
  - [ ]* 6.9 Write unit tests untuk QuizService edge cases
    - Test quiz tanpa questions (score 0)
    - Test empty answer validation
    - Test retry (multiple attempts)
    - _Requirements: 10.5, 12.3, 12.4, 15.1_

- [ ] 7. Checkpoint - Pastikan semua service tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implementasi Events
  - [ ] 8.1 Buat LessonCompleted event class
    - Implement ShouldQueue interface
    - Constructor menerima User, Lesson, Progress
    - Setup SerializesModels trait
    - _Requirements: 13.1, 13.4_
  
  - [ ] 8.2 Buat QuizCompleted event class
    - Implement ShouldQueue interface
    - Constructor menerima User, Quiz, Attempt
    - Setup SerializesModels trait
    - _Requirements: 13.2, 13.4_
  
  - [ ]* 8.3 Write unit tests untuk event dispatching
    - Test LessonCompleted event dispatched dengan correct data
    - Test QuizCompleted event dispatched dengan correct data
    - Test events are queued (asynchronous)
    - _Requirements: 13.1, 13.2, 13.4_

- [ ] 9. Implementasi Middleware
  - [ ] 9.1 Buat SubscriptionMiddleware
    - Extract level dari route parameter atau query string
    - Validate user subscription status
    - Free user + level != N3 → reject dengan 403
    - Premium user atau level == N3 → allow
    - Return appropriate response atau next($request)
    - _Requirements: 1.3, 1.4, 14.3, 14.4_
  
  - [ ]* 9.2 Write property test untuk SubscriptionMiddleware
    - **Property 1: Subscription-Based Level Access Control**
    - **Validates: Requirements 1.3, 1.4**
  
  - [ ] 9.3 Konfigurasi RoleMiddleware di routes
    - Setup middleware group: ['auth', 'role:student', 'subscription']
    - Apply ke semua routes pembelajaran
    - _Requirements: 14.1, 14.2_
  
  - [ ]* 9.4 Write unit tests untuk middleware chain
    - Test non-authenticated user → 401
    - Test non-student user → 403
    - Test free user akses N5 → 403
    - Test premium user akses N5 → 200
    - _Requirements: 14.1, 14.2_

- [ ] 10. Implementasi Controllers - ModuleController
  - [ ] 10.1 Implementasi method index()
    - Get authenticated user dari auth()
    - Extract level filter dari request query
    - Extract search query dari request query
    - Call moduleService->getAccessibleModules()
    - Filter modules berdasarkan search query jika ada
    - Return Inertia::render('Modules/Index', [...])
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.4_
  
  - [ ]* 10.2 Write property test untuk ModuleController index
    - **Property 2: Module List Filtering by Level**
    - **Property 4: Search Filter Accuracy**
    - **Validates: Requirements 2.2, 2.4**
  
  - [ ] 10.3 Implementasi method show()
    - Get authenticated user dari auth()
    - Validate module ID exists
    - Call moduleService->getModuleWithLessons()
    - Return Inertia::render('Modules/Show', [...])
    - _Requirements: 4.1, 4.2, 15.2_
  
  - [ ]* 10.4 Write unit tests untuk ModuleController
    - Test invalid module ID → 404
    - Test module detail response structure
    - _Requirements: 15.2, 15.4_

- [ ] 11. Implementasi Controllers - LessonController
  - [ ] 11.1 Implementasi method show()
    - Get authenticated user dari auth()
    - Validate lesson ID exists
    - Call lessonService->getLessonWithProgress()
    - Return Inertia::render('Lessons/Show', [...])
    - _Requirements: 5.1, 5.2, 15.2_
  
  - [ ] 11.2 Implementasi method complete()
    - Get authenticated user dari auth()
    - Validate lesson ID exists
    - Call lessonService->markAsComplete()
    - Redirect back dengan success message
    - _Requirements: 5.7, 11.1_
  
  - [ ]* 11.3 Write unit tests untuk LessonController
    - Test invalid lesson ID → 404
    - Test complete lesson success flow
    - Test lesson response structure
    - _Requirements: 5.7, 11.1, 15.2_

- [ ] 12. Implementasi Controllers - QuizController
  - [ ] 12.1 Implementasi method show()
    - Get authenticated user dari auth()
    - Validate quiz ID exists
    - Call quizService->getQuizWithQuestions()
    - Return Inertia::render('Quizzes/Show', [...])
    - _Requirements: 6.1, 7.1, 8.1, 15.2_
  
  - [ ] 12.2 Buat SubmitQuizRequest untuk validasi
    - Validate answers array not empty
    - Validate setiap answer not empty
    - Custom error messages dalam Bahasa Indonesia
    - _Requirements: 15.1, 15.4_
  
  - [ ] 12.3 Implementasi method submit()
    - Get authenticated user dari auth()
    - Validate quiz ID exists
    - Validate request menggunakan SubmitQuizRequest
    - Call quizService->submitQuiz()
    - Return Inertia::render('Quizzes/Result', [...])
    - _Requirements: 10.1, 10.2, 10.3, 12.1, 15.1_
  
  - [ ]* 12.4 Write unit tests untuk QuizController
    - Test invalid quiz ID → 404
    - Test empty answers → 422
    - Test submit quiz success flow
    - Test result response structure
    - _Requirements: 10.1, 15.1, 15.2, 15.4_

- [ ] 13. Checkpoint - Pastikan semua backend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implementasi Frontend Components - Shared Components
  - [ ] 14.1 Buat ProgressBar component
    - Props: current, total, showPercentage
    - Hitung percentage dan render progress bar dengan Tailwind
    - _Requirements: 2.3, 4.1, 5.1_
  
  - [ ] 14.2 Buat ModuleCard component
    - Props: module, progress, status, onClick
    - Render card dengan title, week, description
    - Render ProgressBar component
    - Render status badge (locked/unlocked/completed)
    - Handle click (disabled jika locked)
    - _Requirements: 2.3, 2.5_
  
  - [ ] 14.3 Buat LessonItem component
    - Props: lesson, status, onStart, onContinue
    - Render lesson info (title, duration, XP)
    - Render status icon
    - Render appropriate button (Start/Continue/Completed)
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ] 14.4 Buat QuestionRenderer component
    - Props: question, type, value, onChange, disabled
    - Render berdasarkan type:
      - multiple_choice: radio buttons dengan 4 options
      - typing: text input field
      - listening: audio player + text input field
    - _Requirements: 6.1, 6.2, 7.1, 7.2, 8.1, 8.3_

- [ ] 15. Implementasi Frontend Pages - Modules/Index
  - [ ] 15.1 Buat Modules/Index.tsx page
    - Props: levels, modules, userSubscription
    - State: selectedLevel, searchQuery
    - Render level tabs (filter berdasarkan userSubscription)
    - Render search input dengan debounce
    - Filter modules berdasarkan selectedLevel dan searchQuery
    - Render ModuleCard components dalam grid
    - Handle click module card → navigate ke /modules/{id}
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ]* 15.2 Write unit tests untuk Modules/Index
    - Test level tabs rendering berdasarkan subscription
    - Test search filtering
    - Test module card click navigation
    - _Requirements: 1.1, 1.2, 2.4_

- [ ] 16. Implementasi Frontend Pages - Modules/Show
  - [ ] 16.1 Buat Modules/Show.tsx page
    - Props: module, lessons, progress
    - Render module header dengan title, description
    - Render ProgressBar dengan progress percentage
    - Render lessons list menggunakan LessonItem components
    - Handle click lesson → navigate ke /lessons/{id}
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_
  
  - [ ]* 16.2 Write unit tests untuk Modules/Show
    - Test module header rendering
    - Test lessons list rendering dengan berbagai status
    - Test lesson click navigation
    - _Requirements: 4.1, 4.2_

- [ ] 17. Implementasi Frontend Pages - Lessons/Show
  - [ ] 17.1 Buat Lessons/Show.tsx page
    - Props: lesson, module, previousLesson, nextLesson, progress
    - Render ProgressBar untuk lesson position dalam module
    - Render lesson content (parse JSON dan render text/images/audio)
    - Render navigation buttons (Previous/Next)
    - Render Take Quiz button jika lesson punya quiz
    - Render Mark as Complete button
    - Handle mark complete → POST /lessons/{id}/complete
    - Handle navigation → navigate ke previous/next lesson
    - Handle take quiz → navigate ke /quizzes/{quizId}
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_
  
  - [ ]* 17.2 Write unit tests untuk Lessons/Show
    - Test content rendering untuk berbagai format
    - Test navigation buttons (enabled/disabled)
    - Test mark complete functionality
    - _Requirements: 5.2, 5.4, 5.5, 5.7_

- [ ] 18. Implementasi Frontend Pages - Quizzes/Show
  - [ ] 18.1 Buat Quizzes/Show.tsx page
    - Props: quiz, questions, lesson
    - State: currentQuestionIndex, answers, timeRemaining
    - Render progress indicator (question X of Y)
    - Render timer jika quiz.time_limit exists (countdown)
    - Render QuestionRenderer untuk current question
    - Handle answer change → update answers state
    - Handle next question → increment currentQuestionIndex
    - Handle previous question → decrement currentQuestionIndex
    - Handle submit → POST /quizzes/{id}/submit dengan answers
    - Handle timer timeout → auto submit
    - _Requirements: 6.1, 6.2, 7.1, 7.2, 8.1, 8.3, 9.1, 9.2, 9.3_
  
  - [ ]* 18.2 Write unit tests untuk Quizzes/Show
    - Test question navigation
    - Test answer state management
    - Test timer countdown
    - Test auto-submit on timeout
    - _Requirements: 6.2, 7.2, 9.1, 9.2_

- [ ] 19. Implementasi Frontend Pages - Quizzes/Result
  - [ ] 19.1 Buat Quizzes/Result.tsx page
    - Props: quiz, attempt, breakdown, nextLesson
    - Render score dan XP earned dengan visual feedback
    - Render breakdown per question:
      - Question text
      - User answer vs correct answer
      - Correct/incorrect indicator
      - Explanation
    - Render Retry button → navigate ke /quizzes/{id}
    - Render Next Lesson button → navigate ke /lessons/{nextLessonId}
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [ ]* 19.2 Write unit tests untuk Quizzes/Result
    - Test result rendering
    - Test breakdown rendering
    - Test retry navigation
    - Test next lesson navigation
    - _Requirements: 10.2, 10.3, 10.5, 10.6_

- [ ] 20. Checkpoint - Pastikan semua frontend tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Implementasi Validasi dan Error Handling
  - [ ] 21.1 Tambahkan validation rules di SubmitQuizRequest
    - Validate answers array required
    - Validate setiap answer required dan not empty
    - Custom messages dalam Bahasa Indonesia
    - _Requirements: 15.1, 15.4_
  
  - [ ] 21.2 Tambahkan error handling di controllers
    - Catch ModelNotFoundException → return 404
    - Catch ValidationException → return 422 dengan errors
    - Catch AuthorizationException → return 403
    - Format error responses konsisten
    - _Requirements: 15.2, 15.4_
  
  - [ ] 21.3 Tambahkan error handling di frontend
    - Display validation errors di form
    - Display error messages dari backend
    - Handle 403 errors → show upgrade modal untuk free users
    - Handle 404 errors → redirect ke modules list
    - _Requirements: 1.3, 15.4_
  
  - [ ]* 21.4 Write unit tests untuk error handling
    - Test validation errors display
    - Test 404 handling
    - Test 403 handling untuk free users
    - _Requirements: 1.3, 15.1, 15.2, 15.4_

- [ ] 22. Integrasi dan Wiring
  - [ ] 22.1 Setup routes di routes/web.php
    - Route group dengan middleware ['auth', 'role:student', 'subscription']
    - GET /modules → ModuleController@index
    - GET /modules/{id} → ModuleController@show
    - GET /lessons/{id} → LessonController@show
    - POST /lessons/{id}/complete → LessonController@complete
    - GET /quizzes/{id} → QuizController@show
    - POST /quizzes/{id}/submit → QuizController@submit
    - _Requirements: 14.1, 14.2_
  
  - [ ] 22.2 Setup Inertia shared data di HandleInertiaRequests middleware
    - Share auth.user dengan subscription_status
    - Share accessible levels berdasarkan subscription
    - _Requirements: 1.1, 1.2_
  
  - [ ] 22.3 Register events dan listeners di EventServiceProvider
    - Register LessonCompleted event (jika ada listener)
    - Register QuizCompleted event (jika ada listener)
    - _Requirements: 13.1, 13.2_
  
  - [ ]* 22.4 Write integration tests untuk complete user flows
    - Test flow: modules list → module detail → lesson → quiz → result
    - Test flow: free user akses N3 → success
    - Test flow: free user akses N5 → 403
    - Test flow: complete lesson → event dispatched
    - Test flow: submit quiz → attempt saved → event dispatched
    - _Requirements: 1.1, 1.3, 5.7, 10.1, 11.1, 12.1, 13.1, 13.2_

- [ ] 23. Final Checkpoint - Pastikan semua tests pass dan integrasi berjalan
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked dengan `*` adalah optional dan dapat di-skip untuk MVP lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Checkpoints memastikan validasi incremental
- Property tests memvalidasi universal correctness properties
- Unit tests memvalidasi specific examples dan edge cases
- Integration tests memvalidasi end-to-end flows
