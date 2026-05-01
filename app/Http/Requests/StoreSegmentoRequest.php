<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreSegmentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => [
                'required',
                'string',
                'max:100',
                Rule::unique('segmentos', 'nome')->where(fn ($q) => $q->where('user_id', Auth::id())),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.unique' => 'Já existe um segmento com este nome.',
        ];
    }
}
