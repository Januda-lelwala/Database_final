import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Package,
  Users as UsersIcon,
  Truck,
  Train,
  Calendar,
  Layers,
  FileText,
  BarChart2,
  Bell,
  Shield,
  Cog,
  Settings,
  MapPin,
  Warehouse,
  CreditCard,
  DollarSign,
} from "lucide-react";

// ---------- Utility Components ----------
function Page({ title, children }) {
  const location = useLocation();
  return (
    <div className="p-6">
      <div className="mb-4 text-xs text-gray-500">{location.pathname}</div>
      <h1 className="text-2xl font-semibold mb-4">{title}</h1>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        {children ?? (
          <p className="text-gray-600">This is a placeholder. Build your page here.</p>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="px-3 pt-6 pb-2 text-[10px] uppercase tracking-wider text-gray-500">
      {children}
    </div>
  );
}

function Item({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
          isActive
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
      end
    >
      <Icon className="h-4 w-4 opacity-80 group-[.active]:opacity-100" />
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-72 flex-col border-r border-gray-200 bg-gray-50/60 p-3">
      <div className="flex items-center gap-2 px-3 py-3">
        <div className="h-8 w-8 rounded-xl bg-gray-900 text-white grid place-items-center font-bold">R</div>
        <div>
          <div className="text-sm font-semibold">RRBSCD</div>
          <div className="text-xs text-gray-500">Ops Console</div>
        </div>
      </div>

      <div className="px-3 pb-3">
        <input
          placeholder="Quick search…"
          className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <nav className="flex-1 overflow-y-auto">
        <SectionLabel>Core</SectionLabel>
        <div className="space-y-1">
          <Item to="/employee" icon={Home} label="Dashboard" />
          <Item to="/orders" icon={ClipboardList} label="Orders" />
          <Item to="/products" icon={Package} label="Products & Inventory" />
          <Item to="/customers" icon={UsersIcon} label="Customers" />
        </div>

        <SectionLabel>Shipments</SectionLabel>
        <div className="space-y-1">
          <Item to="/shipments/plan" icon={Layers} label="Plan Shipment" />
          <Item to="/truck-deliveries" icon={Truck} label="Truck Deliveries" />
          <Item to="/train-shipments" icon={Train} label="Train Shipments" />
          <Item to="/loads" icon={MapPin} label="Consolidations / Loads" />
          <Item to="/docs" icon={FileText} label="Documents" />
        </div>

        <SectionLabel>Scheduling</SectionLabel>
        <div className="space-y-1">
          <Item to="/schedules/truck" icon={Calendar} label="Truck Schedules" />
          <Item to="/schedules/train" icon={Calendar} label="Train Schedules" />
          <Item to="/capacity" icon={Warehouse} label="Capacity Board" />
        </div>

        <SectionLabel>Fleet & Ops</SectionLabel>
        <div className="space-y-1">
          <Item to="/fleet/vehicles" icon={Truck} label="Vehicles" />
          <Item to="/fleet/drivers" icon={UsersIcon} label="Drivers" />
          <Item to="/locations" icon={MapPin} label="Warehouses & Locations" />
        </div>

        <SectionLabel>Finance</SectionLabel>
        <div className="space-y-1">
          <Item to="/rates" icon={DollarSign} label="Rates & Tariffs" />
          <Item to="/billing" icon={CreditCard} label="Billing" />
        </div>

        <SectionLabel>Insights</SectionLabel>
        <div className="space-y-1">
          <Item to="/reports" icon={BarChart2} label="Reports" />
          <Item to="/alerts" icon={Bell} label="Alerts" />
          <Item to="/audit" icon={Shield} label="Audit Log" />
        </div>

        <SectionLabel>Admin</SectionLabel>
        <div className="space-y-1">
          <Item to="/admin/users" icon={UsersIcon} label="Users & Roles" />
          <Item to="/admin/settings" icon={Settings} label="Org & Preferences" />
          <Item to="/admin/integrations" icon={Cog} label="Integrations" />
          <Item to="/admin/master-data" icon={Layers} label="Master Data" />
        </div>
      </nav>

      <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-500">
        <div className="font-medium text-gray-800">Build version</div>
        <div>Skeleton v1.0 • React + Tailwind</div>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2 md:hidden">
        <div className="h-8 w-8 rounded-xl bg-gray-900 text-white grid place-items-center font-bold">R</div>
        <div className="text-sm font-semibold">RRBSCD</div>
      </div>
      <div className="hidden md:block text-sm text-gray-500">
        Welcome back • Plan and track your logistics
      </div>
      <div className="flex items-center gap-3">
        <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">Help</button>
        <div className="h-8 w-8 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

// ---------- Pages (placeholders) ----------
const Dashboard = () => (
  <Page title="Dashboard">
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {["Open Orders", "Late Shipments", "Today’s Pickups", "Truck Utilization", "Rail Slots", "Alerts"].map((k) => (
        <li key={k} className="rounded-2xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">{k}</div>
          <div className="mt-2 text-2xl font-semibold">—</div>
        </li>
      ))}
    </ul>
  </Page>
);

const Orders = () => (
  <Page title="Orders">
    <div className="flex items-center justify-between">
      <input className="rounded-xl border border-gray-200 px-3 py-2 text-sm" placeholder="Filter by customer, status…" />
      <button className="rounded-xl bg-gray-900 px-3 py-2 text-sm text-white hover:opacity-90">New Order</button>
    </div>
    <div className="mt-4 grid gap-2">
      {[1,2,3].map((x)=> (
        <div key={x} className="rounded-xl border border-gray-200 p-4">
          <div className="text-sm">Order #{1000+x} • Customer X • Status: Draft</div>
        </div>
      ))}
    </div>
  </Page>
);

const Products = () => <Page title="Products & Inventory" />;
const Customers = () => <Page title="Customers" />;

const PlanShipment = () => (
  <Page title="Plan Shipment">
    <ol className="space-y-3 text-sm text-gray-700">
      <li>1) Select orders/items</li>
      <li>2) Choose mode (truck/train)</li>
      <li>3) Consolidate & schedule</li>
      <li>4) Price & confirm</li>
    </ol>
  </Page>
);

