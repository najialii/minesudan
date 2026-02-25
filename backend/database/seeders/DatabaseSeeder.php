<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@gold.com',
            'password' => Hash::make('11235813nJ'),
            'role' => 'admin',
            'locale' => 'en',
            'is_active' => true,
        ]);

        // Create test company
        $company = \App\Models\Company::create([
            'name' => 'Golden Refinery LLC',
            'name_ar' => 'شركة التكرير الذهبي',
            'email' => 'info@goldenrefinery.com',
            'phone' => '+971 4 123 4567',
            'address' => 'Business Bay, Dubai, UAE',
            'address_ar' => 'الخليج التجاري، دبي، الإمارات',
            'is_active' => true,
        ]);

        // Create company manager
        $manager = User::create([
            'company_id' => $company->id,
            'name' => 'Ahmed Al Mansouri',
            'email' => 'manager@goldenrefinery.com',
            'password' => Hash::make('password123'),
            'role' => 'company_manager',
            'phone' => '+971 50 123 4567',
            'locale' => 'en',
            'is_active' => true,
        ]);

        // Create salesman
        $salesman = User::create([
            'company_id' => $company->id,
            'name' => 'Mohammed Hassan',
            'email' => 'sales@goldenrefinery.com',
            'password' => Hash::make('password123'),
            'role' => 'salesman',
            'phone' => '+971 50 234 5678',
            'locale' => 'en',
            'is_active' => true,
        ]);

        // Create workers
        \App\Models\Worker::create([
            'company_id' => $company->id,
            'name' => 'Ali Rahman',
            'name_ar' => 'علي رحمن',
            'phone' => '+971 50 345 6789',
            'id_number' => 'EMP001',
            'is_active' => true,
        ]);

        \App\Models\Worker::create([
            'company_id' => $company->id,
            'name' => 'Khalid Ahmed',
            'name_ar' => 'خالد أحمد',
            'phone' => '+971 50 456 7890',
            'id_number' => 'EMP002',
            'is_active' => true,
        ]);

        // Create machines with categories
        $refiningCategory = \App\Models\MachineCategory::create([
            'company_id' => $company->id,
            'name' => 'Refining Equipment',
            'name_ar' => 'معدات التكرير',
        ]);

        $meltingCategory = \App\Models\MachineCategory::create([
            'company_id' => $company->id,
            'name' => 'Melting Equipment',
            'name_ar' => 'معدات الصهر',
        ]);

        $castingCategory = \App\Models\MachineCategory::create([
            'company_id' => $company->id,
            'name' => 'Casting Equipment',
            'name_ar' => 'معدات السباكة',
        ]);

        \App\Models\Machine::create([
            'company_id' => $company->id,
            'category_id' => $refiningCategory->id,
            'name' => 'Gold Refining Machine A1',
            'name_ar' => 'آلة تكرير الذهب A1',
            'serial_number' => 'GRM-2024-001',
            'type' => 'refining',
            'status' => 'active',
            'cost_per_unit' => 150.00,
            'unit' => 'hour',
            'description' => 'High-capacity gold refining machine',
        ]);

        \App\Models\Machine::create([
            'company_id' => $company->id,
            'category_id' => $meltingCategory->id,
            'name' => 'Gold Melting Furnace B2',
            'name_ar' => 'فرن صهر الذهب B2',
            'serial_number' => 'GMF-2024-002',
            'type' => 'melting',
            'status' => 'active',
            'cost_per_unit' => 200.00,
            'unit' => 'hour',
            'description' => 'Industrial gold melting furnace',
        ]);

        \App\Models\Machine::create([
            'company_id' => $company->id,
            'category_id' => $castingCategory->id,
            'name' => 'Casting Machine C3',
            'name_ar' => 'آلة السباكة C3',
            'serial_number' => 'GCM-2024-003',
            'type' => 'casting',
            'status' => 'maintenance',
            'cost_per_unit' => 120.00,
            'unit' => 'hour',
            'description' => 'Precision gold casting machine',
        ]);

        // Create products
        \App\Models\Product::create([
            'company_id' => $company->id,
            'name' => '24K Gold Bar 100g',
            'name_ar' => 'سبيكة ذهب عيار 24 - 100 جرام',
            'sku' => 'GOLD-24K-100G',
            'price' => 6500.00,
            'stock' => 50,
            'unit' => 'piece',
            'description' => '99.99% pure gold bar',
        ]);

        \App\Models\Product::create([
            'company_id' => $company->id,
            'name' => '22K Gold Necklace',
            'name_ar' => 'قلادة ذهب عيار 22',
            'sku' => 'GOLD-22K-NECK',
            'price' => 3200.00,
            'stock' => 25,
            'unit' => 'piece',
            'description' => 'Handcrafted 22K gold necklace',
        ]);

        \App\Models\Product::create([
            'company_id' => $company->id,
            'name' => '18K Gold Ring',
            'name_ar' => 'خاتم ذهب عيار 18',
            'sku' => 'GOLD-18K-RING',
            'price' => 850.00,
            'stock' => 100,
            'unit' => 'piece',
            'description' => 'Classic 18K gold ring',
        ]);

        \App\Models\Product::create([
            'company_id' => $company->id,
            'name' => 'Gold Bracelet 21K',
            'name_ar' => 'سوار ذهب عيار 21',
            'sku' => 'GOLD-21K-BRAC',
            'price' => 2100.00,
            'stock' => 30,
            'unit' => 'piece',
            'description' => 'Elegant 21K gold bracelet',
        ]);
    }
}
