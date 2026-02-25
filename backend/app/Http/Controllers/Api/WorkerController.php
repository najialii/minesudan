<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Worker;
use Illuminate\Http\Request;

class WorkerController extends Controller
{
    public function index(Request $request)
    {
        $query = Worker::with('company');

        if (!$request->user()->isAdmin()) {
            $query->where('company_id', $request->user()->company_id);
        }

        $workers = $query->paginate(15);
        return response()->json($workers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|exists:companies,id',
            'name' => 'required|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'id_number' => 'nullable|string|max:50',
        ]);

        $worker = Worker::create($validated);

        return response()->json($worker->load('company'), 201);
    }

    public function show(Worker $worker)
    {
        return response()->json($worker->load('company'));
    }

    public function update(Request $request, Worker $worker)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'name_ar' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'id_number' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean',
        ]);

        $worker->update($validated);

        return response()->json($worker->load('company'));
    }

    public function destroy(Worker $worker)
    {
        $worker->delete();
        return response()->json(['message' => 'Worker deleted successfully']);
    }
}
