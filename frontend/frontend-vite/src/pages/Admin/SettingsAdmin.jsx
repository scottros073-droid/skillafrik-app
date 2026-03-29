import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';

export default function SettingsAdmin() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const res = await axiosInstance.get('/admin/settings');
      setSettings(res.data);
    };
    fetch();
  }, []);

  const save = async () => {
    await axiosInstance.post('/admin/settings', settings);
    alert('Saved');
  };

  if (!settings) return <div>Loading settings...</div>;
  return (
    <div style={{ padding: 20 }}>
      <h3>Settings</h3>
      <div>
        <label>Platform fee %</label>
        <input type="number" value={settings.platformFeePct} onChange={e => setSettings({ ...settings, platformFeePct: Number(e.target.value) })} />
      </div>
      <div>
        <label>Auto approve days</label>
        <input type="number" value={settings.autoApproveDays} onChange={e => setSettings({ ...settings, autoApproveDays: Number(e.target.value) })} />
      </div>
      <button onClick={save}>Save</button>
    </div>
  );
}
