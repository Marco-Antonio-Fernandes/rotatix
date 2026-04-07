<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Substitui as anotações @NotBlank, @NotNull, @Size do Java (Bean Validation).
 * Equivalente ao DTO de entrada do Spring Boot.
 */
class StoreEmpresaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'razao_social'               => ['required', 'string', 'max:150'],
            'nome_fantasia'              => ['nullable', 'string', 'max:150'],
            'cnpj'                       => ['required', 'string', 'max:18', 'unique:empresas,cnpj'],
            'email'                      => ['nullable', 'email'],
            'telefone'                   => ['nullable', 'string'],
            'responsavel_tecnico'        => ['nullable', 'string'],
            'horas_semanais_acumuladas'  => ['sometimes', 'numeric', 'min:0'],
            'status_ciclo_concluido'     => ['sometimes', 'boolean'],
            'segmento_id'               => ['nullable', 'exists:segmentos,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'razao_social.required' => 'A razão social é obrigatória.',
            'cnpj.required'         => 'O CNPJ é obrigatório.',
            'cnpj.unique'           => 'Este CNPJ já está cadastrado.',
        ];
    }
}
