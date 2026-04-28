<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Death extends Model
{
    protected $fillable = [
        'country',
        'year',
        'cause',
        'deaths'
    ];
}
