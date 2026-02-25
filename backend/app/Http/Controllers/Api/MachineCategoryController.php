<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MachineCategory;
use Illuminate\Http\Request;

class MachineCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = MachineCategory::query();

        if (!$request->user()->isAdmin()) {
            $query->where('company_id', $request->user()->company_id);
        }

        $categories = $query->where('is_active', true)->get();
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
        ]);

        $category = MachineCategory::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, MachineCategory $machineCategory)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $machineCategory->update($validated);

        return response()->json($machineCategory);
    }

    public function destroy(MachineCategory $machineCategory)
    {
        $machineCategory->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
