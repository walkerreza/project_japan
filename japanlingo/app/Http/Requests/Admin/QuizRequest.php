<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class QuizRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'lesson_id'  => 'required|exists:lessons,id',
            'type'       => 'required|in:multiple_choice,typing,listening',
            'time_limit' => 'nullable|integer|min:0',
        ];
    }

    /**
     * Pesan error custom Bahasa Indonesia.
     */
    public function messages(): array
    {
        return [
            'lesson_id.required' => 'Materi pelajaran (lesson) wajib dipilih.',
            'lesson_id.exists'   => 'Materi pelajaran yang dipilih tidak valid di sistem.',
            'type.required'      => 'Tipe kuis wajib ditentukan.',
            'type.in'            => 'Tipe kuis hanya boleh: Pilihan Ganda, Mengetik, atau Mendengarkan.',
            'time_limit.integer' => 'Batas waktu harus berupa angka bulat (dalam satuan detik).',
            'time_limit.min'     => 'Batas waktu minimal adalah 0 (tanpa batas).',
        ];
    }
}
