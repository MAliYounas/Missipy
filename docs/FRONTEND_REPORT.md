# Missipy Frontend — Detailed Tab Report

**Scope:** Full UI shell (HTML + CSS)  
**JavaScript:** Only `frontend/common/sidebar.js` (shared navigation)  
**Data:** Forms, tables, and buttons are UI placeholders — nothing saves or loads until backend is wired  

**How to open:** `frontend/Login/login.html`

---

## How navigation works

Every app page (except Login and Print Invoice) mounts the same sidebar:

1. Page has `<div id="missipy-sidebar" data-active="TabName"></div>`
2. `sidebar.js` injects the full nav and highlights the matching tab
3. Collapse/expand uses a checkbox toggle in the sidebar markup

| Sidebar tab | Page file |
|---|---|
| Home | `Home Page/home_page.html` |
| Dashboard | `Dashboard/dashboard.html` |
| Invoice | `Invoice/invoice.html` |
| Sales | `Sales/sales.html` |
| Purchases | `Purchases/purchases.html` |
| Inventory | `Inventory/inventory.html` |
| Customers | `Customer/customer.html` |
| Suppliers | `Supplier/supplier.html` |
| Expenses | `Expense/expense.html` |
| Debt | `Debt/debt.html` |
| Assets | `Assets/assets.html` |
| Reports | `Reports/reports.html` |
| Accounts | `Accounts/accounts.html` |
| Forecasting | `Forecasting/forecasting.html` |
| AI Assistant | `AI-Assistant/ai_assistant.html` |
| Settings | `Settings/settings.html` |

**Not in sidebar:** Login, Print Invoice, and the three Forecasting “rooms” (they keep Forecasting highlighted).

---

## 1. Login

**File:** `frontend/Login/login.html`  
**Purpose:** Entry screen into the workspace.

**How it works today:** Form submits with GET to Dashboard. Any username/password works — there is no real authentication yet.

| Input | Type | Placeholder |
|---|---|---|
| Username | text | Enter username |
| Password | password | Enter password |

**Actions:** Sign In → opens Dashboard.

**Backend later:** `backend/Auth`

---

## 2. Home

**File:** `frontend/Home Page/home_page.html`  
**Purpose:** Brand landing page with short feature highlights and shortcuts.

**Sections:** Hero (Missipy logo + copy), feature row (Fast Billing / Live Inventory / Clear Reports).

**Inputs:** None.

**Actions:**
- Create Invoice → Invoice page
- View Dashboard → Dashboard page

---

## 3. Dashboard

**File:** `frontend/Dashboard/dashboard.html`  
**Purpose:** At-a-glance business overview: KPIs, cash position, alerts, quick links, module snapshot.

**Sections:**
- KPI cards (sales, expenses, stock risk, debt)
- Cash position panel
- Business alerts list
- Quick actions
- Module snapshot table

**Inputs:** None (display only).

**Quick actions:** New Invoice, Add Expense, Record Debt, Stock Forecast, Reports.

**Snapshot table columns:** Module | Records | Key total | Status

**Backend later:** Aggregates from all modules via `backend/shared` + module APIs.

---

## 4. Invoice

**File:** `frontend/Invoice/invoice.html`  
**Purpose:** Point-of-sale / billing counter — customer, products, discounts, payment, cart totals.

### How the screen is meant to work
1. Enter customer name/phone and invoice date  
2. Find product by barcode or name, set price/qty/discount/GST  
3. Add Product → line appears in cart  
4. Choose payment (Cash / Card / Debt)  
5. Generate Invoice → (intended) printable bill  

Today those buttons do not run logic; cart stays empty until API/JS is added.

### Inputs

| Field | Type | Notes |
|---|---|---|
| Customer Name | text | Placeholder: Walk-in customer |
| Phone Number | tel | Optional |
| Invoice Date | date | |
| Barcode / QR Code | text | Scan or type |
| Product Search | search | Required in markup |
| Price | number | Required |
| Quantity | number | Required |
| Discount (%) | number | Optional |
| Additional GST (%) | number | Optional |
| Payment | select | Cash, Card, Debt |

