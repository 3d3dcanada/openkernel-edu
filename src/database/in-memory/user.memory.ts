
import { v4 as uuidv4 } from 'uuid';
import { User, UserRole } from '../types';
import { IUserRepository } from '../repositories';

// In-memory storage
const users: Map<string, User> = new Map();

export class InMemoryUserRepository implements IUserRepository {
    async findByEmail(email: string): Promise<User | null> {
        return Array.from(users.values()).find(u => u.email === email) || null;
    }

    async findById(id: string): Promise<User | null> {
        return users.get(id) || null;
    }

    async findByProvider(provider: string, providerId: string): Promise<User | null> {
        return Array.from(users.values()).find(u =>
            u.provider === provider && u.providerId === providerId
        ) || null;
    }

    async create(data: any): Promise<User> {
        const id = uuidv4();
        const now = new Date();

        const user: User = {
            id,
            email: data.email,
            passwordHash: data.passwordHash || null,
            name: data.name || null,
            avatarUrl: data.avatarUrl || null,
            role: data.role || UserRole.STUDENT,
            authorityLevel: data.authorityLevel || 1,
            provider: data.provider || null,
            providerId: data.providerId || null,
            createdAt: now,
            updatedAt: now
        };

        users.set(id, user);
        return user;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = users.get(id);
        if (!user) throw new Error(`User ${id} not found`);

        const updated = { ...user, ...data, updatedAt: new Date() };
        users.set(id, updated);
        return updated;
    }
}

export const inMemoryUserRepository = new InMemoryUserRepository();

export function clearInMemoryUsers(): void {
    users.clear();
}
