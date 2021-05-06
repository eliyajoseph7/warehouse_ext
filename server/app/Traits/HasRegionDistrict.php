<?php

namespace App\Traits;

use App\Models\District;
use App\Models\Region;

trait HasRegionDistrict {

    public function district() {
        return $this->belongsTo(District::class);
    }

    public function region() {
        return $this->belongsTo(Region::class);
    }
}
