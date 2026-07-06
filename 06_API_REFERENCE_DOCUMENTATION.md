# ============================================================================
# BROCAADE MES - COMPLETE API REFERENCE
# ============================================================================

## Base URL
```
Development: http://localhost:5000
Production: https://api.yourdomain.com
```

## Authentication

All endpoints (except `/auth/login` and `/auth/register`) require:
```
Header: Authorization: Bearer {JWT_TOKEN}
```

### JWT Token Structure
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "role": "owner|design_head|factory_manager|contractor|delivery_team",
  "iat": 1234567890,
  "exp": 1234654290
}
```

---

## AUTHENTICATION ENDPOINTS

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+91-9876543210",
  "role": "owner"
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "owner",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "owner",
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## COMPANY PROFILE ENDPOINTS

### Get Company Profile
```http
GET /api/company/profile
Authorization: Bearer {TOKEN}

Response (200):
{
  "id": "uuid",
  "owner_id": "uuid",
  "company_name": "Brocaade Interior Solutions",
  "logo_url": "https://cloudinary.com/...",
  "address": "123 Furniture Lane",
  "city": "Bangalore",
  "state": "Karnataka",
  "postal_code": "560001",
  "country": "India",
  "phone": "+91-9876543210",
  "email": "info@brocaade.com",
  "tax_id": "GST123ABC456",
  "currency_symbol": "₹",
  "payment_terms": "Net 30",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Update Company Profile
```http
PUT /api/company/profile
Authorization: Bearer {TOKEN}
Content-Type: application/json

{
  "company_name": "Updated Company Name",
  "logo_url": "https://...",
  "address": "New Address",
  "city": "New City",
  "phone": "+91-new-number",
  "tax_id": "GST456XYZ789",
  "currency_symbol": "₹"
}

Response (200):
{
  "message": "Company profile updated successfully",
  "profile": { ...updated profile... }
}
```

---

## MASTER MATERIALS ENDPOINTS

### Get Master Materials by Category
```http
GET /api/master-materials/{category}
Authorization: Bearer {TOKEN}

Categories:
- wood (Teak, Acacia, Neem, Plywood variants)
- foam (32-Density, 40-Density, HR Foam, Memory Foam)
- hardware (Stapler Pins, Wood Screws, Adhesives)
- mattress_components (Jacquard Quilt, Foam Cores, etc.)
- fabrics (Cotton, Silk, Polyester variants)
- false_ceiling_materials
- lighting_fixtures
- paint_colors
- tiles
- modular_kitchen_components
- curtains_blinds
- wallpapers
- door_accessories
- bathroom_fixtures
- furniture_components
- safety_equipment

Response (200):
[
  {
    "id": "uuid",
    "company_id": "uuid",
    "category": "wood",
    "material_name": "Teak",
    "description": "Premium Teak Wood",
    "unit_of_measure": "sq.ft",
    "cost_per_unit": 850.00,
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  ...
]
```

### Add Master Material
```http
POST /api/master-materials
Authorization: Bearer {TOKEN}
Content-Type: application/json
Required Role: owner

{
  "category": "wood",
  "material_name": "Teak",
  "description": "Premium Teak Wood",
  "unit_of_measure": "sq.ft",
  "cost_per_unit": 850.00
}

Response (201):
{
  "message": "Material added successfully",
  "material": {
    "id": "uuid",
    "company_id": "uuid",
    "category": "wood",
    "material_name": "Teak",
    ...
  }
}
```

---

## PROJECT ENDPOINTS

### Create Project
```http
POST /api/projects
Authorization: Bearer {TOKEN}
Content-Type: application/json
Required Role: owner, design_head

{
  "project_name": "Residential Interior - Sector 7",
  "project_type": "interior_renovation",
  "client_name": "Mr. Rajesh Kumar",
  "client_phone": "+91-9876543210",
  "client_email": "rajesh@email.com",
  "client_address": "Apartment 123, Tower B, Sector 7",
  "client_city": "Bangalore",
  "project_start_date": "2024-02-01",
  "project_end_date": "2024-05-01",
  "budget_amount": 500000.00
}

Response (201):
{
  "message": "Project created successfully",
  "project": {
    "id": "uuid",
    "company_id": "uuid",
    "project_name": "Residential Interior - Sector 7",
    "project_type": "interior_renovation",
    "client_name": "Mr. Rajesh Kumar",
    ...
  }
}
```

### Get All Projects
```http
GET /api/projects
Authorization: Bearer {TOKEN}

Response (200):
[
  {
    "id": "uuid",
    "project_name": "Project 1",
    "project_type": "interior_renovation",
    "client_name": "Client Name",
    ...
  },
  ...
]
```

---

## JOB SHEET ENDPOINTS

### Create Job Sheet
```http
POST /api/job-sheets
Authorization: Bearer {TOKEN}
Content-Type: application/json
Required Role: design_head

{
  "project_id": "uuid",
  "job_type": "false_ceiling",
  "design_specs": {
    "ceiling_type": "Gypsum Board",
    "color": "White",
    "lighting": "LED",
    "area_sqft": 500
  },
  "promised_delivery_date": "2024-03-15",
  "estimated_labor_cost": 25000.00
}

Job Types:
- custom_sofa
- mattress
- readymade_retail
- false_ceiling
- lighting_installation
- painting
- tiling
- modular_kitchen
- curtains_blinds
- furniture_assembly
- wall_covering
- door_installation
- bathroom_renovation
- balcony_work
- shoe_rack_installation
- tv_unit_assembly
- dining_set_assembly
- bedroom_furniture
- other

Response (201):
{
  "message": "Job sheet created successfully",
  "jobSheet": {
    "id": "uuid",
    "project_id": "uuid",
    "job_number": "JOB-1706359000000-ABC123DEF",
    "job_type": "false_ceiling",
    "status": "draft",
    "design_specs": {...},
    "milestones": [
      {
        "id": "uuid",
        "milestone_sequence": 1,
        "milestone_name": "Design Approved",
        "status": "pending",
        ...
      },
      ...
    ]
  }
}
```

### Get All Job Sheets
```http
GET /api/job-sheets
Authorization: Bearer {TOKEN}

Response (200):
[
  {
    "id": "uuid",
    "job_number": "JOB-...",
    "job_type": "false_ceiling",
    "status": "in_progress",
    "assigned_contractor_id": "uuid",
    ...
  },
  ...
]
```

### Get Single Job Sheet with Milestones
```http
GET /api/job-sheets/{job_id}
Authorization: Bearer {TOKEN}

Response (200):
{
  "id": "uuid",
  "job_number": "JOB-...",
  "job_type": "false_ceiling",
  "status": "in_progress",
  "milestones": [
    {
      "id": "uuid",
      "milestone_sequence": 1,
      "milestone_name": "Design Approved",
      "status": "approved",
      "photo_url": "https://...",
      "photo_uploaded_at": "2024-02-01T10:30:00Z",
      "approved_by": "uuid",
      "approved_at": "2024-02-01T11:00:00Z",
      "is_sla_breached": false
    },
    ...
  ]
}
```

### Assign Contractor to Job
```http
POST /api/job-sheets/{job_id}/assign-contractor
Authorization: Bearer {TOKEN}
Content-Type: application/json
Required Role: factory_manager

{
  "contractor_id": "uuid"
}

Response (200):
{
  "message": "Contractor assigned successfully",
  "jobSheet": {
    "id": "uuid",
    "assigned_contractor_id": "uuid",
    "status": "approved",
    ...
  }
}
```

---

## MILESTONE ENDPOINTS

### Upload Milestone Photo
```http
POST /api/milestones/{milestone_id}/upload-photo
Authorization: Bearer {TOKEN}
Content-Type: multipart/form-data

Form Data:
- photo: [image file] (max 50MB)

Response (200):
{
  "message": "Photo uploaded successfully",
  "milestone": {
    "id": "uuid",
    "job_sheet_id": "uuid",
    "milestone_name": "Design Approved",
    "status": "awaiting_approval",
    "photo_url": "https://cloudinary.com/...",
    "photo_uploaded_at": "2024-02-01T10:30:00Z"
  }
}
```

### Approve Milestone
```http
POST /api/milestones/{milestone_id}/approve
Authorization: Bearer {TOKEN}
Content-Type: application/json
Required Role: factory_manager

{
  "approval_notes": "Quality checked and approved. Ready for next stage."
}

Response (200):
{
  "message": "Milestone approved successfully",
  "milestone": {
    "id": "uuid",
    "status": "approved",
    "approved_by": "uuid",
    "approved_at": "2024-02-01T11:00:00Z",
    "approval_notes": "..."
  }
}
```

---

## CONTRACTOR FINANCIAL ENDPOINTS

### Get Contractor Financial Summary
```http
GET /api/contractor/financial-summary
Authorization: Bearer {TOKEN}
Required Role: contractor

Response (200):
{
  "contractor_id": "uuid",
  "total_potential_earnings": 150000.00,
  "total_earned_amount": 75000.00,
  "total_advances_paid": 30000.00,
  "total_balance_due": 45000.00
}
```

### Log Advance Payment
```http
POST /api/contractor/{contractor_id}/log-advance
Authorization: Bearer {TOKEN}
Content-Type: application/json
Required Role: owner, factory_manager

{
  "amount": 10000.00,
  "payment_date": "2024-02-01",
  "payment_method": "bank_transfer",
  "notes": "Advance for Material Purchase"
}

Response (200):
{
  "message": "Advance payment recorded successfully",
  "advance": {
    "id": "uuid",
    "ledger_id": "uuid",
    "contractor_id": "uuid",
    "amount": 10000.00,
    "payment_date": "2024-02-01",
    "payment_method": "bank_transfer",
    "recorded_by": "uuid",
    "created_at": "2024-02-01T10:30:00Z"
  }
}
```

### Settle & Zero-Out Payout
```http
POST /api/contractor/{contractor_id}/settle-payout
Authorization: Bearer {TOKEN}
Required Role: owner

Response (200):
{
  "message": "Contractor payment settled successfully",
  "settlement": {
    "contractor_id": "uuid",
    "total_earned_amount": 150000.00,
    "total_advances_paid": 105000.00,
    "net_amount_paid": 45000.00
  }
}
```

---

## DELIVERY ENDPOINTS

### Create Delivery Record
```http
POST /api/deliveries
Authorization: Bearer {TOKEN}
Content-Type: application/json
Required Role: delivery_team

{
  "job_sheet_id": "uuid",
  "delivery_date": "2024-02-15",
  "delivery_time": "10:00",
  "delivery_address": "Apartment 123, Tower B, Sector 7",
  "delivery_city": "Bangalore",
  "delivery_phone": "+91-9876543210",
  "cod_amount": 25000.00
}

Response (201):
{
  "message": "Delivery record created",
  "delivery": {
    "id": "uuid",
    "job_sheet_id": "uuid",
    "delivery_team_member_id": "uuid",
    "status": "pending",
    "cod_amount": 25000.00,
    ...
  }
}
```

### Update Delivery Status & COD Collection
```http
PUT /api/deliveries/{delivery_id}
Authorization: Bearer {TOKEN}
Content-Type: multipart/form-data
Required Role: delivery_team

Form Data:
- status: "delivered"
- amount_collected: 25000.00
- payment_method: "cash"
- delivery_notes: "Customer satisfied with delivery"
- delivery_photo: [image file]

Response (200):
{
  "message": "Delivery updated successfully",
  "delivery": {
    "id": "uuid",
    "status": "delivered",
    "amount_collected": 25000.00,
    "delivery_photo_url": "https://...",
    "delivery_photo_timestamp": "2024-02-15T10:30:00Z"
  }
}
```

---

## REPORTING & ANALYTICS ENDPOINTS

### Owner Dashboard Summary
```http
GET /api/owner/dashboard-summary
Authorization: Bearer {TOKEN}
Required Role: owner

Response (200):
{
  "active_jobs": 15,
  "pipeline_value": 500000.00,
  "total_outstanding_liabilities": 125000.00,
  "pending_deliveries": 5,
  "pending_cod_value": 50000.00,
  "sla_breaches": 2
}
```

### Get SLA Alerts
```http
GET /api/sla-alerts
Authorization: Bearer {TOKEN}
Required Role: owner, factory_manager

Response (200):
[
  {
    "job_id": "uuid",
    "job_number": "JOB-...",
    "milestone_name": "Foaming Completed",
    "sla_hours": 48,
    "hours_elapsed": 72,
    "severity": "CRITICAL",
    "status": "in_progress"
  },
  ...
]
```

### Get Contractor Earnings Summary
```http
GET /api/contractors/earnings-summary
Authorization: Bearer {TOKEN}
Required Role: owner

Response (200):
[
  {
    "id": "uuid",
    "contractor_name": "Vikram Das",
    "total_jobs": 8,
    "total_potential": 200000.00,
    "total_earned": 125000.00,
    "total_advances": 75000.00,
    "total_balance_due": 50000.00
  },
  ...
]
```

---

## ERROR RESPONSES

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Required role(s): owner"
}
```

### 404 Not Found
```json
{
  "error": "Job sheet not found"
}
```

### 409 Conflict
```json
{
  "error": "User already exists"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## RATE LIMITING

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 99
  - `X-RateLimit-Reset`: 1234567890

---

## PAGINATION (For Future Implementation)

```http
GET /api/job-sheets?page=1&limit=20&sort=-created_at

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## WEBHOOK EVENTS (For Future Implementation)

- `job.created`
- `milestone.completed`
- `milestone.approved`
- `contractor.payment_due`
- `delivery.completed`
- `sla.breached`

---

## AUDIT LOGGING

All modifications are automatically logged with:
- User ID
- Action performed
- Table name
- Record ID
- Old values (before)
- New values (after)
- Timestamp
- IP address
- User agent

---

## SECURITY NOTES

1. All endpoints require HTTPS in production
2. JWT tokens expire in 7 days
3. Passwords must be at least 8 characters
4. Rate limiting prevents brute force attacks
5. Row-level security enforces data isolation
6. Audit logs track all changes
7. File uploads are validated and stored on Cloudinary
8. SQL injection is prevented with parameterized queries

---

## SUPPORT

For issues or questions:
- Email: api-support@brocaade.com
- Documentation: https://docs.brocaade.com
- Status: https://status.brocaade.com

---

Generated: 2024
API Version: 1.0.0