### Cart table columns
Barcode | Item Name | Qty | Per Unit Price | Discount | Additional GST | Total

### Actions
Add Product, Clear, Delete Item, Delete All, Generate Invoice

**Related page:** `Invoice/print_invoice.html` (printable layout; not auto-linked yet).

**Backend later:** `backend/Invoice`

---

## 5. Print Invoice

**File:** `frontend/Invoice/print_invoice.html`  
**Purpose:** Clean printable sales invoice (shop header, customer meta, line items, totals).

**Inputs:** None — display placeholders only.

**Line table:** # | Code | Item | Qty | Price | GST | Disc | Total

**Actions:** Print Invoice, Back to Invoice (UI only; no JS).

**Note:** No sidebar on this page.

---

## 6. Sales

**File:** `frontend/Sales/sales.html`  
**Purpose:** Look up past sales invoices, see totals, export CSV.

### Inputs (search form)

| Field | Type | Notes |
|---|---|---|
| Bill Number | search | Bill / invoice number |
| Customer Name | search | Optional |
| Payment Method | select | All, Cash, Card, Debt |
| Start Date / Start Time | date / time | Period start |
| End Date / End Time | date / time | Period end |

### Period chips
All, Today, Yesterday, This Week, This Month, This Year

### Summary KPIs
Invoices count, Total Sales

### Table columns
Bill No. | Customer | Date | Subtotal | GST | Discount | Grand Total | Created Date | Created Time

### Actions
Clear, Search, Export CSV

**Backend later:** `backend/Sales`

---

## 7. Purchases

**File:** `frontend/Purchases/purchases.html`  
**Purpose:** Record stock purchased from suppliers (codes, units, buy/sell prices, GST/discount), then save the batch.

### How it is meant to work
1. Enter supplier + purchase date  
2. Add each product (barcode, name, qty, unit, min stock, prices)  
3. Items stage in the table  
4. Save All Items → stock should increase in Inventory  

### Inputs

| Field | Type | Notes |
|---|---|---|
| Supplier Name | text | |
| Purchase Date | date | |
| QR / Barcode Number | text | Required |
| Product Name | text | Required |
| Quantity | number | Required |
| Unit | select | Pieces, Kg, Grams, Pounds, Liters, Milliliters, Dozen, Box, Pack |
| Minimum Stock Alert | number | Low-stock reminder level |
| Buying Price | number | Required |
| Selling Price | number | Required |
| GST (%) | number | Optional |
| Discount (%) | number | Optional |

### Table columns
Code | Product | Supplier | Qty | Unit | Min Stock | Buying Price | Selling Price | GST | Discount | Net Total

### Actions
Same Supplier, Add Item, Update, Delete, Save All Items

**Backend later:** `backend/Purchases` (also updates Inventory)

---

## 8. Inventory

**File:** `frontend/Inventory/inventory.html`  
**Purpose:** View stock levels, costs, selling prices, and stock value; filter by status.

### Search / filters

| Control | Type | Options |
|---|---|---|
| Barcode | search | |
| Product Name | search | |
| Stock Status | select | All Stock, In Stock, Low Stock, Out of Stock |
| Status chips | buttons | All, In Stock, Low Stock, Out of Stock |

### KPI cards
Total stock, average cost, low stock count, stock value

### Table columns
Barcode | Product | Qty | Average Cost | Selling Price | Stock Value | Status

### Actions
Update, Delete (per row)

**Backend later:** `backend/Inventory`

---

## 9. Customers

**File:** `frontend/Customer/customer.html`  
**Purpose:** Maintain customer master data for billing, credit, and debt tracking.

### Inputs

