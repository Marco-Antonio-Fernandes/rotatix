<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(User::all(['id', 'name', 'email', 'perfil']));
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'perfil'   => $request->perfil,
        ]);

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'store',
            'tabela'      => 'users',
            'registro_id' => $user->id,
        ]);

        return response()->json($user, 201);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->id === Auth::id()) {
            abort(422, 'Não é possível remover o próprio usuário.');
        }

        AuditLog::create([
            'user_id'     => Auth::id(),
            'acao'        => 'destroy',
            'tabela'      => 'users',
            'registro_id' => $user->id,
        ]);

        $user->delete();

        return response()->json(null, 204);
    }
}
