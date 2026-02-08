/**
 * OpenKernel EDU - Achievements Seed Data
 * Achievement type definitions
 * 
 * @module prisma/seed/achievements.seed
 */

import type { DbAchievementType } from '../../src/database/types';
import type { MultilingualText } from '../../src/contracts/tutorial-schema';

// =============================================================================
// ACHIEVEMENT DEFINITIONS (not stored in DB, but used for display)
// =============================================================================

export interface AchievementDefinition {
    type: DbAchievementType;
    name: MultilingualText;
    description: MultilingualText;
    icon: string;
    points: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

function ml(en: string, es?: string, fr?: string, zh?: string, ar?: string): MultilingualText {
    return {
        en,
        ...(es && { es }),
        ...(fr && { fr }),
        ...(zh && { zh }),
        ...(ar && { ar }),
    };
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
    {
        type: 'first_program',
        name: ml(
            'First Steps',
            'Primeros Pasos',
            'Premiers Pas',
            '第一步',
            'الخطوات الأولى'
        ),
        description: ml(
            'Run your first emoji program successfully!',
            '¡Ejecuta tu primer programa emoji con éxito!',
            'Exécutez votre premier programme emoji avec succès!',
            '成功运行你的第一个表情符号程序！',
            'شغّل أول برنامج رموز تعبيرية بنجاح!'
        ),
        icon: '🎉',
        points: 10,
        rarity: 'common',
    },
    {
        type: 'speed_demon',
        name: ml(
            'Speed Demon',
            'Demonio de la Velocidad',
            'Démon de la Vitesse',
            '速度恶魔',
            'شيطان السرعة'
        ),
        description: ml(
            'Complete a lesson in under 2 minutes!',
            '¡Completa una lección en menos de 2 minutos!',
            'Complétez une leçon en moins de 2 minutes!',
            '在2分钟内完成一节课！',
            'أكمل درساً في أقل من دقيقتين!'
        ),
        icon: '⚡',
        points: 25,
        rarity: 'rare',
    },
    {
        type: 'polyglot',
        name: ml(
            'Polyglot',
            'Políglota',
            'Polyglotte',
            '多语言大师',
            'متعدد اللغات'
        ),
        description: ml(
            'Complete lessons in 3 different languages!',
            '¡Completa lecciones en 3 idiomas diferentes!',
            'Complétez des leçons dans 3 langues différentes!',
            '用3种不同的语言完成课程！',
            'أكمل دروساً بـ 3 لغات مختلفة!'
        ),
        icon: '🌍',
        points: 50,
        rarity: 'epic',
    },
    {
        type: 'all_lessons',
        name: ml(
            'Scholar',
            'Erudito',
            'Érudit',
            '学者',
            'عالم'
        ),
        description: ml(
            'Complete all 10 foundational lessons!',
            '¡Completa las 10 lecciones fundamentales!',
            'Complétez les 10 leçons fondamentales!',
            '完成所有10节基础课程！',
            'أكمل جميع الدروس العشرة الأساسية!'
        ),
        icon: '🎓',
        points: 100,
        rarity: 'legendary',
    },
    {
        type: 'streak_7_days',
        name: ml(
            'Week Warrior',
            'Guerrero de la Semana',
            'Guerrier de la Semaine',
            '一周勇士',
            'محارب الأسبوع'
        ),
        description: ml(
            'Study for 7 consecutive days!',
            '¡Estudia durante 7 días consecutivos!',
            'Étudiez pendant 7 jours consécutifs!',
            '连续学习7天！',
            'ادرس لمدة 7 أيام متتالية!'
        ),
        icon: '🔥',
        points: 75,
        rarity: 'epic',
    },
    {
        type: 'fibonacci_master',
        name: ml(
            'Fibonacci Master',
            'Maestro Fibonacci',
            'Maître Fibonacci',
            '斐波那契大师',
            'سيد فيبوناتشي'
        ),
        description: ml(
            'Successfully implement the Fibonacci sequence!',
            '¡Implementa exitosamente la secuencia Fibonacci!',
            'Implémentez avec succès la suite de Fibonacci!',
            '成功实现斐波那契数列！',
            'نفذ متتالية فيبوناتشي بنجاح!'
        ),
        icon: '🐚',
        points: 50,
        rarity: 'rare',
    },
    {
        type: 'loop_wizard',
        name: ml(
            'Loop Wizard',
            'Mago de los Bucles',
            'Sorcier des Boucles',
            '循环巫师',
            'ساحر الحلقات'
        ),
        description: ml(
            'Master all loop-related lessons!',
            '¡Domina todas las lecciones relacionadas con bucles!',
            'Maîtrisez toutes les leçons liées aux boucles!',
            '掌握所有与循环相关的课程！',
            'أتقن جميع دروس الحلقات!'
        ),
        icon: '🔁',
        points: 40,
        rarity: 'rare',
    },
    {
        type: 'memory_explorer',
        name: ml(
            'Memory Explorer',
            'Explorador de Memoria',
            'Explorateur de Mémoire',
            '内存探索者',
            'مستكشف الذاكرة'
        ),
        description: ml(
            'Use all 256 bytes of virtual memory!',
            '¡Usa los 256 bytes de memoria virtual!',
            'Utilisez les 256 octets de mémoire virtuelle!',
            '使用全部256字节的虚拟内存！',
            'استخدم جميع 256 بايت من الذاكرة الافتراضية!'
        ),
        icon: '💾',
        points: 75,
        rarity: 'epic',
    },
];