| Field | Type | Notes |
|---|---|---|
| Customer Name | text | |
| Phone Number | tel | |
| Email | email | Optional |
| CNIC / Tax ID | text | Optional |
| Address | text | |
| City | text | |
| Customer Type | select | Regular, Retail, Wholesale, Credit Customer |
| Opening Balance | number | |
| Credit Limit | number | Optional |
| Notes | textarea | Delivery / payment notes |

### Table columns
Name | Phone | Type | Balance | Credit Limit | City | Action

### Actions
Save Customer, Clear, Update, Delete

**Backend later:** `backend/Customers`

---

## 10. Suppliers

**File:** `frontend/Supplier/supplier.html`  
**Purpose:** Maintain supplier master data for purchases.

### Inputs

| Field | Type | Notes |
|---|---|---|
| Supplier Name | text | |
| Phone Number | tel | |
| Email | email | Optional |
| NTN / Tax ID | text | Optional |
| Address | text | |
| City | text | |
| Supplier Type | select | Regular, Manufacturer, Distributor, Wholesaler, Credit Supplier |
| Contact Person | text | |
| Notes | textarea | Delivery / purchase terms |

### Table columns
Name | Phone | Type | Contact Person | City

### Actions
Save Supplier, Clear, Update, Delete

**Backend later:** `backend/Suppliers`

---

## 11. Expenses

**File:** `frontend/Expense/expense.html`  
**Purpose:** Log business operating costs for P&L and cash reporting.

### Inputs

| Field | Type | Options / notes |
|---|---|---|
| Expense Title | text | e.g. rent, fuel |
| Category | select | Rent, Utilities, Salary, Transport, Maintenance, Other |
| Amount | number | |
| Expense Date | date | |
| Payment Method | select | Cash, Bank Transfer, Card, Cheque, Other |
| Paid To | text | Person or company |
| Reference / Receipt No. | text | Optional |
| Status | select | Paid, Pending, Partially Paid |
| Notes | textarea | |

### Filters
All, Paid, Not Paid, Pending, Today, This Month

### Table columns
Title | Category | Amount | Payment | Date | Status

### Actions
Save Expense, Clear, Update, Delete

**Backend later:** `backend/Expenses`

---

## 12. Debt

**File:** `frontend/Debt/debt.html`  
**Purpose:** Track loans, payables, and other liabilities (amounts, due dates, interest, status).

### KPI cards
Total Debt, Liabilities, Due Soon, Overdue

### Inputs

| Field | Type | Options / notes |
|---|---|---|
| Title | text | e.g. bank loan |
| Type | select | Debt, Liability |
| Category | select | Bank Loan, Supplier Payable, Credit Card, Personal Loan, Mortgage, Tax Payable, Salary Payable, Other |
| Creditor / Lender | text | |
| Amount | number | |
| Remaining Balance | number | |
| Interest Rate % | number | Optional |
| Payment Frequency | select | One-time, Monthly, Quarterly, Yearly |
| Start Date | date | |
| Due Date | date | |
| Status | select | Active, Partially Paid, Paid, Overdue |
| Phone / Contact | tel | Optional |
| Notes | textarea | |

### Filters
All, Debt, Liability, Active, Overdue, Paid

### Table columns
Title | Type | Creditor | Amount | Remaining | Due Date | Status | Action

### Actions
Save Debt, Clear, Update, Delete

**Backend later:** `backend/Debt`

---

## 13. Assets

**File:** `frontend/Assets/assets.html`  
**Purpose:** Asset register — cash, equipment, vehicles, property, software, etc.

### KPI cards
Total / Current / Fixed / Count

### Inputs

| Field | Type | Options / notes |
|---|---|---|
| Asset Name | text | |
| Asset Type | select | Current, Fixed, Intangible |
| Category | select | Cash, Bank Balance, Inventory Stock, Accounts Receivable, Equipment, Furniture, Vehicle, Property / Building, Land, Software / License, Other |
| Current Value | number | |
| Purchase Cost | number | |
| Purchase Date | date | |
| Condition | select | New, Good, Fair, Needs Repair |
| Depreciation % | number | Optional yearly |
| Location | text | Shop / warehouse / office |
| Serial / ID No. | text | Optional |
| Ownership | select | Owned, Leased, Financed |
| Status | select | Active, Sold, Disposed, Under Maintenance |
| Notes | textarea | |

