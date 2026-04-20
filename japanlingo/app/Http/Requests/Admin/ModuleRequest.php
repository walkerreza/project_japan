<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ModuleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Biasanya authorisasi role dihandle oleh middleware role:admin di Route.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'level_id'    => 'required|exists:levels,id',
            'title'       => 'required|string|max:255',
            'week_number' => 'required|integer|min:1',
            'description' => 'nullable|string',
        ];
    }

    /**
     * Dapatkan pesan validasi kustom (Bahasa Indonesia).
     */
    public function messages(): array
    {
        return [
            'level_id.required'    => 'Level wajib dipilih.',
            'level_id.exists'      => 'Level tidak valid atau tidak ditemukan di sistem.',
            'title.required'       => 'Judul modul tidak boleh kosong.',
            'title.max'            => 'Judul modul maksimal 255 karakter.',
            'week_number.required' => 'Nomor urut minggu wajib diisi.',
            'week_number.integer'  => 'Nomor urut minggu harus berupa angka bulat.',
            'week_number.min'      => 'Nomor urut minggu minimal harus 1.',
        ];
    }
}
