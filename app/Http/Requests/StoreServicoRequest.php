<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreServicoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'segmento_id' => [
                'required',
                Rule::exists('segmentos', 'id')->where(function ($query) {
                    $u = Auth::user();
                    if ($u === null || $u->perfil === 'admin') {
                        return;
                    }
                    $query->where('user_id', $u->id);
                }),
            ],
            'nome'  => ['required', 'string', 'max:150'],
            'horas' => ['sometimes', 'numeric', 'min:0'],
        ];
    }
}
