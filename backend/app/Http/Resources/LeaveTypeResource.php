<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveTypeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'code' => $this->code,

            'name' => $this->name,

            'description' => $this->description,

            'default_days' =>
                (float) $this->default_days,

            'requires_attachment' =>
                $this->requires_attachment,

            'is_active' =>
                $this->is_active,
        ];
    }
}