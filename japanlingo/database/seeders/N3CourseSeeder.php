<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Level;
use App\Models\Module;
use App\Models\Lesson;
use App\Models\Quiz;
use App\Models\Question;

class N3CourseSeeder extends Seeder
{
    public function run(): void
    {
        $level = Level::create([
            'level_name' => 'JLPT N3',
            'stage' => 3
        ]);

        $module1 = Module::create([
            'level_id' => $level->id,
            'title' => 'Minggu 1: Lingkungan Sekitar',
            'week_number' => 1,
            'description' => 'Mempelajari kanji dan kosakata yang sering ditemui dalam kehidupan sehari-hari (supermarket, jalan, dsb).'
        ]);

        $lesson1 = Lesson::create([
            'module_id' => $module1->id,
            'title' => 'Hari 1: Di Supermarket',
            'content' => '<h2>Kosakata dan Kanji</h2><p>Berikut adalah beberapa huruf kanji yang sering kalian temui saat berbelanja...</p>',
            'order' => 1
        ]);

        $quiz1 = Quiz::create([
            'lesson_id' => $lesson1->id,
            'type' => 'multiple_choice'
        ]);

        Question::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'Bagaimana cara baca dari kanji 割引?',
            'correct_answer' => 'waribiki',
            'options' => ['waribiki', 'katsubiki', 'warihei', 'waribatsu'],
            'explanation' => 'Waribiki artinya adalah diskon.',
            'order' => 1
        ]);
        
        Question::create([
            'quiz_id' => $quiz1->id,
            'question_text' => 'Apa arti dari 半額?',
            'correct_answer' => 'Setengah harga',
            'options' => ['Setengah harga', 'Harga pas', 'Ganda', 'Habis'],
            'explanation' => 'Han (半) artinya setengah, gaku (額) artinya nominal/harga.',
            'order' => 2
        ]);
    }
}
