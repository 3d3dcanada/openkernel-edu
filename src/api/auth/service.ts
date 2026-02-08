import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { prisma } from '../../database/client'; // Removed
import { userRepository } from '../../database/repositories';
import { User, UserRole } from '../../database/types';
// import { User, UserRole } from '@prisma/client'; // Removed
import { BuzzAuthority, AuthorityLevel } from '../../core/buzz/authority';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-prod';
const JWT_EXPIRES_IN = '7d';

export interface AuthPayload {
    sub: string;
    role: string;
    authority: number;
}

export class AuthenticationService {
    /**
     * Register a new user with email and password
     */
    static async register(email: string, password: string, name?: string) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const role = UserRole.STUDENT; // Default role
        const authorityLevel = BuzzAuthority.getAuthorityLevel(role);

        const user = await userRepository.create({
            email,
            passwordHash,
            name,
            role,
            authorityLevel
        });

        const token = this.generateToken(user);
        return { user, token };
    }

    /**
     * Login with email and password
     */
    static async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user || !user.passwordHash) {
            throw new Error('Invalid credentials');
        }

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        return { user, token };
    }


    /**
     * Handle OAuth Login (Find or Create User)
     */
    static async handleOAuthLogin(provider: string, providerId: string, email: string, name?: string, avatarUrl?: string) {
        let user = await userRepository.findByProvider(provider, providerId);

        if (!user) {
            // Check if email exists to link account
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                // Link account
                user = await userRepository.update(existingUser.id, {
                    provider,
                    providerId,
                    avatarUrl
                });
            } else {
                // Create new user
                const role = UserRole.STUDENT;
                const authorityLevel = BuzzAuthority.getAuthorityLevel(role);

                user = await userRepository.create({
                    email,
                    name,
                    avatarUrl,
                    provider,
                    providerId,
                    role,
                    authorityLevel
                });
            }
        }

        const token = this.generateToken(user);
        return { user, token };
    }

    /**
     * Generate JWT token with BUZZ claims
     */
    static generateToken(user: User): string {
        const payload: AuthPayload = {
            sub: user.id,
            role: user.role,
            authority: user.authorityLevel
        };

        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    }

    /**
     * Verify JWT token
     */
    static verifyToken(token: string): AuthPayload {
        try {
            return jwt.verify(token, JWT_SECRET) as AuthPayload;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

    /**
     * Get user profile by ID
     */
    static async getUserProfile(userId: string) {
        const user = await userRepository.findById(userId);

        if (!user) throw new Error('User not found');

        // Remove sensitive data
        const { passwordHash, ...safeUser } = user;
        // In-memory repo doesn't support relations yet, so returning user without them
        return { ...safeUser, progress: [], achievements: [] };
    }
}
