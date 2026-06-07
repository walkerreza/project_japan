<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\Level;
use App\Models\Module;
use App\Models\Question;
use App\Models\Quiz;
use Illuminate\Database\Seeder;

class N3CourseSeeder extends Seeder
{
    public function run(): void
    {
        $level = Level::updateOrCreate(
            ['level_name' => 'JLPT N3'],
            ['stage' => 3, 'is_premium' => true]
        );

        $module = Module::updateOrCreate(
            ['level_id' => $level->id, 'week_number' => 1],
            [
                'title' => 'Minggu 1: Lingkungan Sekitar',
                'description' => 'Mempelajari kanji dan kosakata yang sering ditemui dalam kehidupan sehari-hari.',
                'status' => 'published',
            ]
        );

        $lesson = Lesson::updateOrCreate(
            ['module_id' => $module->id, 'order' => 1],
            [
                'title' => 'Hari 1: Di Supermarket',
                'type' => 'text',
                'content' => '<h2>Kosakata dan Kanji</h2><p>Berikut adalah beberapa kanji yang sering ditemui saat berbelanja.</p>',
                'duration_minutes' => 15,
                'status' => 'published',
            ]
        );

        $quiz = Quiz::updateOrCreate(
            ['lesson_id' => $lesson->id],
            ['type' => 'multiple_choice', 'time_limit' => 300, 'status' => 'published']
        );

        Question::updateOrCreate(
            ['quiz_id' => $quiz->id, 'order' => 1],
            [
                'type' => 'multiple_choice',
                'question_text' => 'Bagaimana cara baca dari kanji 割引?',
                'correct_answer' => 'waribiki',
                'options' => ['waribiki', 'katsubiki', 'warihei', 'waribatsu'],
                'explanation' => 'Waribiki artinya diskon.',
            ]
        );

        Question::updateOrCreate(
            ['quiz_id' => $quiz->id, 'order' => 2],
            [
                'type' => 'multiple_choice',
                'question_text' => 'Apa arti dari 半額?',
                'correct_answer' => 'Setengah harga',
                'options' => ['Setengah harga', 'Harga pas', 'Ganda', 'Habis'],
                'explanation' => 'Han (半) artinya setengah, gaku (額) artinya nominal atau harga.',
            ]
        );
    }
}
