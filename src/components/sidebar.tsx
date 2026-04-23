export default function Sidebar({ setSection }) {
    return (
        <aside>
            <nav>
                <a onClick={() => setSection("dashboard")}>Dashboard</a>
                <a onClick={() => setSection("customers")}>Customers</a>
                <a onClick={() => setSection("rooms")}>Rooms</a>
                <a onClick={() => setSection("bookings")}>Bookings</a>
                <a onClick={() => setSection("settings")}>Settings</a>
            </nav>
        </aside>
    );
}