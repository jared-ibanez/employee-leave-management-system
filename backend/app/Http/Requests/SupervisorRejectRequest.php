<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SupervisorRejectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'remarks' => [
                'required',
                'string',
                'min:3',
                'max:1000',
            ],
        ];
    }


    public function messages(): array
    {
        return [
            'remarks.required' =>
                'Please provide a reason for rejecting the leave request.',

            'remarks.min' =>
                'Please provide a more detailed rejection reason.',
        ];
    }
}