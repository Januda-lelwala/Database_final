// src/pages/Portal/Admin_Page/Employees.js
import React, { useEffect, useState, useMemo } from "react";
import "./employees.css";
import { useToast } from "../../../../components/ToastProvider";

const API_BASE = "http://localhost:3000/api";
const getTokenHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("authToken") || ""}` });

// no credential helpers needed for employee creation
// (removed: deliveryHint helper was unused)

export default function Employees() {
	// NEW: segment state (default to "driver")
  const { showToast } = useToast();
	const [tab, setTab] = useState("driver");

	// Search state for driver & assistant panels
	const [driverQuery, setDriverQuery] = useState("");
	const [assistantQuery, setAssistantQuery] = useState("");

	const [drivers, setDrivers] = useState([]);
	const [assistants, setAssistants] = useState([]);
	const [loading, setLoading] = useState(false);

	// Forms: only requested fields
	const [driverForm, setDriverForm] = useState({
		name: "", address: "", phone_no: "", email: "",
	});
	const [assistantForm, setAssistantForm] = useState({
		name: "", address: "", phone_no: "", email: "",
	});

	// Edit state
	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState({ name: "", address: "", phone_no: "", email: "" });
	const [savingId, setSavingId] = useState(null);
	const [deletingId, setDeletingId] = useState(null);

	// Sort state
	const [sort, setSort] = useState({ key: "id", dir: "asc" }); // key: id, name, address, phone, email

	useEffect(() => {
		fetchEmployees();
		// eslint-disable-next-line
	}, []);

	const fetchEmployees = async () => {
		setLoading(true);
		try {
			const driverRes = await fetch(`${API_BASE}/drivers`, { headers: getTokenHeader() });
			if (driverRes.ok) {
				const driverData = await driverRes.json();
				const drv = Array.isArray(driverData?.data)
					? driverData.data
					: Array.isArray(driverData?.drivers)
					? driverData.drivers
					: Array.isArray(driverData)
					? driverData
					: [];
				setDrivers(drv);
			}
		} catch (err) {
			console.error('Error fetching drivers:', err);
		}

		try {
			const assistantRes = await fetch(`${API_BASE}/assistants`, { headers: getTokenHeader() });
			if (assistantRes.ok) {
				const assistantData = await assistantRes.json();
				const ast = Array.isArray(assistantData?.data)
					? assistantData.data
					: Array.isArray(assistantData?.assistants)
					? assistantData.assistants
					: Array.isArray(assistantData)
					? assistantData
					: [];
				setAssistants(ast);
			}
		} catch (err) {
			console.error('Error fetching assistants:', err);
		}
		setLoading(false);
	};

	// Submit: follow your procedure
	const addDriver = async (e) => {
		e.preventDefault();
		
		if (!driverForm.name.trim()) {
			showToast("Please provide driver name", { type: "warning" });
			return;
		}

		const payload = { 
			name: driverForm.name,
			address: driverForm.address || "",
			phone_no: driverForm.phone_no || "",
			email: driverForm.email || ""
		};

		setLoading(true);
		try {
			const r = await fetch(`${API_BASE}/drivers`, {
				method: "POST",
				headers: { "Content-Type": "application/json", ...getTokenHeader() },
				body: JSON.stringify(payload),
			});
			
			const data = await r.json();
			
			if (!r.ok) {
				throw new Error(data.message || 'Failed to add driver');
			}
			
			const created = data?.data || {};
			const credentials = data?.credentials || {};
			const emailStatus = data?.emailStatus;
			const emailLine = emailStatus?.sent
				? `✓ Email sent to ${created.email}`
				: emailStatus?.reason === 'SMTP_NOT_CONFIGURED' 
				? `⚠ Email skipped (SMTP not configured)` 
				: `⚠ Email not sent`;
			
			showToast(
				`Driver added successfully!\n\nID: ${created.driver_id || '(see list)'}\nName: ${created.name || driverForm.name}\n\nLogin Credentials:\nUsername: ${credentials.user_name}\nPassword: ${credentials.password}\n\n${emailLine}\n\nPlease save these credentials securely.`,
				{ type: "success", duration: 7000 }
			);
			setDriverForm({ name: "", address: "", phone_no: "", email: "" });
			fetchEmployees(); // Refresh the list
		} catch (error) {
			showToast(`Error: ${error.message}`, { type: "error" });
		} finally {
			setLoading(false);
		}
	};

	const addAssistant = async (e) => {
		e.preventDefault();
		
		if (!assistantForm.name.trim()) {
			showToast("Please provide assistant name", { type: "warning" });
			return;
		}

		const payload = {
			name: assistantForm.name,
			address: assistantForm.address || "",
			phone_no: assistantForm.phone_no || "",
			email: assistantForm.email || ""
		};

		setLoading(true);
		try {
			const r = await fetch(`${API_BASE}/assistants`, {
				method: "POST",
				headers: { "Content-Type": "application/json", ...getTokenHeader() },
				body: JSON.stringify(payload),
			});
			
			const data = await r.json();
			
			if (!r.ok) {
				throw new Error(data.message || 'Failed to add assistant');
			}
			
			const created = data?.data || {};
			const credentials = data?.credentials || {};
			const emailStatus = data?.emailStatus;
			const emailLine = emailStatus?.sent
				? `✓ Email sent to ${created.email}`
				: emailStatus?.reason === 'SMTP_NOT_CONFIGURED' 
				? `⚠ Email skipped (SMTP not configured)` 
				: `⚠ Email not sent`;
			
			showToast(
				`Assistant added successfully!\n\nID: ${created.assistant_id || '(see list)'}\nName: ${created.name || assistantForm.name}\n\nLogin Credentials:\nUsername: ${credentials.user_name}\nPassword: ${credentials.password}\n\n${emailLine}\n\nPlease save these credentials securely.`,
				{ type: "success", duration: 7000 }
			);
			setAssistantForm({ name: "", address: "", phone_no: "", email: "" });
			fetchEmployees(); // Refresh the list
		} catch (error) {
			showToast(`Error: ${error.message}`, { type: "error" });
		} finally {
			setLoading(false);
		}
	};

	// derived filtered lists for the UI/search
	const visibleDrivers = useMemo(() => {
		const q = (driverQuery || "").trim().toLowerCase();
		if (!q) return drivers;
		return drivers.filter((d) => {
			const hay = `${d.driver_id || d.id} ${d.name || ""} ${d.phone_no || d.phone || ""} ${d.email || ""}`.toLowerCase();
			return hay.includes(q);
		});
	}, [drivers, driverQuery]);
	
	const visibleAssistants = useMemo(() => {
		const q = (assistantQuery || "").trim().toLowerCase();
		if (!q) return assistants;
		return assistants.filter((a) => {
			const hay = `${a.assistant_id || a.id} ${a.name || ""} ${a.phone_no || a.phone || ""} ${a.email || ""}`.toLowerCase();
			return hay.includes(q);
		});
	}, [assistants, assistantQuery]);

	// Derived sorted & filtered lists
	const sortedDrivers = useMemo(() => {
		const arr = [...visibleDrivers];
		const { key, dir } = sort;
		const mult = dir === "asc" ? 1 : -1;
		arr.sort((a, b) => {
			let va = key === "id" ? (a.driver_id || a.id) : (a[key] || "");
			let vb = key === "id" ? (b.driver_id || b.id) : (b[key] || "");
			return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" }) * mult;
		});
		return arr;
	}, [visibleDrivers, sort]);
	const sortedAssistants = useMemo(() => {
		const arr = [...visibleAssistants];
		const { key, dir } = sort;
		const mult = dir === "asc" ? 1 : -1;
		arr.sort((a, b) => {
			let va = key === "id" ? (a.assistant_id || a.id) : (a[key] || "");
			let vb = key === "id" ? (b.assistant_id || b.id) : (b[key] || "");
			return String(va).localeCompare(String(vb), undefined, { numeric: true, sensitivity: "base" }) * mult;
		});
		return arr;
	}, [visibleAssistants, sort]);

	// Sort handler
	const onSort = (key) =>
		setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

	// Edit helpers
	const startEdit = (item, isDriver) => {
		const id = isDriver ? (item.driver_id || item.id) : (item.assistant_id || item.id);
		setEditingId(id);
		setEditForm({
			name: item.name ?? "",
			address: item.address ?? "",
			phone_no: item.phone_no ?? item.phone ?? "",
			email: item.email ?? "",
		});
	};
	const cancelEdit = () => {
		setEditingId(null);
		setEditForm({ name: "", address: "", phone_no: "", email: "" });
	};
	const saveEdit = async (isDriver) => {
		const id = editingId;
		if (!id) return;
		setSavingId(id);
		const payload = {
			name: editForm.name,
			address: editForm.address,
			phone_no: editForm.phone_no,
			email: editForm.email,
		};
		let replacement = null;
		try {
			const url = isDriver
				? `${API_BASE}/drivers/${encodeURIComponent(id)}`
				: `${API_BASE}/assistants/${encodeURIComponent(id)}`;
			const r = await fetch(url, {
				method: "PUT",
				headers: { "Content-Type": "application/json", ...getTokenHeader() },
				body: JSON.stringify(payload),
			});
			const body = await r.json().catch(() => ({}));
			if (!r.ok) {
				throw new Error(body?.message || "Failed to update employee.");
			}
			replacement = body?.data || body;
			if (!replacement || typeof replacement !== "object") {
				replacement = { ...payload };
			}
		} catch (error) {
			console.error("Failed to update employee:", error);
			showToast(error.message || "Unable to update employee.", { type: "error" });
			setSavingId(null);
			return;
		}
		setSavingId(null);
		const merged = {
			...payload,
			...(replacement || {})
		};
		if (isDriver) {
			setDrivers((list) =>
				list.map((x) =>
					(x.driver_id || x.id) === id ? { ...x, ...merged, driver_id: x.driver_id || id } : x
				)
			);
		} else {
			setAssistants((list) =>
				list.map((x) =>
					(x.assistant_id || x.id) === id ? { ...x, ...merged, assistant_id: x.assistant_id || id } : x
				)
			);
		}
		cancelEdit();
	};

	// Delete
	const remove = async (id, isDriver) => {
		if (!window.confirm("Delete this employee?")) return;
		setDeletingId(id);
		let success = false;
		try {
			const url = isDriver
				? `${API_BASE}/drivers/${encodeURIComponent(id)}`
				: `${API_BASE}/assistants/${encodeURIComponent(id)}`;
			const r = await fetch(url, {
				method: "DELETE",
				headers: getTokenHeader(),
			});
			if (!r.ok) {
				const payload = await r.json().catch(() => ({}));
				throw new Error(payload?.message || "Failed to delete employee.");
			}
			success = true;
		} catch (error) {
			console.error("Failed to delete employee:", error);
			showToast(error.message || "Unable to delete employee.", { type: "error" });
		} finally {
			setDeletingId(null);
		}
		if (success) {
			if (isDriver) {
				setDrivers((t) => t.filter((x) => (x.driver_id || x.id) !== id));
			} else {
				setAssistants((t) => t.filter((x) => (x.assistant_id || x.id) !== id));
			}
		}
	};

	return (
		<div className="admin-page employees">
			<h2>Employees</h2>

			{/* Segmented toggle */}
			<div className="segmented" role="tablist" aria-label="Employee type">
				<button
					type="button"
					role="tab"
					aria-selected={tab === "driver"}
					className={`seg-btn ${tab === "driver" ? "active" : ""}`}
					onClick={() => setTab("driver")}
				>
					🚚 <span>Driver</span>
				</button>
				<button
					type="button"
					role="tab"
					aria-selected={tab === "assistant"}
					className={`seg-btn ${tab === "assistant" ? "active" : ""}`}
					onClick={() => setTab("assistant")}
				>
					🤝 <span>Assistant</span>
				</button>
			</div>

			{/* Single common panel with sub-panels: left = add form, right = search, below = table */}
			<div className="panel common-panel" style={{ padding: 20 }}>
				<div
					className="subpanels"
					style={{
						display: "grid",
						gridTemplateColumns: "1fr 320px",
						gap: 20,
						alignItems: "start",
					}}
				>
					{/* Add form sub-panel (left) */}
					<div className="subpanel">
						{tab === "driver" ? <h3>Add Driver</h3> : <h3>Add Assistant</h3>}
						{tab === "driver" ? (
							<form className="grid" onSubmit={addDriver}>
								<label><span>Name</span>
									<input required value={driverForm.name} onChange={(e)=>setDriverForm(f=>({...f,name:e.target.value}))} />
								</label>
								<label className="full"><span>Address</span>
									<textarea rows={2} value={driverForm.address} onChange={(e)=>setDriverForm(f=>({...f,address:e.target.value}))} />
								</label>
								<label><span>Phone</span>
									<input value={driverForm.phone_no} onChange={(e)=>setDriverForm(f=>({...f,phone_no:e.target.value}))} />
								</label>
								<label><span>Email</span>
									<input type="email" value={driverForm.email} onChange={(e)=>setDriverForm(f=>({...f,email:e.target.value}))} />
								</label>
								<div className="actions full"><button className="btn primary">Add Driver</button></div>
							</form>
						) : (
							<form className="grid" onSubmit={addAssistant}>
								<label><span>Name</span>
									<input required value={assistantForm.name} onChange={(e)=>setAssistantForm(f=>({...f,name:e.target.value}))} />
								</label>
								<label className="full"><span>Address</span>
									<textarea rows={2} value={assistantForm.address} onChange={(e)=>setAssistantForm(f=>({...f,address:e.target.value}))} />
								</label>
								<label><span>Phone</span>
									<input value={assistantForm.phone_no} onChange={(e)=>setAssistantForm(f=>({...f,phone_no:e.target.value}))} />
								</label>
								<label><span>Email</span>
									<input type="email" value={assistantForm.email} onChange={(e)=>setAssistantForm(f=>({...f,email:e.target.value}))} />
								</label>
								<div className="actions full"><button className="btn primary">Add Assistant</button></div>
							</form>
						)}
					</div>

					{/* Search sub-panel (right) */}
					<div className="subpanel" style={{ minWidth: 260 }}>
						{tab === "driver" ? <h3>Find Drivers</h3> : <h3>Find Assistants</h3>}
						<div className="toolbar" style={{ display: "flex", gap: 12, alignItems: "center" }}>
							<input
								className="toolbar-input"
								placeholder={tab === "driver" ? "Search drivers by ID, name, phone, email…" : "Search assistants by ID, name, phone, email…"}
								value={tab === "driver" ? driverQuery : assistantQuery}
								onChange={(e) => (tab === "driver" ? setDriverQuery(e.target.value) : setAssistantQuery(e.target.value))}
								aria-label={tab === "driver" ? "Search drivers" : "Search assistants"}
							/>
						</div>
						<div style={{ marginTop: 12 }} className="muted">
							Showing <b>{tab === "driver" ? visibleDrivers.length : visibleAssistants.length}</b> of <b>{tab === "driver" ? drivers.length : assistants.length}</b>
						</div>
					</div>
				</div>

				{/* Table sub-panel (full width) */}
				<div className="subpanel table-subpanel" style={{ marginTop: 20 }}>
					<div className="table-wrap">
						<table>
							<thead>
								<tr>
									<th
										className={`sortable ${sort.key === "id" ? `sorted-${sort.dir}` : ""}`}
										onClick={() => onSort("id")}
									>
										ID
									</th>
									<th
										className={`sortable ${sort.key === "name" ? `sorted-${sort.dir}` : ""}`}
										onClick={() => onSort("name")}
									>
										Name
									</th>
									<th
										className={`sortable ${sort.key === "address" ? `sorted-${sort.dir}` : ""}`}
										onClick={() => onSort("address")}
									>
										Address
									</th>
									<th
										className={`sortable ${sort.key === "phone_no" ? `sorted-${sort.dir}` : ""}`}
										onClick={() => onSort("phone_no")}
									>
										Phone
									</th>
									<th
										className={`sortable ${sort.key === "email" ? `sorted-${sort.dir}` : ""}`}
										onClick={() => onSort("email")}
									>
										Email
									</th>
									<th className="right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{(tab === "driver" ? sortedDrivers : sortedAssistants).slice(0, 9999).map((item, i) => {
									const isDriver = tab === "driver";
									const id = isDriver ? (item.driver_id || item.id) : (item.assistant_id || item.id);
									const isEditing = editingId === id;
									return (
										<tr key={id}>
											<td className="mono">{id}</td>
											<td>
												{isEditing ? (
													<input
														value={editForm.name}
														onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
													/>
												) : (
													item.name
												)}
											</td>
											<td>
												{isEditing ? (
													<input
														value={editForm.address}
														onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
													/>
												) : (
													item.address || "-"
												)}
											</td>
											<td>
												{isEditing ? (
													<input
														value={editForm.phone_no}
														onChange={(e) => setEditForm((f) => ({ ...f, phone_no: e.target.value }))}
													/>
												) : (
													item.phone_no || item.phone || "-"
												)}
											</td>
											<td>
												{isEditing ? (
													<input
														value={editForm.email}
														onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
													/>
												) : (
													item.email || "-"
												)}
											</td>
											<td className="right">
												{!isEditing ? (
													<div className="row-actions">
														<button className="btn" onClick={() => startEdit(item, isDriver)}>Edit</button>
														<button
															className="btn danger"
															onClick={() => remove(id, isDriver)}
															disabled={deletingId === id}
														>
															{deletingId === id ? "Deleting…" : "Delete"}
														</button>
													</div>
												) : (
													<div className="row-actions">
														<button
															className="btn primary"
															onClick={() => saveEdit(isDriver)}
															disabled={savingId === id}
														>
															{savingId === id ? "Saving…" : "Save"}
														</button>
														<button className="btn" onClick={cancelEdit}>Cancel</button>
													</div>
												)}
											</td>
										</tr>
									);
								})}
								{((tab === "driver" ? sortedDrivers : sortedAssistants).length === 0) && (
									<tr><td colSpan={6} className="empty">No matching {tab === "driver" ? "drivers" : "assistants"}</td></tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

		</div>
	);
}

