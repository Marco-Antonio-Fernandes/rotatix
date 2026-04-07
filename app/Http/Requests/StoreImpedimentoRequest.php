<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreImpedimentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'empresa_id'   => ['required', 'exists:empresas,id'],
            'data'         => ['required', 'date'],
            'justificativa' => ['required', 'string', 'max:1000'],
        ];
    }
}
