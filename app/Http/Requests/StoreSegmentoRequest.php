<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSegmentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:100', 'unique:segmentos,nome'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.unique' => 'Já existe um segmento com este nome.',
        ];
    }
}
