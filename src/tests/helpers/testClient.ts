const BASE_URL = process.env.TEST_SERVER_URL ?? "http://localhost:3001";

export class TestClient {
  private cookies: Record<string, string> = {};

  private cookieHeader() {
    return Object.entries(this.cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
  }

  private captureCookies(response: Response) {
    const setCookie = response.headers.get("set-cookie");
    if (!setCookie) return;
    const [pair] = setCookie.split(";");
    const [name, value] = pair.split("=");
    this.cookies[name] = value;
  }

  private async request(path: string, options: RequestInit = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.cookieHeader() ? { Cookie: this.cookieHeader() } : {}),
        ...options.headers,
      },
    });
    this.captureCookies(response);
    const body = await response.json().catch(() => null);
    return { status: response.status, body };
  }

  get(path: string) {
    return this.request(path);
  }
  post(path: string, data: unknown) {
    return this.request(path, { method: "POST", body: JSON.stringify(data) });
  }
  patch(path: string, data: unknown) {
    return this.request(path, { method: "PATCH", body: JSON.stringify(data) });
  }
  delete(path: string) {
    return this.request(path, { method: "DELETE" });
  }
}