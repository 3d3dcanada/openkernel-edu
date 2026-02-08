/**
 * OpenKernel EDU - Database Seed Script
 * Seeds the database with lessons, examples, and achievements
 * 
 * Run with: npm run db:seed
 * 
 * @module prisma/seed/seed
 */

import { PrismaClient } from '@prisma/client';
import { SEED_LESSONS } from './lessons.seed';
import { SEED_EXAMPLES } from './examples.seed';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    // Check for dry run
    const isDryRun = process.argv.includes('--dry-run');

    if (isDryRun) {
        console.log('📋 DRY RUN MODE - No data will be written\n');
        console.log('Lessons to seed:', SEED_LESSONS.length);
        console.log('Examples to seed:', SEED_EXAMPLES.length);

        let totalSteps = 0;
        for (const lesson of SEED_LESSONS) {
            totalSteps += lesson.steps.length;
            console.log(`  - ${(lesson.title as { en: string }).en} (${lesson.steps.length} steps)`);
        }
        console.log(`Total lesson steps: ${totalSteps}\n`);

        console.log('\nExample categories:');
        const categories = new Map<string, number>();
        for (const example of SEED_EXAMPLES) {
            categories.set(example.category, (categories.get(example.category) || 0) + 1);
        }
        for (const [category, count] of categories) {
            console.log(`  - ${category}: ${count} examples`);
        }

        console.log('\n✅ Dry run complete. No data was written.');
        return;
    }

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.achievement.deleteMany();
    await prisma.userProgress.deleteMany();
    await prisma.lessonStep.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.exampleProgram.deleteMany();
    console.log('   Done.\n');

    // Seed lessons
    console.log('📚 Seeding lessons...');
    for (const lessonData of SEED_LESSONS) {
        const lesson = await prisma.lesson.create({
            data: {
                title: lessonData.title as object,
                description: lessonData.description as object,
                emojiConcepts: lessonData.emojiConcepts,
                difficulty: lessonData.difficulty,
                estimatedMins: lessonData.estimatedMins,
                prerequisites: lessonData.prerequisites ?? [],
                tags: lessonData.tags ?? [],
                author: lessonData.author ?? null,
                steps: {
                    create: lessonData.steps.map((step) => ({
                        stepNumber: step.stepNumber,
                        instruction: step.instruction as object,
                        emojiCode: step.emojiCode,
                        expectedOutput: step.expectedOutput ?? null,
                        hint: step.hint as object ?? null,
                        explanation: step.explanation as object ?? null,
                        validationLogic: step.validationLogic ?? null,
                    })),
                },
            },
        });
        console.log(`   ✓ ${(lessonData.title as { en: string }).en}`);
    }
    console.log(`   Created ${SEED_LESSONS.length} lessons.\n`);

    // Seed examples
    console.log('💡 Seeding example programs...');
    for (const exampleData of SEED_EXAMPLES) {
        await prisma.exampleProgram.create({
            data: {
                title: exampleData.title as object,
                description: exampleData.description as object,
                emojiCode: exampleData.emojiCode,
                category: exampleData.category,
                difficulty: exampleData.difficulty,
                expectedOutput: exampleData.expectedOutput ?? [],
                authorId: exampleData.authorId ?? null,
            },
        });
    }
    console.log(`   Created ${SEED_EXAMPLES.length} example programs.\n`);

    // Summary
    console.log('📊 Seed Summary:');
    const lessonCount = await prisma.lesson.count();
    const stepCount = await prisma.lessonStep.count();
    const exampleCount = await prisma.exampleProgram.count();

    console.log(`   Lessons: ${lessonCount}`);
    console.log(`   Lesson Steps: ${stepCount}`);
    console.log(`   Example Programs: ${exampleCount}`);

    console.log('\n✅ Database seeded successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e);
        await prisma.$disconnect();
        process.exit(1);
    });
