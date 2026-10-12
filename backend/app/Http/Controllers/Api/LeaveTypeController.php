<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeaveTypeResource;
use App\Models\LeaveType;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LeaveTypeController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $leaveTypes = LeaveType::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return LeaveTypeResource::collection(
            $leaveTypes
        );
    }
}