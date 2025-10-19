# KandyPack - Rail & Road Distribution Management System

A comprehensive backend API for managing customer orders, train shipments, and truck deliveries with intelligent capacity planning and roster management.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)
- npm or yarn

### Setup in 3 Steps

1. **Create Database**
```bash
mysql -u root -p < database/kandypack_schema.sql
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and set your MySQL password
```

3. **Start Server**
```bash
npm install
npm run dev
```

**📖 Detailed Instructions**: See [`START_TESTING.md`](START_TESTING.md)

---

## 📊 Database Schema

### Core Entities
- **Admin** - System administrators
- **Customer** - End customers (login with username)
- **Product** - Items with space consumption metrics
- **Store** - Distribution hubs near train stations
- **Orders** - Customer orders (7-day advance requirement)
- **Order_Item** - Line items with auto stock management

### Rail Layer
- **Train** - Rolling stock with capacity
- **Train_Route** - Rail routes between cities
- **Train_Trip** - Scheduled departures
- **Train_Shipment** - Order allocation to trips

### Road Layer
- **Truck** - Delivery vehicles
- **Truck_Route** - Last-mile delivery routes
- **Driver** & **Assistant** - Personnel with hour limits
- **Truck_Schedule** - Scheduled runs with roster rules
- **Truck_Delivery** - Final delivery assignments

---

## 🎯 Key Features

### Business Rules (Database-Enforced)
✅ **7-Day Advance Orders** - Orders must be placed ≥7 days ahead  
✅ **Auto Stock Management** - Stock decreases/restores on order changes  
✅ **Train Capacity Planning** - Auto-allocates orders across trips  
✅ **Truck Roster Rules**:
- No resource overlaps (truck/driver/assistant)
- Driver: no consecutive deliveries
- Assistant: max 2 consecutive routes
- Weekly limits: drivers 40h, assistants 60h

### Reporting Views
- Quarterly sales reports
- Top products by quarter
- City & route-wise sales
- Worker hours tracking
- Truck usage metrics
- Customer order history

---

## 🔧 API Endpoints

### Public Endpoints
```
GET  /health                    - Health check
GET  /                          - API info
GET  /api/stores                - List all stores
GET  /api/stores/search?city=   - Search stores by city
GET  /api/products              - List all products
GET  /api/products/search?q=    - Search products
```

### Customer Endpoints (Auth Required)
```
POST /api/auth/register         - Customer registration
POST /api/auth/login            - Customer login
GET  /api/auth/profile          - Get profile
POST /api/orders                - Create order
GET  /api/orders/:id            - Get order details
GET  /api/customers/:id/orders  - Order history
```

### Admin Endpoints (Admin Auth Required)
```
POST /api/auth/admin/login      - Admin login
GET  /api/trucks                - Manage trucks
GET  /api/drivers               - Manage drivers
GET  /api/assistants            - Manage assistants
POST /api/truck-schedules       - Create schedules
GET  /api/reports/*             - Access reports
```

**📖 Full API Docs**: See [`API_ENDPOINTS.md`](API_ENDPOINTS.md)

---

## 🧪 Testing

### Test API
```bash
./test-api.sh
```

### Test Database
```bash
mysql -u root -p kandypack < test-queries.sql
```

### Generate Test Data
```sql
CALL sp_seed_orders_40();  -- Creates 40 orders
```

**📖 Testing Guide**: See [`TEST_DATABASE.md`](TEST_DATABASE.md)

---

## 📁 Project Structure

```
Database_lab_backend/
├── config/              # Database configuration
├── database/            # SQL schema and migrations
├── models/              # Sequelize models
├── routes/              # Express routes
├── controllers/         # Business logic (to be implemented)
├── middleware/          # Auth & validation
├── .env                 # Environment variables
├── server.js            # Express server
└── package.json         # Dependencies
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: MySQL 8.0
- **ORM**: Sequelize
- **Auth**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, rate-limiting

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [`START_TESTING.md`](START_TESTING.md) | Quick start guide (5 min setup) |
| [`DATABASE_SETUP.md`](DATABASE_SETUP.md) | Comprehensive setup guide |
| [`TEST_DATABASE.md`](TEST_DATABASE.md) | Testing procedures |
| [`API_ENDPOINTS.md`](API_ENDPOINTS.md) | Complete API reference |
| [`QUICK_START.md`](QUICK_START.md) | Quick reference guide |
| [`KANDYPACK_MIGRATION_SUMMARY.md`](KANDYPACK_MIGRATION_SUMMARY.md) | Migration status |

---

## 🎓 Sample Data

The database comes pre-loaded with:
- 4 Stores (Colombo, Negombo, Galle, Kandy)
- 3 Products (Detergent, Shampoo, Soap)
- 2 Customers (john, jane)
- 1 Admin (ADM001)
- 2 Trains, 3 Train Trips
- 2 Trucks, 2 Drivers, 2 Assistants
- 1 Sample Order with full workflow

---

## 🚧 Development Status

### ✅ Completed
- Database schema with triggers & procedures
- MySQL configuration
- Core models (Admin, Customer, Product, Order, OrderItem)
- Route files for all entities
- Validation middleware
- API documentation

### ⏳ In Progress
- Remaining Sequelize models (13 more)
- Controller implementation
- Authentication system
- Report endpoints

### 📋 Planned
- Frontend (React + TailwindCSS)
- Real-time tracking (WebSocket)
- Email notifications
- PDF invoice generation
- Mobile app

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 🆘 Support

### Common Issues

**Can't connect to MySQL?**
```bash
brew services start mysql
```

**Database doesn't exist?**
```bash
mysql -u root -p < database/kandypack_schema.sql
```

**Server won't start?**
- Check `.env` has correct MySQL password
- Ensure port 3000 is free: `lsof -i :3000`

### Get Help
- Check [`TEST_DATABASE.md`](TEST_DATABASE.md) for troubleshooting
- Review [`DATABASE_SETUP.md`](DATABASE_SETUP.md) for detailed setup
- See [`START_TESTING.md`](START_TESTING.md) for quick fixes

---

## 🎯 Next Steps

1. ✅ Setup database (see [`START_TESTING.md`](START_TESTING.md))
2. ✅ Test API endpoints (`./test-api.sh`)
3. ✅ Test business rules (`test-queries.sql`)
4. ⏳ Implement controllers
5. ⏳ Add authentication
6. ⏳ Build frontend

---

**Built with ❤️ for efficient distribution management**

---

## 📞 Contact

For questions or support, please open an issue on GitHub.

---

**Last Updated**: October 2, 2025
