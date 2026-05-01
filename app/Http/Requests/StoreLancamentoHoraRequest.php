<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreLancamentoHoraRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'empresa_id' => [
                'required',
                Rule::exists('empresas', 'id')->where(function ($query) {
                    $u = Auth::user();
                    if ($u === null || $u->perfil === 'admin') {
                        return;
                    }
                    $query->whereExists(function ($sub) use ($u) {
                        $sub->selectRaw('1')
                            ->from('segmentos')
                            ->whereColumn('segmentos.id', 'empresas.segmento_id')
                            ->where('segmentos.user_id', $u->id);
                    });
                }),
            ],
            'data'       => ['required', 'date'],
            'horas'      => ['required', 'numeric', 'min:0.1', 'max:24'],
            'servico'    => ['nullable', 'string', 'max:255'],
        ];
    }
}
