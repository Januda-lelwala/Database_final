import React, { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { authService } from "../../../../services/auth.service";
import "./Profile.css";

export default function DriverProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone_no: "", address: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profile from backend
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // Use assistant-specific profile endpoint
        const res = await authService.assistant.getProfile();
        const data = res?.data || res;
        if (mounted && data) {
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone_no: data.phone_no || "",
            address: data.address || ""
          });
        }
      } catch (e) {
        // Fallback to user context values if API fails (e.g., CORS during dev)
        if (mounted && user) {
          setForm({
            name: user.name || "",
            email: user.email || "",
            phone_no: user.phone_no || "",
            address: user.address || ""
          });
        }
      } finally {
        mounted = false;
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { 
        name: form.name,
        email: form.email,
        phone_no: form.phone_no,
        address: form.address
      };
      // Update assistant profile via correct service
      const res = await authService.assistant.updateProfile(payload);
      const msg = res?.message || "Profile saved";
      alert(msg);
    } catch (e1) {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="driver-profile">
      
      {loading ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={onSubmit}>
          <h2>Profile</h2>
          <label>
            Name
            <input name="name" value={form.name} onChange={onChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={onChange} required />
          </label>
          <label>
            Phone
            <input name="phone_no" value={form.phone_no} onChange={onChange} />
          </label>
          <label>
            Address
            <input name="address" value={form.address} onChange={onChange} />
          </label>
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </form>
      )}
    </div>
  );
}