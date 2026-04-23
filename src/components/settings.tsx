export default function Settings() {
  return (
    <div className="dashboard">
      <div className="card">
        <p className="card-title">Settings</p>
        <div className="settings-list">
          <div className="settings-item">
            <div>
              <p className="settings-label">API Endpoint</p>
              <p className="settings-value">http://localhost:3000</p>
            </div>
          </div>
          <div className="settings-item">
            <div>
              <p className="settings-label">Frontend Version</p>
              <p className="settings-value">1.0.0</p>
            </div>
          </div>
          <div className="settings-item">
            <div>
              <p className="settings-label">Database</p>
              <p className="settings-value">MySQL — HotelDB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
