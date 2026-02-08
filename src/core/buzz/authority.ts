/**
 * OpenKernel EDU - BUZZ Kernel
 * Authority & Permission System
 * 
 * Handles Role-Based Access Control (RBAC) mapping and enforcement.
 */

export enum AuthorityLevel {
    A0_GUEST = 0,   // Anonymous, read-only, no progress save
    A1_STUDENT = 1, // Registered, progress saved
    A2_TEACHER = 2, // Class management, student progress view
    A3_ADMIN = 3    // Content creation, system management
}

export type UserRole = 'GUEST' | 'STUDENT' | 'TEACHER' | 'ADMIN';

export const ROLE_AUTHORITY_MAP: Record<UserRole, AuthorityLevel> = {
    'GUEST': AuthorityLevel.A0_GUEST,
    'STUDENT': AuthorityLevel.A1_STUDENT,
    'TEACHER': AuthorityLevel.A2_TEACHER,
    'ADMIN': AuthorityLevel.A3_ADMIN
};

export class BuzzAuthority {
    /**
     * Get numeric authority level from string role
     */
    static getAuthorityLevel(role: string): AuthorityLevel {
        // Normalize string to match UserRole keys if needed, or default to GUEST
        const normalizedRole = (role || 'GUEST').toUpperCase() as UserRole;
        return ROLE_AUTHORITY_MAP[normalizedRole] ?? AuthorityLevel.A0_GUEST;
    }

    /**
     * Check if a role meets a required authority level
     */
    static hasAuthority(userRole: string, requiredLevel: AuthorityLevel): boolean {
        const userLevel = this.getAuthorityLevel(userRole);
        return userLevel >= requiredLevel;
    }

    /**
     * Assert permissions (throws error if failed)
     */
    static assertAuthority(userRole: string, requiredLevel: AuthorityLevel): void {
        if (!this.hasAuthority(userRole, requiredLevel)) {
            throw new Error(`BUZZ_ACCESS_DENIED: User role '${userRole}' does not meet required Authority Level A${requiredLevel}`);
        }
    }
}
