<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'due_date',
        'assigned_user_id',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }
}
