export async function parseError(res: Response) {
  try {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) {
      const data = await res.json();
      if (data?.message) return String(data.message);
      if (data?.detail) return String(data.detail);
      if (typeof data === "object") {
        const msgs = Object.values(data).flat().map(String);
        if (msgs.length) return msgs.join(" ");
      }
      return JSON.stringify(data);
    }
    return await res.text();
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}
