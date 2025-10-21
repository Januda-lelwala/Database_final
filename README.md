# 🚚 Kandypack Project – Rail and Road–Based Supply Chain Distribution System

## 📖 Overview
**Kandypack** is a mid–sized FMCG manufacturing company based in Kandy, Sri Lanka.  
The company distributes its products across the island using a hybrid **rail + road** logistics model:
- **Rail** for long–distance bulk transport from Kandy to major cities.  
- **Road (truck)** for last–mile delivery from city depots to customers.

Historically, these processes were tracked manually in Excel.  
This project replaces those sheets with a **full–stack logistics management system** — combining a relational database, backend API, and frontend interface for real-time order, transport, and delivery management.

---

## 🧩 Problem Scenario
Kandypack needed a digital solution to manage:
- Train trips with **fixed cargo capacities**.  
- Allocation of orders across multiple train trips if a trip is full.  
- Product–specific **space consumption rates** (e.g., 1 box = 0.5 space units).  
- Stores near destination stations for unloading and local storage.  
- Truck routes for **last-mile delivery**, each with time and capacity limits.  
- Driver and assistant rostering with strict work-hour and schedule rules:
  - Drivers ≤ 40 hours/week, no consecutive routes.  
  - Assistants ≤ 60 hours/week, max two consecutive routes.  
- Orders placed ≥ 7 days before requested delivery date.  
- Full delivery tracking and post-delivery reporting.  
:contentReference[oaicite:0]{index=0}

---

## 🏗️ System Architecture

### 🔹 Frontend
**Framework:** React JS  
- Modern dashboard interface for managing orders, train trips, truck schedules, and reports.  
- Role-based access (Admin / Driver / Assistant).  
- REST API communication with backend (Axios).  
- Real-time form validation and route-aware navigation.

### 🔹 Backend
**Environment:** Node JS + Express  
- REST API routes for Orders, Products, Train Trips, Truck Schedules, and Deliveries.  
- JWT-based authentication.  
- Input validation, error handling, and business-rule enforcement.  
- Separate configuration for development and production.  
- Uses MySQL for data persistence.

### 🔹 Database (MySQL)
Core entities:
| Category | Tables |
|-----------|---------|
| Master Data | `customer`, `product`, `city`, `route`, `station`, `store` |
| Operations | `orders`, `order_item`, `train_trip`, `train_load`, `truck`, `person`, `truck_schedule`, `delivery` |
| Support | triggers, procedures, and indexes |

**ACID Enforcement:**
- **Triggers** for:
  - Order lead-time (≥ 7 days)  
  - Train-capacity check  
  - Schedule overlap prevention  
  - Weekly hour limits  
  - Consecutive-run validation  
- **Stored Procedures:** automatic allocation of order items to available train trips.  
- **Indexes:** optimized for date/time and foreign-key queries.

---

## 🚀 Features

| Module | Key Functions |
|---------|----------------|
| 🧾 Orders | Create, update, cancel, or deliver orders. Validates lead-time and destination route. |
| 🚆 Train Trips | Manage trips with capacity limits, monitor allocated space, prevent over-filling. |
| 🚚 Truck Scheduling | Assign routes to trucks + drivers + assistants. Prevent conflicts and hour violations. |
| 👨‍🔧 Rostering | Enforce working-hour and consecutive-route policies for staff. |
| 📦 Allocation | Auto-assign order items to next available train trip respecting capacity and space usage. |
| 📊 Reports | Generate quarterly sales, top products, city/route breakdowns, driver hours, truck usage, and customer histories. |

---

## 📈 Reports
1. **Quarterly Sales Summary** (value + volume)  
2. **Most Ordered Items** by quarter  
3. **City / Route Sales Breakdown**  
4. **Driver + Assistant Working Hours (weekly)**  
5. **Truck Usage per Month**  
6. **Customer Order History with Delivery Details**  
:contentReference[oaicite:1]{index=1}

---

## 🧮 Sample Data
- **10 + routes** covering key cities (Colombo, Negombo, Galle, Matara, Jaffna, Trincomalee, etc.)  
- **40 sample orders** auto-generated with random destinations, realistic addresses, and timestamps.  
- Example script:
  ```sql
  INSERT INTO orders (customer_id, order_date, destination_city, destination_address, status, created_at, updated_at)
  SELECT 
    FLOOR(1 + RAND()*20),
    DATE('2025-07-01') + INTERVAL FLOOR(RAND()*90) DAY,
    ELT(FLOOR(1 + RAND()*6),'Colombo','Negombo','Galle','Matara','Jaffna','Trincomalee'),
    CONCAT('No. ', FLOOR(1 + RAND()*200), ', Main St, ', ELT(FLOOR(1 + RAND()*6),'Colombo','Negombo','Galle','Matara','Jaffna','Trincomalee')),
    'PLACED', NOW(), NOW()
  FROM (SELECT 1 UNION ALL SELECT 2 … UNION ALL SELECT 40) g;
