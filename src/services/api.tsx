const API_BASE = "http://localhost:3000";

export async function api(method, path, body = null) {
    const res = await fetch(API_BASE + path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
    });

    return res.json();
}