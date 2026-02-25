<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Machine;
use Illuminate\Http\Request;

class MachineController extends Controller
{
    public function index(Request $request)
    {
        $query = Machine::with(['company', 'category']);

        if (!$request->user()->isAdmin()) {
            $query->where('company_id', $request->user()->company_id);
        }

        $machines = $query->paginate(15);
        return response()->json($machines);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'category_id' => 'nullable|exists:machine_categories,id',
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'serial_number' => 'required|string|unique:machines,serial_number',
            'type' => 'required|in:refining,melting,casting,other',
            'status' => 'nullable|in:active,maintenance,inactive',
            'cost_per_unit' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $machine = Machine::create($validated);

        return response()->json($machine->load(['company', 'category']), 201);
    }

    public function show(Machine $machine)
    {
        return response()->json($machine->load('company'));
    }

    public function update(Request $request, Machine $machine)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'serial_number' => 'sometimes|string|unique:machines,serial_number,' . $machine->id,
            'type' => 'sometimes|in:refining,melting,casting,other',
            'status' => 'sometimes|in:active,maintenance,inactive',
            'description' => 'nullable|string',
        ]);

        $machine->update($validated);

        return response()->json($machine->load('company'));
    }

    public function destroy(Machine $machine)
    {
        $machine->delete();
        return response()->json(['message' => 'Machine deleted successfully']);
    }
}
