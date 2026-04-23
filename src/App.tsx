import { useState } from "react";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/dashboard";
import Customers from "./components/customers";
import Rooms from "./components/rooms";
import Bookings from "./components/bookings";
import Settings from "./components/settings";
import "./styles.css";

function App() {
  const [section, setSection] = useState("dashboard");

  return (
    <>
      <Header />

      <div className="main-layout">
        <Sidebar section={section} setSection={setSection} />

        <main>
          {section === "dashboard" && <Dashboard />}
          {section === "customers" && <Customers />}
          {section === "rooms" && <Rooms />}
          {section === "bookings" && <Bookings />}
          {section === "settings" && <Settings />}
        </main>
      </div>
    </>
  );
}

export default App;