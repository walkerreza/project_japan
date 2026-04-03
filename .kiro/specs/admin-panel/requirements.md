# Requirements Document - Panel Admin

## Introduction

Panel Admin adalah antarmuka administrasi untuk platform pembelajaran bahasa Jepang Japanlingo yang memungkinkan admin (pengajar) untuk mengelola konten pembelajaran termasuk level JLPT, modul, lesson, quiz, dan pertanyaan. Panel ini dirancang khusus untuk admin tanpa fitur gamifikasi, fokus pada operasi CRUD dan manajemen konten.

## Glossary

- **Admin**: Pengajar yang mengelola konten pembelajaran di platform Japanlingo
- **Student**: Pengguna yang mengikuti pembelajaran (bukan target fitur ini)
- **JLPT**: Japanese Language Proficiency Test - sistem level bahasa Jepang (N5, N4, N3, N2, N1)
- **Module**: Unit pembelajaran yang berisi beberapa lesson, terkait dengan level JLPT dan week_number
- **Lesson**: Materi pembelajaran individual dalam sebuah module
- **Quiz**: Kumpulan pertanyaan yang terkait dengan lesson tertentu
- **Question**: Pertanyaan individual dalam quiz dengan tipe multiple choice, typing, atau listening
- **Progress**: Catatan penyelesaian lesson oleh student
- **Attempt**: Catatan percobaan quiz oleh student
- **Dashboard**: Halaman overview yang menampilkan statistik dan quick actions
- **Rich_Text_Content**: Konten lesson dalam format JSON atau rich text
- **Dependency**: Relasi antar entitas yang mencegah penghapusan (contoh: module dengan lessons)

## Requirements

### Requirement 1: Autentikasi dan Otorisasi Admin

**User Story:** Sebagai admin, saya ingin mengakses panel admin yang aman, sehingga hanya admin dan superadmin yang dapat mengelola konten pembelajaran.

#### Acceptance Criteria

1. WHEN a user attempts to access admin panel routes, THE System SHALL verify the user has role 'admin' or 'superadmin'
2. IF a user does not have role 'admin' or 'superadmin', THEN THE System SHALL redirect to unauthorized page with error message
3. THE System SHALL apply RoleMiddleware to all admin panel routes
4. THE System SHALL NOT apply SubscriptionMiddleware to admin panel routes

### Requirement 2: Dashboard Admin

**User Story:** Sebagai admin, saya ingin melihat overview statistik konten, sehingga saya dapat memantau jumlah konten yang telah dibuat dan aktivitas terkini.

#### Acceptance Criteria

1. WHEN an admin accesses the dashboard, THE System SHALL display total count of modules
2. WHEN an admin accesses the dashboard, THE System SHALL display total count of lessons
3. WHEN an admin accesses the dashboard, THE System SHALL display total count of quizzes
4. WHEN an admin accesses the dashboard, THE System SHALL display total count of questions
5. WHEN an admin accesses the dashboard, THE System SHALL display recent activities (last 10 content creations/updates)
6. WHEN an admin accesses the dashboard, THE System SHALL provide quick action buttons to create new module, lesson, quiz, or question
7. THE Dashboard SHALL NOT display gamification elements (XP, streak, achievements)

### Requirement 3: Manajemen Level JLPT

**User Story:** Sebagai admin, saya ingin mengelola level JLPT, sehingga saya dapat melihat dan mengatur properti level serta modul yang terkait.

#### Acceptance Criteria

1. WHEN an admin accesses level management, THE System SHALL display list of all JLPT levels (N5, N4, N3, N2, N1)
2. WHEN an admin views a level, THE System SHALL display level properties (level_name, stage)
3. WHEN an admin views a level, THE System SHALL display count of modules associated with that level
4. WHEN an admin clicks on a level, THE System SHALL navigate to modules filtered by that level
5. WHEN an admin updates level properties, THE System SHALL validate and save the changes

### Requirement 4: Manajemen Modul - Operasi Dasar

**User Story:** Sebagai admin, saya ingin melakukan operasi CRUD pada modul, sehingga saya dapat membuat, melihat, mengubah, dan menghapus modul pembelajaran.

#### Acceptance Criteria

1. WHEN a admin accesses module management, THE System SHALL display list of all modules with pagination
2. WHERE a level filter is applied, THE System SHALL display only modules belonging to that level
3. WHEN a admin creates a module, THE System SHALL require title, week_number, description, and level_id
4. WHEN a admin creates a module with valid data, THE System SHALL save the module and display success message
5. WHEN a admin creates a module with invalid data, THE System SHALL display validation errors in Bahasa Indonesia
6. WHEN a admin updates a module, THE System SHALL validate and save the changes
7. WHEN a admin views a module, THE System SHALL display all lessons within that module
8. WHEN a admin attempts to delete a module with existing lessons, THE System SHALL prevent deletion and display error message
9. WHEN a admin attempts to delete a module without lessons, THE System SHALL show confirmation dialog
10. IF admin confirms deletion, THEN THE System SHALL delete the module and display success message

