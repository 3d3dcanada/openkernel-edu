/**
 * OpenKernel EDU - Example Program Repository (Prisma Implementation)
 * CRUD operations for example programs with category filtering
 * 
 * @module database/repositories/example-program.repository
 */

import { prisma } from '../client';
import type { IExampleProgramRepository } from './index';
import type {
    DbExampleProgram,
    CreateExampleInput,
    ExampleFilters,
    PaginationOptions,
    DbCategory,
} from '../types';
import type { MultilingualText } from '../../contracts/tutorial-schema';

export class ExampleProgramRepository implements IExampleProgramRepository {
    async findAll(
        filters?: ExampleFilters,
        pagination?: PaginationOptions
    ): Promise<DbExampleProgram[]> {
        const where: Record<string, unknown> = {};

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.difficulty) {
            where.difficulty = filters.difficulty;
        }

        if (filters?.authorId) {
            where.authorId = filters.authorId;
        }

        const examples = await prisma.exampleProgram.findMany({
            where,
            take: pagination?.limit ?? 50,
            skip: pagination?.offset ?? 0,
            orderBy: {
                [pagination?.orderBy ?? 'createdAt']: pagination?.orderDir ?? 'desc',
            },
        });

        return examples.map(this.mapToDbExample);
    }

    async findById(id: string): Promise<DbExampleProgram | null> {
        const example = await prisma.exampleProgram.findUnique({
            where: { id },
        });

        return example ? this.mapToDbExample(example) : null;
    }

    async findByCategory(category: DbCategory): Promise<DbExampleProgram[]> {
        const examples = await prisma.exampleProgram.findMany({
            where: { category },
            orderBy: { upvotes: 'desc' },
        });

        return examples.map(this.mapToDbExample);
    }

    async create(data: CreateExampleInput): Promise<DbExampleProgram> {
        const example = await prisma.exampleProgram.create({
            data: {
                title: data.title as object,
                description: data.description as object,
                emojiCode: data.emojiCode,
                category: data.category,
                difficulty: data.difficulty,
                expectedOutput: data.expectedOutput ?? [],
                authorId: data.authorId ?? null,
            },
        });

        return this.mapToDbExample(example);
    }

    async upvote(id: string): Promise<DbExampleProgram> {
        const example = await prisma.exampleProgram.update({
            where: { id },
            data: {
                upvotes: { increment: 1 },
            },
        });

        return this.mapToDbExample(example);
    }

    async getPopular(limit: number = 10): Promise<DbExampleProgram[]> {
        const examples = await prisma.exampleProgram.findMany({
            orderBy: { upvotes: 'desc' },
            take: limit,
        });

        return examples.map(this.mapToDbExample);
    }

    async count(filters?: ExampleFilters): Promise<number> {
        const where: Record<string, unknown> = {};

        if (filters?.category) {
            where.category = filters.category;
        }

        if (filters?.difficulty) {
            where.difficulty = filters.difficulty;
        }

        return prisma.exampleProgram.count({ where });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private mapToDbExample(example: any): DbExampleProgram {
        return {
            id: example.id,
            title: example.title as MultilingualText,
            description: example.description as MultilingualText,
            emojiCode: example.emojiCode,
            category: example.category,
            difficulty: example.difficulty,
            upvotes: example.upvotes,
            authorId: example.authorId,
            expectedOutput: example.expectedOutput,
            createdAt: example.createdAt,
            updatedAt: example.updatedAt,
        };
    }
}

// Export singleton instance
export const exampleProgramRepository = new ExampleProgramRepository();
