# Missipy build map

Use this as a checklist while connecting backend to the grey frontend.

| Frontend page | Backend folder | Purpose |
|---|---|---|
| Login | Auth | Sign-in / session |
| Dashboard | shared + all modules | KPI aggregates |
| Invoice | Invoice | Create / print bills |
| Sales | Sales | Sales history / search |
| Purchases | Purchases | Purchase entry / stock in |
| Inventory | Inventory | Products / stock |
| Customer | Customers | Customer CRUD |
| Supplier | Suppliers | Supplier CRUD |
| Expense | Expenses | Expense CRUD |
| Debt | Debt | Loans / liabilities |
| Assets | Assets | Business assets |
| Reports | Reports | PDF / CSV exports |
| Accounts | Accounts | Users / roles |
| Forecasting | Forecasting | Sales / stock forecasts |
| AI Assistant | AI | Assistant endpoints |
| Settings | Settings | Business profile |

## Database

Put connection config and models only inside `backend/Database/`.

Do not put secrets in the frontend.