### Requirement 5: Manajemen Lesson - Operasi Dasar

**User Story:** Sebagai admin, saya ingin melakukan operasi CRUD pada lesson, sehingga saya dapat membuat, melihat, mengubah, dan menghapus materi pembelajaran.

#### Acceptance Criteria

1. WHEN a admin accesses lesson management, THE System SHALL display list of all lessons with pagination
2. WHERE a module filter is applied, THE System SHALL display only lessons belonging to that module
3. WHEN a admin creates a lesson, THE System SHALL require title, content, order, and module_id
4. WHEN a admin creates a lesson with valid data, THE System SHALL save the lesson and display success message
5. WHEN a admin creates a lesson with invalid data, THE System SHALL display validation errors in Bahasa Indonesia
6. WHEN a admin updates a lesson, THE System SHALL validate and save the changes
7. WHEN a admin views a lesson, THE System SHALL display associated quiz if exists
8. WHEN a admin attempts to delete a lesson with existing quiz, THE System SHALL prevent deletion and display error message
9. WHEN a admin attempts to delete a lesson with student progress records, THE System SHALL prevent deletion and display error message
10. WHEN a admin attempts to delete a lesson without dependencies, THE System SHALL show confirmation dialog
11. IF admin confirms deletion, THEN THE System SHALL delete the lesson and display success message

### Requirement 6: Manajemen Lesson - Pengurutan dan Attachment

**User Story:** Sebagai admin, saya ingin mengatur urutan lesson dan melampirkan quiz, sehingga konten pembelajaran tersusun dengan baik.

#### Acceptance Criteria

1. WHEN a admin reorders lessons within a module, THE System SHALL update the order field for affected lessons
2. WHEN a admin reorders lessons, THE System SHALL maintain order consistency (no duplicate order values within same module)
3. WHEN a admin attaches a quiz to a lesson, THE System SHALL validate that the quiz exists
4. WHEN a admin attaches a quiz to a lesson, THE System SHALL update the lesson_id field in the quiz record
5. WHEN a admin detaches a quiz from a lesson, THE System SHALL set lesson_id to null in the quiz record

### Requirement 7: Manajemen Quiz - Operasi Dasar

**User Story:** Sebagai admin, saya ingin melakukan operasi CRUD pada quiz, sehingga saya dapat membuat, melihat, mengubah, dan menghapus kuis pembelajaran.

#### Acceptance Criteria

1. WHEN a admin accesses quiz management, THE System SHALL display list of all quizzes with pagination
2. WHERE a lesson filter is applied, THE System SHALL display only quizzes belonging to that lesson
3. WHEN a admin creates a quiz, THE System SHALL require lesson_id and type (multiple_choice, typing, or listening)
4. WHEN a admin creates a quiz, THE System SHALL accept optional time_limit field
5. WHEN a admin creates a quiz with valid data, THE System SHALL save the quiz and display success message
6. WHEN a admin creates a quiz with invalid data, THE System SHALL display validation errors in Bahasa Indonesia
7. WHEN a admin updates a quiz, THE System SHALL validate and save the changes
8. WHEN a admin views a quiz, THE System SHALL display all questions within that quiz
9. WHEN a admin attempts to delete a quiz with student attempt records, THE System SHALL prevent deletion and display error message
10. WHEN a admin attempts to delete a quiz without attempts, THE System SHALL show confirmation dialog
11. IF admin confirms deletion, THEN THE System SHALL delete the quiz and display success message

### Requirement 8: Manajemen Question - Operasi Dasar

**User Story:** Sebagai admin, saya ingin melakukan operasi CRUD pada pertanyaan, sehingga saya dapat membuat, melihat, mengubah, dan menghapus pertanyaan dalam quiz.

#### Acceptance Criteria

1. WHEN a admin accesses question management, THE System SHALL display list of all questions with pagination
2. WHERE a quiz filter is applied, THE System SHALL display only questions belonging to that quiz
3. WHEN a admin creates a question, THE System SHALL require quiz_id, question_text, and correct_answer
4. WHEN a admin creates a multiple_choice question, THE System SHALL require options field in JSON format
5. WHEN a admin creates a listening question, THE System SHALL accept optional audio_url field
6. WHEN a admin creates a question, THE System SHALL accept optional explanation field
7. WHEN a admin creates a question with valid data, THE System SHALL save the question and display success message
8. WHEN a admin creates a question with invalid data, THE System SHALL display validation errors in Bahasa Indonesia
9. WHEN a admin updates a question, THE System SHALL validate and save the changes
10. WHEN a admin attempts to delete a question, THE System SHALL show confirmation dialog
11. IF admin confirms deletion, THEN THE System SHALL delete the question and display success message

### Requirement 9: Manajemen Question - Pengurutan dan Bulk Import

**User Story:** Sebagai admin, saya ingin mengatur urutan pertanyaan dan mengimpor pertanyaan secara massal, sehingga pembuatan quiz lebih efisien.

#### Acceptance Criteria

