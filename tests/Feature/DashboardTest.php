<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('customer users cant visit the admin dashboard', function () {
    $this->actingAs($user = User::factory()->create(['role' => 'customer']));

    $this->get(route('dashboard'))->assertStatus(302);
});

test('admins can visit the admin dashboard', function () {
    $this->actingAs($user = User::factory()->create(['role' => 'admin']));

    $response = $this->get(route('admin.dashboard'));

    $response->assertOk();
});
