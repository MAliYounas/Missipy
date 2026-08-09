# Missipy

Frontend-first business suite UI. Backend folders are empty scaffolds for you to build later.

## Open the UI

Start here:

`frontend/Login/login.html`

Then use the sidebar to move through pages. This is HTML/CSS only (no JavaScript, no API, no database).

## Project structure

```text
Missipy/
├── frontend/                 # All UI pages (HTML + CSS)
│   ├── common/               # Shared styles (common.css)
│   ├── media/                # Logos / images
│   ├── Login/
│   ├── Home Page/
│   ├── Dashboard/
│   ├── Invoice/
│   ├── Sales/
│   ├── Purchases/
│   ├── Inventory/
│   ├── Customer/
│   ├── Supplier/
│   ├── Expense/
│   ├── Debt/
│   ├── Assets/               # Assets page UI
│   ├── Reports/
│   ├── Accounts/
│   ├── Forecasting/
│   ├── AI Assistant/
│   └── Settings/
├── backend/                  # Empty modules — add APIs here later
│   ├── Auth/
│   ├── Database/
│   ├── Invoice/
│   ├── Sales/
│   ├── Purchases/
│   ├── Inventory/
│   ├── Customers/
│   ├── Suppliers/
│   ├── Expenses/
│   ├── Debt/
│   ├── Assets/
│   ├── Reports/
│   ├── Accounts/
│   ├── Forecasting/
│   ├── AI/
│   ├── Settings/
│   └── shared/
└── docs/                     # Notes / plans while building
```

## Suggested build order

1. `backend/Database` — connection + schema
2. `backend/Auth` — login API
3. Wire `Invoice`, `Sales`, `Purchases`, `Inventory`
4. Then customers/suppliers/expenses
5. Then debt/assets/reports/accounts
6. Then forecasting + AI

Match each backend folder to the same-named frontend page.