1. WHEN a admin reorders questions within a quiz, THE System SHALL update the order field for affected questions
2. WHEN a admin reorders questions, THE System SHALL maintain order consistency (no duplicate order values within same quiz)
3. WHEN a admin uploads a CSV file for bulk import, THE System SHALL validate the file format
4. WHEN a admin uploads a JSON file for bulk import, THE System SHALL validate the file format
5. WHEN bulk import file is valid, THE System SHALL create all questions and display success message with count
6. WHEN bulk import file contains invalid data, THE System SHALL display validation errors with line numbers
7. WHEN bulk import is successful, THE System SHALL assign sequential order values to imported questions

### Requirement 10: Preview Content

**User Story:** Sebagai admin, saya ingin melihat preview konten sebagai student, sehingga saya dapat memastikan konten ditampilkan dengan benar sebelum dipublikasikan.

#### Acceptance Criteria

1. WHEN a admin clicks preview on a lesson, THE System SHALL display the lesson content in student view mode
2. WHEN a admin clicks preview on a quiz, THE System SHALL display the quiz in student view mode
3. WHEN a admin previews a quiz, THE System SHALL allow admin to interact with questions
4. WHEN a admin submits a preview quiz, THE System SHALL show results without saving to attempts table
5. WHEN a admin exits preview mode, THE System SHALL return to admin panel view

### Requirement 11: Validasi Input

**User Story:** Sebagai admin, saya ingin mendapatkan feedback validasi yang jelas, sehingga saya dapat memperbaiki input yang salah dengan mudah.

#### Acceptance Criteria

1. WHEN a admin submits a form with empty required fields, THE System SHALL display error message "Field [nama field] wajib diisi"
2. WHEN a admin submits a form with invalid format, THE System SHALL display error message describing the correct format
3. WHEN a admin submits a form with text exceeding maximum length, THE System SHALL display error message "Field [nama field] maksimal [N] karakter"
4. WHEN a admin submits a form with invalid JSON in options field, THE System SHALL display error message "Format JSON tidak valid"
5. WHEN a admin submits a form with invalid level_id, THE System SHALL display error message "Level tidak ditemukan"
6. WHEN a admin submits a form with invalid module_id, THE System SHALL display error message "Module tidak ditemukan"
7. WHEN a admin submits a form with invalid quiz_id, THE System SHALL display error message "Quiz tidak ditemukan"
8. THE System SHALL display all validation errors in Bahasa Indonesia

### Requirement 12: Error Handling untuk Dependency

**User Story:** Sebagai admin, saya ingin mendapatkan pesan error yang jelas saat mencoba menghapus konten yang memiliki dependency, sehingga saya memahami mengapa penghapusan tidak dapat dilakukan.

#### Acceptance Criteria

1. WHEN a admin attempts to delete a module with lessons, THE System SHALL display error message "Module tidak dapat dihapus karena masih memiliki [N] lesson"
2. WHEN a admin attempts to delete a lesson with quiz, THE System SHALL display error message "Lesson tidak dapat dihapus karena masih memiliki quiz"
3. WHEN a admin attempts to delete a lesson with progress records, THE System SHALL display error message "Lesson tidak dapat dihapus karena sudah ada student yang menyelesaikannya"
4. WHEN a admin attempts to delete a quiz with attempts, THE System SHALL display error message "Quiz tidak dapat dihapus karena sudah ada student yang mencobanya"
5. THE System SHALL display all error messages in Bahasa Indonesia

### Requirement 13: Confirmation Dialog

**User Story:** Sebagai admin, saya ingin mendapatkan konfirmasi sebelum menghapus konten, sehingga saya tidak menghapus konten secara tidak sengaja.

#### Acceptance Criteria

1. WHEN a admin clicks delete button, THE System SHALL display confirmation dialog
2. THE Confirmation_Dialog SHALL display message "Apakah Anda yakin ingin menghapus [tipe konten] ini?"
3. THE Confirmation_Dialog SHALL provide "Batal" and "Hapus" buttons
4. WHEN admin clicks "Batal", THE System SHALL close dialog without deleting
5. WHEN admin clicks "Hapus", THE System SHALL proceed with deletion
6. THE System SHALL display all dialog text in Bahasa Indonesia

### Requirement 14: User Interface dan User Experience

**User Story:** Sebagai admin, saya ingin antarmuka yang user-friendly dan responsif, sehingga saya dapat mengelola konten dengan mudah dan efisien.

#### Acceptance Criteria

1. WHEN a admin performs any action, THE System SHALL provide visual feedback (loading spinner, success message, or error message)
2. WHEN a admin successfully creates or updates content, THE System SHALL display success message for 3 seconds
3. WHEN a admin encounters an error, THE System SHALL display error message until dismissed
4. THE System SHALL use consistent styling across all admin panel pages
5. THE System SHALL display forms with clear labels in Bahasa Indonesia
6. THE System SHALL display tables with sortable columns where applicable
7. THE System SHALL implement pagination for lists with more than 20 items
8. THE System SHALL provide breadcrumb navigation for nested content (Level > Module > Lesson > Quiz > Question)
