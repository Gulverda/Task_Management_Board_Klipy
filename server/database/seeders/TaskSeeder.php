<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = ['To Do', 'In Progress', 'Done'];

        for ($i = 1; $i <= 10; $i++) {
            DB::table('tasks')->insert([
                'title' => 'Task ' . $i,
                'description' => 'This is a description for Task ' . $i,
                'status' => $statuses[array_rand($statuses)],
                'due_date' => now()->addDays(rand(1, 30)),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
