# ✅ Train-Route Relationship Fixed

## Correct Relationship: One Route → Many Trains

### Database Structure

**train_route table (Parent):**
- route_id (PK) - The route identifier
- start_city - Origin station
- end_city - Destination station
- destinations - Intermediate stops

**train table (Child):**
- train_id (PK) - The train identifier
- capacity - Train capacity
- notes - Additional notes
- route_id (FK) - References train_route.route_id (NULL allowed)
- begin_time - Departure time

### How It Works

1. **Create a Route** (or use existing):
   - Route R001: Kandy → Colombo (with intermediate stops)

2. **Create Multiple Trains** on the same route:
   - Train TRN005 on Route R001
   - Train TRN006 on Route R001
   - Train TRN007 on Route R001
   - etc.

This way, one route (e.g., Kandy-Colombo) can have multiple trains operating on it at different times.

### Backend Behavior

When you add a new train:
1. **If route_id is provided:**
   - Check if route exists → use it
   - If not exists → create new route with that ID

2. **If route_id is empty:**
   - Auto-generate route_id from cities (e.g., R-KAN-COL)
   - Check if that route exists → use it
   - If not exists → create new route

3. **Create train** with the route_id

### Example Usage

**Scenario: Add multiple trains on Kandy-Colombo route**

**First Train:**
- Train ID: TRN006
- Capacity: 500
- Route ID: R001 (existing)
- Result: Train links to existing R001 route

**Second Train:**
- Train ID: TRN007
- Capacity: 600
- Route ID: R001 (existing)
- Result: Train links to same R001 route

**Third Train (new route):**
- Train ID: TRN008
- Capacity: 400
- Route ID: (empty)
- Start City: Galle
- End City: Matara
- Result: Creates new route R-GAL-MAT and links train to it

### Current Data

```sql
-- One route
route_id: R001
start_city: Kandy
end_city: Colombo
destinations: Peradeniya, Kadugannawa, Rambukkana, ...

-- One train on that route
train_id: TRN005
route_id: R001
capacity: 400
begin_time: 21:47:00
```

### Test: Add Multiple Trains to Same Route

1. Go to Add Train page
2. Fill in:
   - Train ID: (auto)
   - Capacity: 550
   - Notes: Express service
   - Begin Time: 06:00
   - **Route ID: R001** ← Use existing route
   - Start City: Kandy
   - End City: Colombo
   - Destinations: (leave or fill)
3. Add Train
4. Add another train with Route ID: R001

Both trains will share the same route!

### Benefits

✅ Route reusability - Define once, use for multiple trains
✅ Consistent route data - All trains on same route have same stops
✅ Easy route management - Update route affects all trains on it
✅ Flexible scheduling - Multiple trains can run same route at different times

## Next Steps

Restart your backend server to pick up the model changes, then test adding trains!
