<?php

namespace Tests\Feature;

use App\Models\Note;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NoteApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_only_sees_their_notes(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        Note::factory()->count(2)->create(['user_id' => $user->id]);
        Note::factory()->count(1)->create(['user_id' => $otherUser->id]);

        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->getJson('/api/notes');

        $response
            ->assertOk()
            ->assertJsonCount(2);
    }

    public function test_user_can_create_update_and_delete_a_note(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $createResponse = $this->withToken($token)->postJson('/api/notes', [
            'title' => 'Prepare slides',
            'content' => 'Summarize architecture and tests.',
            'priority' => 'high',
        ]);

        $noteId = $createResponse->json('note.id');

        $createResponse
            ->assertCreated()
            ->assertJsonPath('note.title', 'Prepare slides');

        $this
            ->withToken($token)
            ->putJson("/api/notes/{$noteId}", [
                'title' => 'Prepare final slides',
                'content' => 'Add screenshots and manual test results.',
                'priority' => 'medium',
            ])
            ->assertOk()
            ->assertJsonPath('note.priority', 'medium');

        $this
            ->withToken($token)
            ->deleteJson("/api/notes/{$noteId}")
            ->assertOk();

        $this->assertDatabaseMissing('notes', ['id' => $noteId]);
    }
}
