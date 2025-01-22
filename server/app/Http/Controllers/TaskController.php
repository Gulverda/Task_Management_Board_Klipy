<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        // Return tasks assigned to the authenticated user
        return Task::where('assigned_user_id', $user->id)->get();

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:todo,in_progress,done',
        ]);

        $validated['assigned_user_id'] = $user->id;

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'status' => 'nullable|in:todo,in_progress,done',
        ]);

        if (isset($validated['title'])) {
            $task->title = $validated['title'];
        }

        if (isset($validated['description'])) {
            $task->description = $validated['description'];
        }

        if (isset($validated['due_date'])) {
            $task->due_date = $validated['due_date'];
        }

        if (isset($validated['status'])) {
            $task->status = $validated['status'];
        }

        $task->save();

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->noContent();
    }

    public function getStatuses()
    {
        $statuses = Task::select('status')->distinct()->get();
        return response()->json($statuses);
    }
}
