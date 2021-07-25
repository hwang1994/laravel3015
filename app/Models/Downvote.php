<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Downvote extends Model
{
    use HasFactory;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'user_id' => 'integer',
        'item_id' => 'integer'
    ];

    public function user()
    {
        return $this->belongsTo(Profile::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}