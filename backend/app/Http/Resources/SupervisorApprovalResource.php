<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupervisorApprovalResource extends JsonResource
{
    public function toArray(
        Request $request
    ): array {
        return [
            'id' =>
                $this->id,

            'approval_level' =>
                $this->approval_level,

            'status' =>
                $this->status,

            'remarks' =>
                $this->remarks,

            'acted_at' =>
                $this->acted_at
                    ?->toISOString(),

            'created_at' =>
                $this->created_at
                    ?->toISOString(),

            'leave_request' =>
                new LeaveRequestResource(
                    $this->whenLoaded(
                        'leaveRequest'
                    )
                ),
        ];
    }
}