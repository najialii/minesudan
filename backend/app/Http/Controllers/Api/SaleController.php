<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'payment_method' => 'required|in:cash,card,transfer',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $subtotal = 0;
            $items = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if ($product->stock < $item['quantity']) {
                    return response()->json(['message' => "Insufficient stock for {$product->name}"], 400);
                }

                $itemTotal = $product->price * $item['quantity'];
                $subtotal += $itemTotal;

                $items[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                    'total' => $itemTotal,
                ];

                $product->decrement('stock', $item['quantity']);
            }

            $tax = $subtotal * 0.05; // 5% tax
            $total = $subtotal + $tax;

            $sale = Sale::create([
                'company_id' => $request->user()->company_id,
                'user_id' => $request->user()->id,
                'invoice_number' => 'INV-' . date('Ymd') . '-' . str_pad(Sale::count() + 1, 5, '0', STR_PAD_LEFT),
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'] ?? null,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
            ]);

            foreach ($items as $item) {
                $sale->items()->create($item);
            }

            return response()->json($sale->load('items'), 201);
        });
    }

    public function index(Request $request)
    {
        $query = Sale::with(['items', 'user']);

        if (!$request->user()->isAdmin()) {
            $query->where('company_id', $request->user()->company_id);
        }

        $sales = $query->latest()->paginate(20);
        return response()->json($sales);
    }
}
