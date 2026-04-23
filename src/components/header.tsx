import { useEffect, useState } from "react";

export default function Header() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header>
            <div className="logo">Hotel<span>DB</span></div>
            <div className="status-bar">
                <div className="status-dot"></div>
                <span>System Online · {time}</span>
            </div>
        </header>
    );
}