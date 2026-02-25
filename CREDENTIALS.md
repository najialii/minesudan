# Gold Refining ERP - System Credentials

## 🔐 Admin Account
- **Email:** admin@gold.com
- **Password:** 11235813nJ
- **Role:** Admin
- **Access:** Full system access
  - Manage all companies
  - Create and manage company managers
  - View all system data
  - Cannot directly manage workers, machines, or products

---

## 🏢 Test Company: Golden Refinery LLC

### 👔 Company Manager
- **Email:** manager@goldenrefinery.com
- **Password:** password123
- **Name:** Ahmed Al Mansouri
- **Role:** Company Manager
- **Company:** Golden Refinery LLC
- **Access:**
  - Manage salesmen for the company
  - Manage workers (non-system users)
  - Manage machines and operational costs
  - Manage products and inventory
  - View sales reports
  - Access POS system

### 💼 Salesman
- **Email:** sales@goldenrefinery.com
- **Password:** password123
- **Name:** Mohammed Hassan
- **Role:** Salesman
- **Company:** Golden Refinery LLC
- **Access:**
  - Dashboard view
  - POS system (create sales, print invoices)
  - View products
  - Cannot manage users, workers, or machines

---

## 📊 Test Data Included

### Workers (Non-system users)
1. **Ali Rahman** (علي رحمن) - ID: EMP001
2. **Khalid Ahmed** (خالد أحمد) - ID: EMP002

### Machines
1. **Gold Refining Machine A1** - Serial: GRM-2024-001
   - Type: Refining | Status: Active
   - Cost: $150/hour

2. **Gold Melting Furnace B2** - Serial: GMF-2024-002
   - Type: Melting | Status: Active
   - Cost: $200/hour

3. **Casting Machine C3** - Serial: GCM-2024-003
   - Type: Casting | Status: Maintenance
   - Cost: $120/hour

### Products (Inventory)
1. **24K Gold Bar 100g** - SKU: GOLD-24K-100G
   - Price: $6,500.00 | Stock: 50 pieces

2. **22K Gold Necklace** - SKU: GOLD-22K-NECK
   - Price: $3,200.00 | Stock: 25 pieces

3. **18K Gold Ring** - SKU: GOLD-18K-RING
   - Price: $850.00 | Stock: 100 pieces

4. **Gold Bracelet 21K** - SKU: GOLD-21K-BRAC
   - Price: $2,100.00 | Stock: 30 pieces

---

## 🎯 User Role Capabilities

### Admin
✅ Create and manage companies
✅ Create and assign company managers
✅ View all system data
❌ Cannot directly manage workers, machines, or products (company-specific)

### Company Manager
✅ Create and manage salesmen for their company
✅ Manage workers (employees without system access)
✅ Manage machines and operational costs
✅ Manage products and inventory
✅ Access POS system
✅ View sales reports
❌ Cannot access other companies' data
❌ Cannot create new companies

### Salesman
✅ Access dashboard
✅ Use POS system (create sales, print invoices)
✅ View products
❌ Cannot manage users, workers, or machines
❌ Cannot manage inventory

---

## 🚀 Quick Start Guide

### For Admin:
1. Login at http://localhost:5173
2. Navigate to "Companies" to create/manage companies
3. Navigate to "Managers" to create company managers
4. Assign managers to companies

### For Company Manager:
1. Login with manager credentials
2. Navigate to "Users" to create salesmen
3. Navigate to "Workers" to add employees
4. Navigate to "Machines" to manage equipment
5. Navigate to "POS" to make sales

### For Salesman:
1. Login with salesman credentials
2. Access "POS" to process sales
3. Search products, add to cart
4. Enter customer details
5. Complete sale and print invoice

---

## 🔄 Self-Registration (Salesmen Only)
1. Go to login page
2. Click "Create New Account"
3. Fill in: Name, Email, Phone (optional), Password
4. Account created with "Salesman" role
5. Admin or Company Manager must assign to a company

---

## 🛠️ API Endpoints

**Base URL:** http://localhost:8000/api

### Public Endpoints
- `POST /login` - User login
- `POST /register` - Salesman self-registration

### Protected Endpoints (Require Authentication)
- `POST /logout` - Logout
- `GET /me` - Get current user info

### Admin Only
- `GET /companies` - List companies
- `POST /companies` - Create company
- `PUT /companies/{id}` - Update company
- `DELETE /companies/{id}` - Delete company

### Company Manager & Admin
- `GET /users` - List users
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /workers` - List workers
- `POST /workers` - Create worker
- `PUT /workers/{id}` - Update worker
- `DELETE /workers/{id}` - Delete worker
- `GET /machines` - List machines
- `POST /machines` - Create machine
- `PUT /machines/{id}` - Update machine
- `DELETE /machines/{id}` - Delete machine
- `POST /products` - Create product
- `PUT /products/{id}` - Update product

### All Authenticated Users
- `GET /products` - List products
- `POST /sales` - Create sale
- `GET /sales` - List sales

---

## 💾 Database Reset

To reset the database with all test data:
```bash
cd backend
php artisan migrate:fresh --seed
```

This will create:
- 1 Admin account
- 1 Test company (Golden Refinery LLC)
- 1 Company Manager
- 1 Salesman
- 2 Workers
- 3 Machines
- 4 Products

---

## 🌐 System URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api

---

## 📝 Notes

- Tax rate is set to 5% on all sales
- Invoice numbers are auto-generated: INV-YYYYMMDD-00001
- Stock is automatically decremented after each sale
- All monetary values are in USD
- System supports English and Arabic languages
- POS system includes automatic invoice printing
