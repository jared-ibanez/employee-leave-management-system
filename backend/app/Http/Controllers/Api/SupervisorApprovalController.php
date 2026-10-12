<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SupervisorApproveRequest;
use App\Http\Requests\SupervisorRejectRequest;
use App\Http\Resources\SupervisorApprovalResource;
use App\Models\LeaveRequestApproval;
use App\Services\SupervisorApprovalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class SupervisorApprovalController extends Controller
{
    public function __construct(
        private readonly SupervisorApprovalService
            $approvalService
    ) {
    }


    /*
    |--------------------------------------------------------------------------
    | List Supervisor Approvals
    |--------------------------------------------------------------------------
    */

    public function index(
        Request $request
    ): AnonymousResourceCollection {
        $filters = $request->validate([
            'status' => [
                'nullable',

                Rule::in([
                    LeaveRequestApproval::STATUS_PENDING,
                    LeaveRequestApproval::STATUS_APPROVED,
                    LeaveRequestApproval::STATUS_REJECTED,
                    LeaveRequestApproval::STATUS_CANCELLED,
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


        $approvals =
            LeaveRequestApproval::query()
                ->where(
                    'approver_id',
                    $employee->id
                )
                ->where(
                    'approval_level',
                    LeaveRequestApproval::LEVEL_SUPERVISOR
                )
                ->with([
                    'leaveRequest.leaveType',
                    'leaveRequest.employee.department',
                ])
                ->when(
                    $filters['status'] ?? null,
                    fn (
                        $query,
                        $status
                    ) =>
                        $query->where(
                            'status',
                            $status
                        )
                )
                ->when(
                    $filters['year'] ?? null,
                    function (
                        $query,
                        $year
                    ) {
                        $query->whereHas(
                            'leaveRequest',
                            fn ($leaveQuery) =>
                                $leaveQuery
                                    ->whereYear(
                                        'start_date',
                                        $year
                                    )
                        );
                    }
                )
                ->latest()
                ->paginate(10)
                ->withQueryString();


        return SupervisorApprovalResource::collection(
            $approvals
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Show Approval
    |--------------------------------------------------------------------------
    */

    public function show(
        LeaveRequestApproval $approval
    ): SupervisorApprovalResource {
        Gate::authorize(
            'view',
            $approval
        );


        $approval->load([
            'approver',
            'leaveRequest.leaveType',
            'leaveRequest.employee.department',
            'leaveRequest.approvals.approver',
        ]);


        return new SupervisorApprovalResource(
            $approval
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Approve
    |--------------------------------------------------------------------------
    */

    public function approve(
        SupervisorApproveRequest $request,
        LeaveRequestApproval $approval
    ): JsonResponse {
        Gate::authorize(
            'approve',
            $approval
        );


        $approval =
            $this->approvalService
                ->approve(
                    $approval,
                    $request->validated()[
                        'remarks'
                    ] ?? null
                );


        return response()->json([
            'message' =>
                'Leave request approved by supervisor and forwarded to HR.',

            'data' =>
                new SupervisorApprovalResource(
                    $approval
                ),
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Reject
    |--------------------------------------------------------------------------
    */

    public function reject(
        SupervisorRejectRequest $request,
        LeaveRequestApproval $approval
    ): JsonResponse {
        Gate::authorize(
            'reject',
            $approval
        );


        $approval =
            $this->approvalService
                ->reject(
                    $approval,
                    $request->validated()[
                        'remarks'
                    ]
                );


        return response()->json([
            'message' =>
                'Leave request rejected successfully.',

            'data' =>
                new SupervisorApprovalResource(
                    $approval
                ),
        ]);
    }
}