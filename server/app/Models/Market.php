<?php

namespace App\Models;

use App\Traits\HasRegionDistrict;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Market extends Model
{
    use HasFactory;
    use HasRegionDistrict;
}
