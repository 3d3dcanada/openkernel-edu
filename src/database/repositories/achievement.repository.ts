/**
 * OpenKernel EDU - Achievement Repository (Prisma Implementation)
 * Manages user achievement tracking
 * 
 * @module database/repositories/achievement.repository
 */

import { prisma } from '../client';
import type { IAchievementRepository } from './index';
import type {
    DbAchievement,
    CreateAchievementInput,
    DbAchievementType,
} from '../types';

export class AchievementRepository implements IAchievementRepository {
    async findByUserId(userId: string): Promise<DbAchievement[]> {
        const achievements = await prisma.achievement.findMany({
            where: { userId },
            orderBy: { earnedAt: 'desc' },
        });

        return achievements.map(this.mapToDbAchievement);
    }

    async hasAchievement(userId: string, achievementType: DbAchievementType): Promise<boolean> {
        const achievement = await prisma.achievement.findUnique({
            where: {
                userId_achievementType: { userId, achievementType },
            },
        });

        return achievement !== null;
    }

    async award(data: CreateAchievementInput): Promise<DbAchievement> {
        // Use upsert to prevent duplicate achievements
        const achievement = await prisma.achievement.upsert({
            where: {
                userId_achievementType: {
                    userId: data.userId,
                    achievementType: data.achievementType,
                },
            },
            create: {
                userId: data.userId,
                achievementType: data.achievementType,
                metadata: data.metadata as any ?? null,
            },
            update: {
                // No update needed - achievement already exists
            },
        });

        return this.mapToDbAchievement(achievement);
    }

    async getRecent(limit: number = 10): Promise<DbAchievement[]> {
        const achievements = await prisma.achievement.findMany({
            orderBy: { earnedAt: 'desc' },
            take: limit,
        });

        return achievements.map(this.mapToDbAchievement);
    }

    async countByType(achievementType: DbAchievementType): Promise<number> {
        return prisma.achievement.count({
            where: { achievementType },
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToDbAchievement(achievement: any): DbAchievement {
        return {
            id: achievement.id,
            userId: achievement.userId,
            achievementType: achievement.achievementType,
            earnedAt: achievement.earnedAt,
            metadata: achievement.metadata,
        };
    }
}

// Export singleton instance
export const achievementRepository = new AchievementRepository();
