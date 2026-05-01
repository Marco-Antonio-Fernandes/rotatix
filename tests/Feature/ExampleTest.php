<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_root_serves_spa_for_guests(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $response->assertViewIs('app');
    }
}
