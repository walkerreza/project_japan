<?php

use App\Models\PresentationDeck;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('admin can save a board slide inside a presentation deck', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $deck = PresentationDeck::create([
        'title' => 'N3 Review',
        'description' => 'Deck latihan N3',
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.presentations.builder.update', $deck), [
        'status' => 'published',
        'slides' => [
            [
                'id' => null,
                'title' => 'Board Kanji',
                'layout' => 'board',
                'content' => 'Latihan stroke order.',
                'media_url' => '',
                'background' => 'light',
                'accent_color' => '#E64A19',
                'speaker_notes' => '',
                'board_data' => [
                    'strokes' => [
                        [
                            'tool' => 'pen',
                            'color' => '#111827',
                            'size' => 5,
                            'points' => [
                                ['x' => 10, 'y' => 10],
                                ['x' => 20, 'y' => 20],
                            ],
                        ],
                    ],
                ],
                'snapshot_data' => 'data:image/png;base64,test',
            ],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('presentation_slides', [
        'presentation_deck_id' => $deck->id,
        'layout' => 'board',
        'title' => 'Board Kanji',
    ]);
    $this->assertDatabaseHas('teaching_boards', [
        'title' => 'Board Kanji',
        'status' => 'published',
    ]);
});

test('admin pptx import rejects non pptx files', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $deck = PresentationDeck::create([
        'title' => 'N3 Review',
        'description' => 'Deck latihan N3',
        'status' => 'draft',
    ]);

    $response = $this->actingAs($admin)->post(route('admin.presentations.import-pptx', $deck), [
        'pptx_file' => UploadedFile::fake()->create('materi.txt', 2, 'text/plain'),
    ]);

    $response->assertSessionHasErrors('pptx_file');
});
