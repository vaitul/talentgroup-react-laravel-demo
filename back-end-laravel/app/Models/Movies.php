<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movies extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',      
        'year',      
        'imdb_id',      
        'type',      
        'poster_id'
    ];
}
