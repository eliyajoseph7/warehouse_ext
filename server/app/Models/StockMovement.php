<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    protected $cast = [
        'date' => 'date'
    ];

    public function from() {
        return $this->belongsTo(District::class, 'from');
    }

    public function to() {
        return $this->belongsTo(District::class, 'to');
    }
}
