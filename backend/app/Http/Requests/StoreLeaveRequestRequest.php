<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeaveRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'leave_type_id' => [
                'required',
                'integer',

                Rule::exists('leave_types', 'id')
                    ->where('is_active', true),
            ],

            'start_date' => [
                'required',
                'date',
                'after_or_equal:today',
            ],

            'end_date' => [
                'required',
                'date',
                'after_or_equal:start_date',
            ],

            'reason' => [
                'required',
                'string',
                'min:10',
                'max:2000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'leave_type_id.required' =>
                'Please select a leave type.',

            'start_date.after_or_equal' =>
                'The leave start date cannot be in the past.',

            'end_date.after_or_equal' =>
                'The leave end date must be on or after the start date.',

            'reason.min' =>
                'Please provide a more detailed reason for your leave request.',
        ];
    }
}