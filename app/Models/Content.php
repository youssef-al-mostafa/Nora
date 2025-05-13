<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'content';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['ref', 'status', 'attrs'];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'attrs' => 'array',
    ];
}