### Filters
All, Current, Fixed, Intangible, Active

### Table columns
Name | Type | Category | Value | Purchase Date | Condition | Status | Action

### Actions
Save Asset, Clear, Update, Delete

**Backend later:** `backend/Assets`

---

## 14. Reports

**File:** `frontend/Reports/reports.html`  
**Purpose:** Pick a date range and format, then export one of eight report types as PDF or CSV.

### Shared filters

| Field | Type | Options |
|---|---|---|
| Start Date | date | |
| End Date | date | |
| Export Format | select | PDF, CSV, Excel |
| Branch / Store | select | All Stores, Main Store |

**Quick periods:** Today, This Week, This Month, This Year, Custom

### Available reports (each has PDF + CSV buttons)
1. Sales Report  
2. Purchase Report  
3. Inventory Report  
4. Expense Report  
5. Profit & Loss  
6. Customer Report  
7. Supplier Report  
8. Tax / GST Report  

**Backend later:** `backend/Reports`

---

## 15. Accounts

**File:** `frontend/Accounts/accounts.html`  
**Purpose:** Create staff logins and assign roles (Cashier / Manager / Executive).

### Inputs

| Field | Type | Options / notes |
|---|---|---|
| Full Name | text | |
| Username | text | Login id |
| Email | email | Optional |
| Phone Number | tel | |
| Password | password | |
| Confirm Password | password | |
| Account Role | select | Cashier, Manager, Executive |
| Status | select | Active, Inactive |
| Notes | textarea | Access notes |

### Filters
All, Cashier, Manager, Executive

### Table columns
Name | Username | Role | Phone | Email | Status | Action

### Actions
Save Account, Clear, Update, Delete

**Role cards (UI copy only):** describe intended access levels for each role.

**Backend later:** `backend/Accounts` (+ Auth)

---

## 16. Forecasting (hub)

**File:** `frontend/Forecasting/forecasting.html`  
**Purpose:** Entry point to forecasting “rooms” and a short how-to guide.

**Inputs:** None.

**Rooms / links:**
| Card | Goes to |
|---|---|
| Product Forecasting | `product_forecast.html` |
| Sales Forecasting | `sales_forecast.html` |
| Full Business Analysis | `business_forecast.html` |
| Stock-Out Timeline | `product_forecast.html#stock-out` |

**Backend later:** `backend/Forecasting`

---

## 17. Product Forecast (room)

**File:** `frontend/Forecasting/product_forecast.html`  
**Purpose:** Per-product demand / stock-out risk, reorder suggestions, single-SKU deep dive.

### Settings inputs

| Field | Type | Options / default |
|---|---|---|
| Product | select | All Products / search |
| Look Ahead | select | 7 / **30** / 90 days |
| Based On History | select | 14 / **30** / 90 days |
| Safety Stock (days) | number | Default 7 |
| Category Filter | select | All, Fast Moving, Slow Moving |
| Include Seasonality | select | Yes, No |
| Deep-dive product | search | Name or barcode |

### Filters
All, Critical, Warning, Healthy, Fast Movers, No Sales

### Table columns
Product | Current Qty | Avg Daily Sales | Forecast Qty | Forecast Sales | Days to Stock-Out | Suggested Reorder | Risk

### Actions
Run Product Forecast, Clear, Export CSV, Back to hub

---

## 18. Sales Forecast (room)

**File:** `frontend/Forecasting/sales_forecast.html`  
**Purpose:** Project revenue and bill volume vs last period; payment mix and period breakdown.

### Inputs

| Field | Type | Options / notes |
|---|---|---|
| Look Ahead | select | 7 / **30** / 90 days, 12 months |
| History Window | select | 30 / **90** days, 12 months |
| Growth Adjustment % | number | Optional |
| Include Seasonality | select | **Yes**, No |

