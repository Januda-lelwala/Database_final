import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import DriverProfile from "../Profile/Profile";
import "./Settings.css";

export default function DriverSettings() {
  const { changePassword, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const initialTab = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    return tab === 'password' ? 'password' : 'profile';
  }, [location.search]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [pwdForm, setPwdForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "", newUserName: user?.user_name || "" });
  const [saving, setSaving] = useState(false);

  const setTab = (tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  const onPwdChange = (e) => setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  const onPwdSubmit = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        current_password: pwdForm.currentPassword,
        new_password: pwdForm.newPassword,
      };
      if (pwdForm.newUserName && pwdForm.newUserName !== user?.user_name) {
        payload.new_user_name = pwdForm.newUserName;
      }
      await changePassword(payload);
      alert("Password updated");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "", newUserName: user?.user_name || "" });
    } catch (e1) {
      alert(e1?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="driver-settings">
      <div className="settings-tabs">
        <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile</button>
        <button className={activeTab === 'password' ? 'active' : ''} onClick={() => setTab('password')}>Update Password</button>
      </div>

      {activeTab === 'profile' && (
        <div className="settings-panel"><DriverProfile /></div>
      )}

      {activeTab === 'password' && (
        <form onSubmit={onPwdSubmit} className="settings-panel">
          <h2>Update Password</h2>
          <label className="label">
            Current Password
            <input type="password" name="currentPassword" value={pwdForm.currentPassword} onChange={onPwdChange} required />
          </label>
          <label className="label">
            New Password
            <input type="password" name="newPassword" value={pwdForm.newPassword} onChange={onPwdChange} required />
          </label>
          <label className="label">
            Confirm Password
            <input type="password" name="confirmPassword" value={pwdForm.confirmPassword} onChange={onPwdChange} required />
          </label>
          <button type="submit" disabled={saving}>{saving ? "Updating..." : "Change Password"}</button>
        </form>
      )}
    </div>
  );
}