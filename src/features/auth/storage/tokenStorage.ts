const TOKEN_KEY = "academia.token";

class TokenStorage {
  save(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  remove() {
    localStorage.removeItem(TOKEN_KEY);
  }

  hasToken(): boolean {
    return this.get() !== null;
  }
}

export default new TokenStorage();