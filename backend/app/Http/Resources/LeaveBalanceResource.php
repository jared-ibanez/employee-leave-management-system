<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveBalanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $pendingDays =
            (float) ($this->pending_days ?? 0);

        $remainingDays =
            (float) $this->remaining_days;

        return [
            'id' => $this->id,

            'year' => $this->year,

            'entitlement_days' =>
                (float) $this->entitlement_days,

            'carried_forward_days' =>
                (float) $this->carried_forward_days,

            'adjustment_days' =>
                (float) $this->adjustment_days,

            'used_days' =>
                (float) $this->used_days,

            'pending_days' =>
                $pendingDays,

            'remaining_days' =>
                $remainingDays,

            'available_days' =>
                max(
                    $remainingDays - $pendingDays,
                    0
                ),

            'leave_type' =>
                new LeaveTypeResource(
                    $this->whenLoaded('leaveType')
                ),
        ];
    }
}