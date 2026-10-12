<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeaveRequestRequest;
use App\Http\Resources\LeaveRequestResource;
use App\Models\LeaveRequest;
use App\Services\LeaveRequestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class LeaveRequestController extends Controller
{
    public function __construct(
        private readonly LeaveRequestService $leaveRequestService
    ) {
    }


    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $filters = $request->validate([
            'status' => [
                'nullable',

                Rule::in([
                    LeaveRequest::STATUS_DRAFT,
                    LeaveRequest::STATUS_PENDING,
                    LeaveRequest::STATUS_APPROVED,
                    LeaveRequest::STATUS_REJECTED,
                    LeaveRequest::STATUS_CANCELLED,
                ]),
            ],

            'year' => [
                'nullable',
                'integer',
                'min:2000',
                'max:2100',
            ],
        ]);

        $employee =
            $request->user()->employee;

        abort_unless(
            $employee,
            403,
            'No employee profile is associated with this account.'
        );

        $leaveRequests =
            LeaveRequest::query()
                ->where(
                    'employee_id',
                    $employee->id
                )
                ->with([
                    'leaveType',
                    'employee.department',
                ])
                ->when(
                    $filters['status'] ?? null,
                    fn ($query, $status) =>
                        $query->where(
                            'status',
                            $status
                        )
                )
                ->when(
                    $filters['year'] ?? null,
                    fn ($query, $year) =>
                        $query->whereYear(
                            'start_date',
                            $year
                        )
                )
                ->latest('submitted_at')
                ->paginate(10)
                ->withQueryString();

        return LeaveRequestResource::collection(
            $leaveRequests
        );
    }


    public function store(
        StoreLeaveRequestRequest $request
    ): JsonResponse {
        $employee =
            $request->user()->employee;

        abort_unless(
            $employee,
            403,
            'No employee profile is associated with this account.'
        );

        $leaveRequest =
            $this->leaveRequestService->create(
                $employee,
                $request->validated()
            );

        return response()->json([
            'message' =>
                'Leave request submitted successfully.',

            'data' =>
                new LeaveRequestResource(
                    $leaveRequest
                ),
        ], 201);
    }


    public function show(
        LeaveRequest $leaveRequest
    ): LeaveRequestResource {
        Gate::authorize(
            'view',
            $leaveRequest
        );

        $leaveRequest->load([
            'leaveType',
            'employee.department',
            'approvals.approver',
        ]);

        return new LeaveRequestResource(
            $leaveRequest
        );
    }


    public function cancel(
        Request $request,
        LeaveRequest $leaveRequest
    ): JsonResponse {
        Gate::authorize(
            'cancel',
            $leaveRequest
        );

        $validated = $request->validate([
            'cancellation_reason' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        DB::transaction(function () use (
            $leaveRequest,
            $validated
        ) {
            $leaveRequest->update([
                'status' =>
                    LeaveRequest::STATUS_CANCELLED,

                'cancelled_at' =>
                    now(),

                'cancellation_reason' =>
                    $validated[
                        'cancellation_reason'
                    ]
                    ?? null,
            ]);

            $leaveRequest
                ->approvals()
                ->where(
                    'status',
                    'pending'
                )
                ->update([
                    'status' =>
                        'cancelled',

                    'acted_at' =>
                        now(),
                ]);
        });

        $leaveRequest->load([
            'leaveType',
            'employee.department',
            'approvals.approver',
        ]);

        return response()->json([
            'message' =>
                'Leave request cancelled successfully.',

            'data' =>
                new LeaveRequestResource(
                    $leaveRequest
                ),
        ]);
    }
}