const TruckDeliveries = () => <Page title="Truck Deliveries" />;
const TrainShipments = () => <Page title="Train Shipments" />;
const Loads = () => <Page title="Consolidations / Loads" />;
const Docs = () => <Page title="Documents" />;

const TruckSchedules = () => <Page title="Truck Schedules" />;
const TrainSchedules = () => <Page title="Train Schedules" />;
const Capacity = () => <Page title="Capacity Board" />;

const Vehicles = () => <Page title="Vehicles" />;
const Drivers = () => <Page title="Drivers" />;
const Locations = () => <Page title="Warehouses & Locations" />;

const Rates = () => <Page title="Rates & Tariffs" />;
const Billing = () => <Page title="Billing" />;

const Reports = () => <Page title="Reports" />;
const Alerts = () => <Page title="Alerts" />;
const Audit = () => <Page title="Audit Log" />;

const AdminUsers = () => <Page title="Users & Roles" />;
const AdminSettings = () => <Page title="Org & Preferences" />;
const AdminIntegrations = () => <Page title="Integrations" />;
const AdminMasterData = () => <Page title="Master Data" />;

// ---------- Layout ----------
function Shell() {
  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <main className="mx-auto max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employee" element={<Dashboard />} />

            {/* Core */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />

            {/* Shipments */}
            <Route path="/shipments/plan" element={<PlanShipment />} />
            <Route path="/truck-deliveries" element={<TruckDeliveries />} />
            <Route path="/train-shipments" element={<TrainShipments />} />
            <Route path="/loads" element={<Loads />} />
            <Route path="/docs" element={<Docs />} />

            {/* Scheduling */}
            <Route path="/schedules/truck" element={<TruckSchedules />} />
            <Route path="/schedules/train" element={<TrainSchedules />} />
            <Route path="/capacity" element={<Capacity />} />

            {/* Fleet & Ops */}
            <Route path="/fleet/vehicles" element={<Vehicles />} />
            <Route path="/fleet/drivers" element={<Drivers />} />
            <Route path="/locations" element={<Locations />} />

            {/* Finance */}
            <Route path="/rates" element={<Rates />} />
            <Route path="/billing" element={<Billing />} />

            {/* Insights */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/audit" element={<Audit />} />

            {/* Admin */}
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/integrations" element={<AdminIntegrations />} />
            <Route path="/admin/master-data" element={<AdminMasterData />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  // Router should wrap <App /> at the entry (index.tsx / main.jsx)
  return <Shell />;
}