### Granularity chips
Daily, Weekly, Monthly

### Table columns
Period | Projected Sales | Projected Bills | vs Last Period | Confidence | Notes

### Actions
Generate Sales Forecast, Reset, Export CSV, Back to hub

---

## 19. Business Forecast (room)

**File:** `frontend/Forecasting/business_forecast.html`  
**Purpose:** Full-shop outlook — sales, purchases, expenses, cash, debt, profit — plus manager recommendations.

### Inputs

| Field | Type | Options |
|---|---|---|
| Analysis Period | select | 30 / **90** days, 6 / 12 months |
| Include Debt Payments | select | **Yes**, No |
| Include Planned Purchases | select | **Yes**, No |
| Scenario | select | **Base Case**, Optimistic, Conservative |

### Health panels
Sales, Purchases, Expenses, Cash Flow, Debt & Liabilities, Profit & Margin

### Summary table columns
Area | Projected In | Projected Out | Net | Risk Level | Recommended Action

### Actions
Run Full Analysis, Export PDF, Open Product Room, Open Sales Room, Back to hub

---

## 20. AI Assistant

**File:** `frontend/AI-Assistant/ai_assistant.html`  
**Purpose:** Chat workspace plus quick tools for tax, statements, profit, balance sheet, cash flow, compliance, insights, debt.

### Inputs
| Field | Type | Placeholder |
|---|---|---|
| Message | textarea | Ask about tax returns, statements, profits, cash flow… |

### Quick tools (UI cards)
Tax Returns, Final Statement, Profit Analysis, Balance Sheet, Cash Flow Forecast, Compliance Check, Business Insights, Debt Summary

### Actions
Send, Clear chat, suggestion chips (sample prompts)

**Backend later:** `backend/AI`

---

## 21. Settings

**File:** `frontend/Settings/settings.html`  
**Purpose:** Business profile, branding, currency/locale, and feature toggles used across the suite.

### Business details

| Field | Type | Notes |
|---|---|---|
| Business logo | file | png / jpeg / webp |
| Business Name | text | |
| Business Type | select | Retail, Wholesale, Restaurant, Pharmacy, Grocery, Electronics, Services, Other |
| Owner Name | text | |
| Tax / NTN / GST No. | text | Optional |
| Phone Number | tel | |
| Email | email | |
| Website | url | Optional |
| Currency | select | PKR, USD, EUR, GBP, INR |
| Address | text | |
| City | text | |
| Country | text | Default: Pakistan |

### App preferences

| Field | Type | Notes |
|---|---|---|
| Date Format | select | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD |
| Low Stock Alert | number | Default 10 |
| Language | select | English, Urdu |
| Fiscal Year Start | select | January, April, July |
| Show tax on invoices | checkbox | On by default |
| Allow negative stock | checkbox | Off by default |
| Require customer on invoice | checkbox | Off by default |

### Actions
Upload Logo, Save Settings, Reset

**Backend later:** `backend/Settings`

---

## Typical business flow (intended)

```text
Login
  → Settings (set shop profile once)
  → Customers / Suppliers (masters)
  → Purchases (stock in)
  → Inventory (check stock)
  → Invoice (sell)
  → Sales (history)
  → Expenses / Debt / Assets (books)
  → Dashboard / Reports / Forecasting / AI (insights)
  → Accounts (staff access)
```

---

## Current limitations (important)

| Topic | Status |
|---|---|
| Save / Update / Delete / Search | UI only — no persistence |
| Login security | Open — any credentials accepted |
| Invoice → Print | Print page exists; not wired from Generate Invoice |
| Export PDF/CSV | Buttons present; no export logic |
| Forecasting / AI | Layout + controls only; no calculations or chat API |
| Sidebar | Only working JS feature |

When backend modules are built, match each page to the folder listed in `docs/STRUCTURE.md`.
