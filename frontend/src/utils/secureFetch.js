
export async function secureFetch(url, options = {}) {
    try {
        const token = localStorage.getItem("token");

        if (url.startsWith("/api")) {
            url = `http://localhost:4000${url}`;
        }

        const finalOptions = {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
                Authorization: token ? `Bearer${token}` : "",
            },
        };

        const response = await fetch(url, finalOptions);

        if (response.status === 401) {
            const data = await response.json().catch(() => ({}));

            if (data.message && data.message.toLowerCase().includes("expir")) {
                localStorage.removeItem("token");
                window.location.href = "/login"; // Comprobar navigate("login")
                return null;
            }
        }
        return response;
    } catch (error) {
        console.error("Error en secureFetch:", error);
        throw error;
    }
}
