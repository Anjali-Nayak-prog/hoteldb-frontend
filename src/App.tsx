import { useEffect, useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import { api } from "./services/api";
import "./styles.css";

function App() {
  const [section, setSection] = useState("dashboard");

  useEffect(() => {
    api("GET", "/rooms").then(console.log);
  }, []);

  return (
    <>
      <Header />

      <div className="main-layout">
        <Sidebar setSection={setSection} />

        <main>
          {section === "dashboard" && <h2>Dashboard</h2>}
          {section === "customers" && <h2>Customers</h2>}
          {section === "rooms" && <h2>Rooms</h2>}
          {section === "bookings" && <h2>Bookings</h2>}
          {section === "settings" && <h2>Settings</h2>}
        </main>
      </div>
    </>
  );
}

export default App;