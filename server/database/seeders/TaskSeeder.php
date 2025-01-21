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
        $userIds = \App\Models\User::pluck('id')->toArray();
    
        if (empty($userIds)) {
            // If no users exist, we can't assign an `assigned_user_id`
            // You could add a fallback here, for example, setting a default user id or skipping insertion.
            throw new \Exception('No users found in the database.');
        }

        for ($i = 1; $i <= 10; $i++) {
            DB::table('tasks')->insert([
                'title' => 'Task ' . $i,
                'description' => 'This is a description for Task ' . $i,
                'due_date' => now()->addDays(rand(1, 30)),
                'assigned_user_id' => $userIds[array_rand($userIds)], // Randomly assign a user ID
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
