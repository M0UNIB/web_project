<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {

        $notes = $request->user()

            ->notes()

            ->latest()

            ->get();

        return response()->json($notes);
    }

    public function store(Request $request): JsonResponse
    {

        $validated = $this->validateNote($request);

        $note = $request->user()->notes()->create($validated);

        return response()->json([

            'message' => 'Note created successfully.',

            'note' => $note,

        ], 201);
    }

    public function show(Request $request, Note $note): JsonResponse
    {

        $note = $this->resolveUserNote($request, $note);

        return response()->json($note);
    }

    public function update(Request $request, Note $note): JsonResponse
    {

        $note = $this->resolveUserNote($request, $note);

        $validated = $this->validateNote($request);

        $note->update($validated);

        return response()->json([

            'message' => 'Note updated successfully.',

            'note' => $note->fresh(),
        ]);
    }

    public function destroy(Request $request, Note $note): JsonResponse
    {

        $note = $this->resolveUserNote($request, $note);

        $note->delete();

        return response()->json([

            'message' => 'Note deleted successfully.',
        ]);
    }

    private function validateNote(Request $request): array
    {

        return $request->validate([

            'title' => ['required', 'string', 'max:100'],

            'content' => ['nullable', 'string'],

            'priority' => ['required', 'in:low,medium,high'],
        ]);
    }

    private function resolveUserNote(Request $request, Note $note): Note
    {

        abort_unless($note->user_id === $request->user()->id, 404);

        return $note;
    }
}
