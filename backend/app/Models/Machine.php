<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Machine extends Model
{
    protected $fillable = [
        'company_id',
        'category_id',
        'name',
        'name_ar',
        'serial_number',
        'type',
        'status',
        'cost_per_unit',
        'unit',
        'description',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MachineCategory::class, 'category_id');
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
