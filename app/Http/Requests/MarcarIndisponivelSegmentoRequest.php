<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MarcarIndisponivelSegmentoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'justificativa' => ['required', 'string', 'min:3', 'max:2000'],
        ];
    }
}
