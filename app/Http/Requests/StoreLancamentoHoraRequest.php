<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLancamentoHoraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'empresa_id' => ['required', 'exists:empresas,id'],
            'data'       => ['required', 'date'],
            'horas'      => ['required', 'numeric', 'min:0.1', 'max:24'],
            'servico'    => ['nullable', 'string', 'max:255'],
        ];
    }
}
