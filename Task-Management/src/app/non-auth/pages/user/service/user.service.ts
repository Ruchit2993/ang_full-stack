import { Injectable } from '@angular/core';

export interface AppUser {
  id: number;
  name: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  password?: string;
  gender?: string;
  hobbies?: string[];
}

const LS_USERS_KEY = 'app_users';
const LS_CURRENT_KEY = 'currentUser';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readStorage(): AppUser[] {
    try {
      const raw = localStorage.getItem(LS_USERS_KEY);
      return raw ? JSON.parse(raw) as AppUser[] : [];
    } catch {
      return [];
    }
  }

  private writeStorage(users: AppUser[]) {
    try { localStorage.setItem(LS_USERS_KEY, JSON.stringify(users)); } catch {}
  }

  getAll(): AppUser[] {
    return this.readStorage();
  }

  findByEmail(email: string): AppUser | undefined {
    return this.readStorage().find(u => u.email?.toLowerCase() === email?.toLowerCase());
  }

  add(user: Omit<AppUser, 'id'>): AppUser {
    const users = this.readStorage();
    const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser: AppUser = { id, ...user };
    users.push(newUser);
    this.writeStorage(users);
    return newUser;
  }

  authenticate(email: string, password: string): AppUser | undefined {
    const user = this.findByEmail(email);
    if (user && user.password === password) return user;
    return undefined;
  }

  setCurrent(user: AppUser | null) {
    try {
      if (user) localStorage.setItem(LS_CURRENT_KEY, JSON.stringify(user));
      else localStorage.removeItem(LS_CURRENT_KEY);
    } catch {}
  }

  getCurrent(): AppUser | null {
    try {
      const raw = localStorage.getItem(LS_CURRENT_KEY);
      return raw ? JSON.parse(raw) as AppUser : null;
    } catch {
      return null;
    }
  }

  async fetchDummyUsers(): Promise<any[]> {
    const res = await fetch('https://dummyjson.com/users');
    const data = await res.json();
    console.log('Fetched dummyjson users:', data.users); // debug log
    return data.users || [];
  }

  saveAll(users: Omit<AppUser, 'id'>[]) {
    // Read existing users
    const existing = this.readStorage();
    // Filter out users with duplicate email (case-insensitive)
    const newUsers = users.filter(u =>
      !existing.some(e => e.email?.toLowerCase() === (u.email ?? '').toLowerCase())
    );
    // Assign unique IDs starting after the last existing user
    const startId = existing.length ? Math.max(...existing.map(u => u.id)) + 1 : 1;
    const mapped = newUsers.map((u, i) => ({ ...u, id: startId + i }));
    // Save combined list
    this.writeStorage([...existing, ...mapped]);
  }
}
