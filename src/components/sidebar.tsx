interface SidebarProps {
  section: string;
  setSection: (s: string) => void;
}

const navItems = [
  { key: "dashboard", label: "◈  Dashboard" },
  { key: "customers", label: "◈  Customers" },
  { key: "rooms", label: "◈  Rooms" },
  { key: "bookings", label: "◈  Bookings" },
  { key: "settings", label: "◈  Settings" },
];

export default function Sidebar({ section, setSection }: SidebarProps) {
  return (
    <aside>
      <p className="nav-label">Navigation</p>
      <nav>
        {navItems.map((item) => (
          <a
            key={item.key}
            className={section === item.key ? "active" : ""}
            onClick={() => setSection(item.key)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}