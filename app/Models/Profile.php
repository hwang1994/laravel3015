<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends User
{
    protected $table = 'users'; // utilize users table

    public function items()
    {
        return $this->hasMany(Item::class, 'user_id');
    }

    public function pinned()
    {
        return $this->hasMany(Pinned::class, 'user_id');
    }

    public function downvoted()
    {
        return $this->hasMany(Downvoted::class, 'user_id');
    }
}