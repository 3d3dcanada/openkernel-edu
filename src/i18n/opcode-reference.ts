/**
 * OpenKernel EDU - Multilingual Opcode Reference
 * Translations for all 24 EmojiASM opcodes
 * 
 * @module i18n/opcode-reference
 * @version 1.0.0
 */

import { Opcode } from '../core/types';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'zh' | 'ar';

export interface OpcodeTranslation {
    name: string;
    description: string;
    usage: string;
    example: string;
}

export type OpcodeReference = Record<SupportedLanguage, OpcodeTranslation>;

/**
 * Complete multilingual reference for all opcodes
 */
export const OPCODE_TRANSLATIONS: Record<Opcode, OpcodeReference> = {
    // === DATA MOVEMENT ===
    [Opcode.LOAD]: {
        en: {
            name: 'LOAD',
            description: 'Load a value into a register',
            usage: '📥 value [register]',
            example: '📥 42  # Load 42 into R0',
        },
        es: {
            name: 'CARGAR',
            description: 'Cargar un valor en un registro',
            usage: '📥 valor [registro]',
            example: '📥 42  # Cargar 42 en R0',
        },
        fr: {
            name: 'CHARGER',
            description: 'Charger une valeur dans un registre',
            usage: '📥 valeur [registre]',
            example: '📥 42  # Charger 42 dans R0',
        },
        zh: {
            name: '加载',
            description: '将值加载到寄存器',
            usage: '📥 值 [寄存器]',
            example: '📥 42  # 将42加载到R0',
        },
        ar: {
            name: 'تحميل',
            description: 'تحميل قيمة في سجل',
            usage: '📥 قيمة [سجل]',
            example: '📥 42  # تحميل 42 في R0',
        },
    },

    [Opcode.STORE]: {
        en: {
            name: 'STORE',
            description: 'Store register value to memory',
            usage: '💾 register address',
            example: '💾 R0 100  # Store R0 at address 100',
        },
        es: {
            name: 'GUARDAR',
            description: 'Guardar valor del registro en memoria',
            usage: '💾 registro dirección',
            example: '💾 R0 100  # Guardar R0 en dirección 100',
        },
        fr: {
            name: 'STOCKER',
            description: 'Stocker la valeur du registre en mémoire',
            usage: '💾 registre adresse',
            example: '💾 R0 100  # Stocker R0 à l\'adresse 100',
        },
        zh: {
            name: '存储',
            description: '将寄存器值存储到内存',
            usage: '💾 寄存器 地址',
            example: '💾 R0 100  # 将R0存储到地址100',
        },
        ar: {
            name: 'تخزين',
            description: 'تخزين قيمة السجل في الذاكرة',
            usage: '💾 سجل عنوان',
            example: '💾 R0 100  # تخزين R0 في العنوان 100',
        },
    },

    [Opcode.COPY]: {
        en: {
            name: 'COPY',
            description: 'Copy value from one register to another',
            usage: '📋 source destination',
            example: '📋 R0 R1  # Copy R0 to R1',
        },
        es: {
            name: 'COPIAR',
            description: 'Copiar valor de un registro a otro',
            usage: '📋 origen destino',
            example: '📋 R0 R1  # Copiar R0 a R1',
        },
        fr: {
            name: 'COPIER',
            description: 'Copier la valeur d\'un registre à un autre',
            usage: '📋 source destination',
            example: '📋 R0 R1  # Copier R0 vers R1',
        },
        zh: {
            name: '复制',
            description: '将值从一个寄存器复制到另一个',
            usage: '📋 源 目标',
            example: '📋 R0 R1  # 将R0复制到R1',
        },
        ar: {
            name: 'نسخ',
            description: 'نسخ القيمة من سجل إلى آخر',
            usage: '📋 مصدر هدف',
            example: '📋 R0 R1  # نسخ R0 إلى R1',
        },
    },

    // === ARITHMETIC ===
    [Opcode.ADD]: {
        en: {
            name: 'ADD',
            description: 'Add value to R0',
            usage: '➕ value',
            example: '➕ 5  # R0 = R0 + 5',
        },
        es: {
            name: 'SUMAR',
            description: 'Sumar valor a R0',
            usage: '➕ valor',
            example: '➕ 5  # R0 = R0 + 5',
        },
        fr: {
            name: 'AJOUTER',
            description: 'Ajouter une valeur à R0',
            usage: '➕ valeur',
            example: '➕ 5  # R0 = R0 + 5',
        },
        zh: {
            name: '加',
            description: '将值加到R0',
            usage: '➕ 值',
            example: '➕ 5  # R0 = R0 + 5',
        },
        ar: {
            name: 'جمع',
            description: 'إضافة قيمة إلى R0',
            usage: '➕ قيمة',
            example: '➕ 5  # R0 = R0 + 5',
        },
    },

    [Opcode.SUB]: {
        en: {
            name: 'SUBTRACT',
            description: 'Subtract value from R0',
            usage: '➖ value',
            example: '➖ 3  # R0 = R0 - 3',
        },
        es: {
            name: 'RESTAR',
            description: 'Restar valor de R0',
            usage: '➖ valor',
            example: '➖ 3  # R0 = R0 - 3',
        },
        fr: {
            name: 'SOUSTRAIRE',
            description: 'Soustraire une valeur de R0',
            usage: '➖ valeur',
            example: '➖ 3  # R0 = R0 - 3',
        },
        zh: {
            name: '减',
            description: '从R0减去值',
            usage: '➖ 值',
            example: '➖ 3  # R0 = R0 - 3',
        },
        ar: {
            name: 'طرح',
            description: 'طرح قيمة من R0',
            usage: '➖ قيمة',
            example: '➖ 3  # R0 = R0 - 3',
        },
    },

    [Opcode.MUL]: {
        en: {
            name: 'MULTIPLY',
            description: 'Multiply R0 by value',
            usage: '✖️ value',
            example: '✖️ 2  # R0 = R0 × 2',
        },
        es: {
            name: 'MULTIPLICAR',
            description: 'Multiplicar R0 por valor',
            usage: '✖️ valor',
            example: '✖️ 2  # R0 = R0 × 2',
        },
        fr: {
            name: 'MULTIPLIER',
            description: 'Multiplier R0 par une valeur',
            usage: '✖️ valeur',
            example: '✖️ 2  # R0 = R0 × 2',
        },
        zh: {
            name: '乘',
            description: '将R0乘以值',
            usage: '✖️ 值',
            example: '✖️ 2  # R0 = R0 × 2',
        },
        ar: {
            name: 'ضرب',
            description: 'ضرب R0 في قيمة',
            usage: '✖️ قيمة',
            example: '✖️ 2  # R0 = R0 × 2',
        },
    },

    [Opcode.DIV]: {
        en: {
            name: 'DIVIDE',
            description: 'Divide R0 by value (integer division)',
            usage: '➗ value',
            example: '➗ 4  # R0 = R0 ÷ 4',
        },
        es: {
            name: 'DIVIDIR',
            description: 'Dividir R0 por valor (división entera)',
            usage: '➗ valor',
            example: '➗ 4  # R0 = R0 ÷ 4',
        },
        fr: {
            name: 'DIVISER',
            description: 'Diviser R0 par une valeur (division entière)',
            usage: '➗ valeur',
            example: '➗ 4  # R0 = R0 ÷ 4',
        },
        zh: {
            name: '除',
            description: '将R0除以值（整数除法）',
            usage: '➗ 值',
            example: '➗ 4  # R0 = R0 ÷ 4',
        },
        ar: {
            name: 'قسمة',
            description: 'قسمة R0 على قيمة (قسمة صحيحة)',
            usage: '➗ قيمة',
            example: '➗ 4  # R0 = R0 ÷ 4',
        },
    },

    [Opcode.MOD]: {
        en: {
            name: 'MODULO',
            description: 'R0 modulo value (remainder)',
            usage: '📊 value',
            example: '📊 3  # R0 = R0 % 3',
        },
        es: {
            name: 'MÓDULO',
            description: 'R0 módulo valor (resto)',
            usage: '📊 valor',
            example: '📊 3  # R0 = R0 % 3',
        },
        fr: {
            name: 'MODULO',
            description: 'R0 modulo valeur (reste)',
            usage: '📊 valeur',
            example: '📊 3  # R0 = R0 % 3',
        },
        zh: {
            name: '取模',
            description: 'R0模值（余数）',
            usage: '📊 值',
            example: '📊 3  # R0 = R0 % 3',
        },
        ar: {
            name: 'باقي القسمة',
            description: 'باقي قسمة R0 على قيمة',
            usage: '📊 قيمة',
            example: '📊 3  # R0 = R0 % 3',
        },
    },

    // === LOGIC ===
    [Opcode.AND]: {
        en: {
            name: 'AND',
            description: 'Bitwise AND with value',
            usage: '🔀 value',
            example: '🔀 15  # R0 = R0 AND 15',
        },
        es: {
            name: 'Y',
            description: 'Y lógico bit a bit con valor',
            usage: '🔀 valor',
            example: '🔀 15  # R0 = R0 AND 15',
        },
        fr: {
            name: 'ET',
            description: 'ET logique bit à bit avec valeur',
            usage: '🔀 valeur',
            example: '🔀 15  # R0 = R0 AND 15',
        },
        zh: {
            name: '与',
            description: '按位与值',
            usage: '🔀 值',
            example: '🔀 15  # R0 = R0 AND 15',
        },
        ar: {
            name: 'و',
            description: 'عملية AND على مستوى البت',
            usage: '🔀 قيمة',
            example: '🔀 15  # R0 = R0 AND 15',
        },
    },

    [Opcode.OR]: {
        en: {
            name: 'OR',
            description: 'Bitwise OR with value',
            usage: '🔃 value',
            example: '🔃 8  # R0 = R0 OR 8',
        },
        es: {
            name: 'O',
            description: 'O lógico bit a bit con valor',
            usage: '🔃 valor',
            example: '🔃 8  # R0 = R0 OR 8',
        },
        fr: {
            name: 'OU',
            description: 'OU logique bit à bit avec valeur',
            usage: '🔃 valeur',
            example: '🔃 8  # R0 = R0 OR 8',
        },
        zh: {
            name: '或',
            description: '按位或值',
            usage: '🔃 值',
            example: '🔃 8  # R0 = R0 OR 8',
        },
        ar: {
            name: 'أو',
            description: 'عملية OR على مستوى البت',
            usage: '🔃 قيمة',
            example: '🔃 8  # R0 = R0 OR 8',
        },
    },

    [Opcode.NOT]: {
        en: {
            name: 'NOT',
            description: 'Bitwise NOT of R0',
            usage: '❌',
            example: '❌  # R0 = NOT R0',
        },
        es: {
            name: 'NO',
            description: 'NO lógico bit a bit de R0',
            usage: '❌',
            example: '❌  # R0 = NOT R0',
        },
        fr: {
            name: 'NON',
            description: 'NON logique bit à bit de R0',
            usage: '❌',
            example: '❌  # R0 = NOT R0',
        },
        zh: {
            name: '非',
            description: 'R0的按位非',
            usage: '❌',
            example: '❌  # R0 = NOT R0',
        },
        ar: {
            name: 'نفي',
            description: 'عملية NOT على مستوى البت لـ R0',
            usage: '❌',
            example: '❌  # R0 = NOT R0',
        },
    },

    [Opcode.XOR]: {
        en: {
            name: 'XOR',
            description: 'Bitwise XOR with value',
            usage: '🔄 value',
            example: '🔄 255  # R0 = R0 XOR 255',
        },
        es: {
            name: 'XOR',
            description: 'XOR bit a bit con valor',
            usage: '🔄 valor',
            example: '🔄 255  # R0 = R0 XOR 255',
        },
        fr: {
            name: 'XOR',
            description: 'XOR bit à bit avec valeur',
            usage: '🔄 valeur',
            example: '🔄 255  # R0 = R0 XOR 255',
        },
        zh: {
            name: '异或',
            description: '按位异或值',
            usage: '🔄 值',
            example: '🔄 255  # R0 = R0 XOR 255',
        },
        ar: {
            name: 'XOR',
            description: 'عملية XOR على مستوى البت',
            usage: '🔄 قيمة',
            example: '🔄 255  # R0 = R0 XOR 255',
        },
    },

    [Opcode.CMP]: {
        en: {
            name: 'COMPARE',
            description: 'Compare R0 with value, set flags',
            usage: '⚖️ value',
            example: '⚖️ 10  # Compare R0 with 10',
        },
        es: {
            name: 'COMPARAR',
            description: 'Comparar R0 con valor, establecer banderas',
            usage: '⚖️ valor',
            example: '⚖️ 10  # Comparar R0 con 10',
        },
        fr: {
            name: 'COMPARER',
            description: 'Comparer R0 avec une valeur, définir les drapeaux',
            usage: '⚖️ valeur',
            example: '⚖️ 10  # Comparer R0 avec 10',
        },
        zh: {
            name: '比较',
            description: '将R0与值比较，设置标志',
            usage: '⚖️ 值',
            example: '⚖️ 10  # 将R0与10比较',
        },
        ar: {
            name: 'مقارنة',
            description: 'مقارنة R0 بقيمة، تعيين الأعلام',
            usage: '⚖️ قيمة',
            example: '⚖️ 10  # مقارنة R0 بـ 10',
        },
    },

    // === CONTROL FLOW ===
    [Opcode.JUMP]: {
        en: {
            name: 'JUMP',
            description: 'Unconditional jump to line',
            usage: '⏭️ line',
            example: '⏭️ 0  # Jump to line 0',
        },
        es: {
            name: 'SALTAR',
            description: 'Salto incondicional a línea',
            usage: '⏭️ línea',
            example: '⏭️ 0  # Saltar a línea 0',
        },
        fr: {
            name: 'SAUTER',
            description: 'Saut inconditionnel à la ligne',
            usage: '⏭️ ligne',
            example: '⏭️ 0  # Sauter à la ligne 0',
        },
        zh: {
            name: '跳转',
            description: '无条件跳转到行',
            usage: '⏭️ 行',
            example: '⏭️ 0  # 跳转到第0行',
        },
        ar: {
            name: 'قفز',
            description: 'قفز غير مشروط إلى سطر',
            usage: '⏭️ سطر',
            example: '⏭️ 0  # القفز إلى السطر 0',
        },
    },

    [Opcode.JUMP_IF_ZERO]: {
        en: {
            name: 'JUMP IF ZERO',
            description: 'Jump to line if Zero flag is set',
            usage: '❓ line',
            example: '❓ 5  # Jump to line 5 if R0=0',
        },
        es: {
            name: 'SALTAR SI CERO',
            description: 'Saltar a línea si la bandera Zero está activa',
            usage: '❓ línea',
            example: '❓ 5  # Saltar a línea 5 si R0=0',
        },
        fr: {
            name: 'SAUTER SI ZÉRO',
            description: 'Sauter à la ligne si le drapeau Zero est actif',
            usage: '❓ ligne',
            example: '❓ 5  # Sauter à la ligne 5 si R0=0',
        },
        zh: {
            name: '零则跳转',
            description: '如果零标志被设置则跳转到行',
            usage: '❓ 行',
            example: '❓ 5  # 如果R0=0则跳转到第5行',
        },
        ar: {
            name: 'قفز إذا صفر',
            description: 'القفز إلى سطر إذا كان علم الصفر مفعل',
            usage: '❓ سطر',
            example: '❓ 5  # القفز إلى السطر 5 إذا R0=0',
        },
    },

    [Opcode.LOOP]: {
        en: {
            name: 'LOOP',
            description: 'Begin loop block (count iterations)',
            usage: '🔁 count',
            example: '🔁 10  # Repeat 10 times',
        },
        es: {
            name: 'BUCLE',
            description: 'Iniciar bloque de bucle (contar iteraciones)',
            usage: '🔁 cuenta',
            example: '🔁 10  # Repetir 10 veces',
        },
        fr: {
            name: 'BOUCLE',
            description: 'Début du bloc de boucle (compter les itérations)',
            usage: '🔁 compte',
            example: '🔁 10  # Répéter 10 fois',
        },
        zh: {
            name: '循环',
            description: '开始循环块（计数迭代）',
            usage: '🔁 次数',
            example: '🔁 10  # 重复10次',
        },
        ar: {
            name: 'حلقة',
            description: 'بدء كتلة حلقة (عدد التكرارات)',
            usage: '🔁 عدد',
            example: '🔁 10  # تكرار 10 مرات',
        },
    },

    [Opcode.RETURN]: {
        en: {
            name: 'RETURN',
            description: 'End loop block / Return from call',
            usage: '🛑',
            example: '🛑  # End loop or return',
        },
        es: {
            name: 'RETORNO',
            description: 'Fin del bloque de bucle / Retorno de llamada',
            usage: '🛑',
            example: '🛑  # Fin de bucle o retorno',
        },
        fr: {
            name: 'RETOUR',
            description: 'Fin du bloc de boucle / Retour d\'appel',
            usage: '🛑',
            example: '🛑  # Fin de boucle ou retour',
        },
        zh: {
            name: '返回',
            description: '结束循环块/从调用返回',
            usage: '🛑',
            example: '🛑  # 结束循环或返回',
        },
        ar: {
            name: 'عودة',
            description: 'إنهاء كتلة حلقة / العودة من استدعاء',
            usage: '🛑',
            example: '🛑  # إنهاء حلقة أو عودة',
        },
    },

    [Opcode.CALL]: {
        en: {
            name: 'CALL',
            description: 'Call subroutine at line',
            usage: '📞 line',
            example: '📞 10  # Call subroutine at line 10',
        },
        es: {
            name: 'LLAMAR',
            description: 'Llamar subrutina en línea',
            usage: '📞 línea',
            example: '📞 10  # Llamar subrutina en línea 10',
        },
        fr: {
            name: 'APPELER',
            description: 'Appeler sous-routine à la ligne',
            usage: '📞 ligne',
            example: '📞 10  # Appeler sous-routine à la ligne 10',
        },
        zh: {
            name: '调用',
            description: '调用行处的子程序',
            usage: '📞 行',
            example: '📞 10  # 调用第10行的子程序',
        },
        ar: {
            name: 'استدعاء',
            description: 'استدعاء روتين فرعي في سطر',
            usage: '📞 سطر',
            example: '📞 10  # استدعاء روتين فرعي في السطر 10',
        },
    },

    // === I/O ===
    [Opcode.PRINT]: {
        en: {
            name: 'PRINT',
            description: 'Output R0 value to console',
            usage: '🖨️',
            example: '🖨️  # Print R0',
        },
        es: {
            name: 'IMPRIMIR',
            description: 'Mostrar valor de R0 en consola',
            usage: '🖨️',
            example: '🖨️  # Imprimir R0',
        },
        fr: {
            name: 'IMPRIMER',
            description: 'Afficher la valeur de R0 dans la console',
            usage: '🖨️',
            example: '🖨️  # Imprimer R0',
        },
        zh: {
            name: '打印',
            description: '将R0值输出到控制台',
            usage: '🖨️',
            example: '🖨️  # 打印R0',
        },
        ar: {
            name: 'طباعة',
            description: 'إخراج قيمة R0 إلى وحدة التحكم',
            usage: '🖨️',
            example: '🖨️  # طباعة R0',
        },
    },

    [Opcode.INPUT]: {
        en: {
            name: 'INPUT',
            description: 'Read input into R0',
            usage: '📲',
            example: '📲  # Read input into R0',
        },
        es: {
            name: 'ENTRADA',
            description: 'Leer entrada en R0',
            usage: '📲',
            example: '📲  # Leer entrada en R0',
        },
        fr: {
            name: 'ENTRÉE',
            description: 'Lire l\'entrée dans R0',
            usage: '📲',
            example: '📲  # Lire entrée dans R0',
        },
        zh: {
            name: '输入',
            description: '将输入读入R0',
            usage: '📲',
            example: '📲  # 将输入读入R0',
        },
        ar: {
            name: 'إدخال',
            description: 'قراءة المدخلات في R0',
            usage: '📲',
            example: '📲  # قراءة المدخلات في R0',
        },
    },

    // === STACK ===
    [Opcode.PUSH]: {
        en: {
            name: 'PUSH',
            description: 'Push R0 onto stack',
            usage: '⬆️',
            example: '⬆️  # Push R0 to stack',
        },
        es: {
            name: 'APILAR',
            description: 'Apilar R0 en la pila',
            usage: '⬆️',
            example: '⬆️  # Apilar R0',
        },
        fr: {
            name: 'EMPILER',
            description: 'Empiler R0 sur la pile',
            usage: '⬆️',
            example: '⬆️  # Empiler R0',
        },
        zh: {
            name: '入栈',
            description: '将R0压入栈',
            usage: '⬆️',
            example: '⬆️  # 将R0压入栈',
        },
        ar: {
            name: 'دفع',
            description: 'دفع R0 إلى المكدس',
            usage: '⬆️',
            example: '⬆️  # دفع R0 إلى المكدس',
        },
    },

    [Opcode.POP]: {
        en: {
            name: 'POP',
            description: 'Pop stack into R0',
            usage: '⬇️',
            example: '⬇️  # Pop stack to R0',
        },
        es: {
            name: 'DESAPILAR',
            description: 'Desapilar de la pila a R0',
            usage: '⬇️',
            example: '⬇️  # Desapilar a R0',
        },
        fr: {
            name: 'DÉPILER',
            description: 'Dépiler dans R0',
            usage: '⬇️',
            example: '⬇️  # Dépiler dans R0',
        },
        zh: {
            name: '出栈',
            description: '将栈顶弹出到R0',
            usage: '⬇️',
            example: '⬇️  # 将栈顶弹出到R0',
        },
        ar: {
            name: 'سحب',
            description: 'سحب من المكدس إلى R0',
            usage: '⬇️',
            example: '⬇️  # سحب إلى R0',
        },
    },

    // === SYSTEM ===
    [Opcode.HALT]: {
        en: {
            name: 'HALT',
            description: 'Stop program execution',
            usage: '⏹️',
            example: '⏹️  # Stop program',
        },
        es: {
            name: 'DETENER',
            description: 'Detener ejecución del programa',
            usage: '⏹️',
            example: '⏹️  # Detener programa',
        },
        fr: {
            name: 'ARRÊTER',
            description: 'Arrêter l\'exécution du programme',
            usage: '⏹️',
            example: '⏹️  # Arrêter le programme',
        },
        zh: {
            name: '停止',
            description: '停止程序执行',
            usage: '⏹️',
            example: '⏹️  # 停止程序',
        },
        ar: {
            name: 'إيقاف',
            description: 'إيقاف تنفيذ البرنامج',
            usage: '⏹️',
            example: '⏹️  # إيقاف البرنامج',
        },
    },

    [Opcode.SLEEP]: {
        en: {
            name: 'SLEEP',
            description: 'Pause execution (milliseconds)',
            usage: '💤 ms',
            example: '💤 1000  # Sleep 1 second',
        },
        es: {
            name: 'DORMIR',
            description: 'Pausar ejecución (milisegundos)',
            usage: '💤 ms',
            example: '💤 1000  # Dormir 1 segundo',
        },
        fr: {
            name: 'PAUSE',
            description: 'Pause d\'exécution (millisecondes)',
            usage: '💤 ms',
            example: '💤 1000  # Pause 1 seconde',
        },
        zh: {
            name: '休眠',
            description: '暂停执行（毫秒）',
            usage: '💤 毫秒',
            example: '💤 1000  # 休眠1秒',
        },
        ar: {
            name: 'نوم',
            description: 'إيقاف التنفيذ مؤقتاً (بالميلي ثانية)',
            usage: '💤 مللي ثانية',
            example: '💤 1000  # نوم ثانية واحدة',
        },
    },

    [Opcode.NOP]: {
        en: {
            name: 'NOP',
            description: 'No operation',
            usage: '⏸️',
            example: '⏸️  # Do nothing',
        },
        es: {
            name: 'NOP',
            description: 'Sin operación',
            usage: '⏸️',
            example: '⏸️  # No hacer nada',
        },
        fr: {
            name: 'NOP',
            description: 'Pas d\'opération',
            usage: '⏸️',
            example: '⏸️  # Ne rien faire',
        },
        zh: {
            name: '无操作',
            description: '不执行任何操作',
            usage: '⏸️',
            example: '⏸️  # 不做任何事',
        },
        ar: {
            name: 'لا عملية',
            description: 'لا توجد عملية',
            usage: '⏸️',
            example: '⏸️  # لا تفعل شيئاً',
        },
    },
};

/**
 * Get opcode translation for a specific language
 */
export function getOpcodeTranslation(
    opcode: Opcode,
    language: SupportedLanguage = 'en'
): OpcodeTranslation {
    return OPCODE_TRANSLATIONS[opcode][language];
}

/**
 * Get all opcodes with translations for a language
 */
export function getAllOpcodeTranslations(
    language: SupportedLanguage = 'en'
): Array<{ emoji: Opcode; translation: OpcodeTranslation }> {
    return Object.entries(OPCODE_TRANSLATIONS).map(([emoji, translations]) => ({
        emoji: emoji as Opcode,
        translation: translations[language],
    }));
}

/**
 * Supported language names for display
 */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    zh: '中文',
    ar: 'العربية',
};
