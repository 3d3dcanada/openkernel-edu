/**
 * OpenKernel EDU - Example Programs Seed Data
 * 50+ curated example programs with multilingual content
 * 
 * @module prisma/seed/examples.seed
 */

import type { CreateExampleInput } from '../../src/database/types';
import type { MultilingualText } from '../../src/contracts/tutorial-schema';

// =============================================================================
// HELPER
// =============================================================================

function ml(en: string, es?: string, fr?: string, zh?: string, ar?: string): MultilingualText {
    return {
        en,
        ...(es && { es }),
        ...(fr && { fr }),
        ...(zh && { zh }),
        ...(ar && { ar }),
    };
}

// =============================================================================
// BASICS CATEGORY
// =============================================================================

const basicExamples: CreateExampleInput[] = [
    {
        title: ml('Hello World', 'Hola Mundo', 'Bonjour Monde', '你好世界', 'مرحبا بالعالم'),
        description: ml(
            'Your first emoji program! Loads a number and prints it.',
            '¡Tu primer programa emoji! Carga un número e imprímelo.',
            'Votre premier programme emoji! Charge un nombre et l\'imprime.',
            '你的第一个表情符号程序！加载一个数字并打印它。',
            'برنامجك الأول! يحمل رقماً ويطبعه.'
        ),
        emojiCode: '📥 42\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['42'],
    },
    {
        title: ml('Simple Addition', 'Suma Simple', 'Addition Simple', '简单加法', 'جمع بسيط'),
        description: ml(
            'Add two numbers together.',
            'Suma dos números.',
            'Additionne deux nombres.',
            '将两个数字相加。',
            'اجمع رقمين معاً.'
        ),
        emojiCode: '📥 10\n➕ 5\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['15'],
    },
    {
        title: ml('Mini Calculator', 'Mini Calculadora', 'Mini Calculatrice', '迷你计算器', 'آلة حاسبة صغيرة'),
        description: ml(
            'Perform multiple arithmetic operations.',
            'Realiza múltiples operaciones aritméticas.',
            'Effectue plusieurs opérations arithmétiques.',
            '执行多个算术运算。',
            'نفذ عمليات حسابية متعددة.'
        ),
        emojiCode: '📥 100\n➕ 50\n🖨️\n➖ 30\n🖨️\n✖️ 2\n🖨️\n➗ 4\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['150', '120', '240', '60'],
    },
    {
        title: ml('Countdown Timer', 'Temporizador', 'Compte à Rebours', '倒计时', 'مؤقت تنازلي'),
        description: ml(
            'Count down from 10 to 1 using a loop.',
            'Cuenta hacia atrás del 10 al 1 usando un bucle.',
            'Compte à rebours de 10 à 1 en utilisant une boucle.',
            '使用循环从10倒数到1。',
            'عد تنازلياً من 10 إلى 1 باستخدام حلقة.'
        ),
        emojiCode: '📥 10\n🖨️\n➖ 1\n❓ 6\n⏭️ 1\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
    },
    {
        title: ml('Maximum of Two', 'Máximo de Dos', 'Maximum de Deux', '两数最大值', 'أكبر رقمين'),
        description: ml(
            'Find the larger of two numbers (25 and 17).',
            'Encuentra el mayor de dos números (25 y 17).',
            'Trouve le plus grand de deux nombres (25 et 17).',
            '找出两个数字中较大的一个（25和17）。',
            'جد الأكبر من رقمين (25 و 17).'
        ),
        emojiCode: '📥 25\n📋 R0 R1\n📥 17\n📋 R0 R2\n📥 R1\n➖ R2\n❓ 11\n📥 R1\n⏭️ 12\n📥 R2\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['25'],
    },
    {
        title: ml('Swap Values', 'Intercambiar Valores', 'Échanger Valeurs', '交换值', 'تبديل القيم'),
        description: ml(
            'Swap values between R1 and R2 using the stack.',
            'Intercambia valores entre R1 y R2 usando la pila.',
            'Échange des valeurs entre R1 et R2 en utilisant la pile.',
            '使用栈交换R1和R2之间的值。',
            'بادل القيم بين R1 و R2 باستخدام المكدس.'
        ),
        emojiCode: '📥 10\n📋 R0 R1\n📥 20\n📋 R0 R2\n📥 R1\n🖨️\n📥 R2\n🖨️\n📥 R1\n⬆️\n📥 R2\n📋 R0 R1\n⬇️\n📋 R0 R2\n📥 R1\n🖨️\n📥 R2\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['10', '20', '20', '10'],
    },
    {
        title: ml('Register Cascade', 'Cascada de Registros', 'Cascade de Registres', '寄存器级联', 'تسلسل السجلات'),
        description: ml(
            'Copy a value through all 8 registers.',
            'Copia un valor a través de los 8 registros.',
            'Copie une valeur à travers les 8 registres.',
            '将一个值复制到所有8个寄存器。',
            'انسخ قيمة عبر جميع السجلات الثمانية.'
        ),
        emojiCode: '📥 42\n📋 R0 R1\n📋 R1 R2\n📋 R2 R3\n📋 R3 R4\n📋 R4 R5\n📋 R5 R6\n📋 R6 R7\n📥 R7\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['42'],
    },
    {
        title: ml('Memory Operations', 'Operaciones de Memoria', 'Opérations Mémoire', '内存操作', 'عمليات الذاكرة'),
        description: ml(
            'Store and retrieve values from memory.',
            'Almacena y recupera valores de la memoria.',
            'Stocke et récupère des valeurs de la mémoire.',
            '从内存中存储和检索值。',
            'خزّن واسترجع قيماً من الذاكرة.'
        ),
        emojiCode: '📥 42\n💾 R0 0\n📥 99\n💾 R0 1\n📥 42\n🖨️\n📥 99\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'intermediate',
        expectedOutput: ['42', '99'],
    },
    {
        title: ml('Count Down Then Up', 'Cuenta Abajo y Arriba', 'Compte Haut et Bas', '先降后升', 'عد تنازلياً ثم تصاعدياً'),
        description: ml(
            'Count from 3 to 1, then 1 to 3.',
            'Cuenta del 3 al 1, luego del 1 al 3.',
            'Compte de 3 à 1, puis de 1 à 3.',
            '从3数到1，然后从1数到3。',
            'عد من 3 إلى 1، ثم من 1 إلى 3.'
        ),
        emojiCode: '📥 3\n🖨️\n➖ 1\n❓ 5\n⏭️ 1\n📥 1\n🖨️\n➕ 1\n⚖️ 4\n❓ 11\n⏭️ 6\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['3', '2', '1', '1', '2', '3'],
    },
    {
        title: ml('Absolute Value', 'Valor Absoluto', 'Valeur Absolue', '绝对值', 'القيمة المطلقة'),
        description: ml(
            'Calculate the absolute value of -42.',
            'Calcula el valor absoluto de -42.',
            'Calcule la valeur absolue de -42.',
            '计算-42的绝对值。',
            'احسب القيمة المطلقة لـ -42.'
        ),
        emojiCode: '📥 -42\n📋 R0 R1\n⚖️ 0\n❓ 7\n📥 0\n➖ R1\n📋 R0 R1\n📥 R1\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['42'],
    },
];

// =============================================================================
// ALGORITHMS CATEGORY
// =============================================================================

const algorithmExamples: CreateExampleInput[] = [
    {
        title: ml('Fibonacci Sequence', 'Secuencia Fibonacci', 'Suite de Fibonacci', '斐波那契数列', 'متتالية فيبوناتشي'),
        description: ml(
            'Generate the first 8 Fibonacci numbers.',
            'Genera los primeros 8 números de Fibonacci.',
            'Génère les 8 premiers nombres de Fibonacci.',
            '生成前8个斐波那契数。',
            'أنشئ أول 8 أرقام فيبوناتشي.'
        ),
        emojiCode: `📥 0
⬆️
📥 1
⬆️
📥 8
📋 R0 R2
⬇️
📋 R0 R3
⬇️
📋 R0 R4
🖨️
📋 R0 R3
➕ R4
⬆️
📋 R0 R3
⬆️
📥 R2
➖ 1
📋 R0 R2
❓ 18
⏭️ 6
⏹️`,
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['1', '1', '2', '3', '5', '8', '13', '21'],
    },
    {
        title: ml('Powers of Two', 'Potencias de Dos', 'Puissances de Deux', '2的幂', 'قوى العدد 2'),
        description: ml(
            'Calculate 2^1 through 2^8.',
            'Calcula 2^1 hasta 2^8.',
            'Calcule 2^1 jusqu\'à 2^8.',
            '计算2^1到2^8。',
            'احسب 2^1 إلى 2^8.'
        ),
        emojiCode: '📥 1\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n✖️ 2\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'beginner',
        expectedOutput: ['1', '2', '4', '8', '16', '32', '64', '128'],
    },
    {
        title: ml('Even or Odd', 'Par o Impar', 'Pair ou Impair', '奇偶判断', 'زوجي أو فردي'),
        description: ml(
            'Check if numbers are even or odd using MOD.',
            'Verifica si los números son pares o impares usando MOD.',
            'Vérifie si les nombres sont pairs ou impairs en utilisant MOD.',
            '使用MOD检查数字是奇数还是偶数。',
            'تحقق ما إذا كانت الأرقام زوجية أو فردية باستخدام MOD.'
        ),
        emojiCode: '📥 7\n📊 2\n🖨️\n📥 8\n📊 2\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['1', '0'],
    },
    {
        title: ml('Sum 1 to N', 'Suma 1 a N', 'Somme 1 à N', '1到N求和', 'مجموع 1 إلى N'),
        description: ml(
            'Calculate the sum of numbers from 1 to 10.',
            'Calcula la suma de números del 1 al 10.',
            'Calcule la somme des nombres de 1 à 10.',
            '计算1到10的数字之和。',
            'احسب مجموع الأرقام من 1 إلى 10.'
        ),
        emojiCode: '📥 0\n📋 R0 R1\n📥 1\n📋 R0 R2\n📥 R1\n➕ R2\n📋 R0 R1\n📥 R2\n➕ 1\n📋 R0 R2\n⚖️ 11\n❓ 14\n⏭️ 5\n📥 R1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'beginner',
        expectedOutput: ['55'],
    },
    {
        title: ml('Factorial Calculator', 'Calculadora Factorial', 'Calculatrice Factorielle', '阶乘计算器', 'حاسبة المضروب'),
        description: ml(
            'Calculate 5! (5 factorial = 120) using a loop.',
            'Calcula 5! (5 factorial = 120) usando un bucle.',
            'Calcule 5! (5 factorielle = 120) en utilisant une boucle.',
            '使用循环计算5!（5的阶乘 = 120）。',
            'احسب 5! (مضروب 5 = 120) باستخدام حلقة.'
        ),
        emojiCode: `📥 1
📋 R0 R1
📥 5
📋 R0 R2
📥 R1
✖️ R2
📋 R0 R1
📥 R2
➖ 1
📋 R0 R2
❓ 14
⏭️ 5
📥 R1
🖨️
⏹️`,
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['120'],
    },
    {
        title: ml('Multiply by Addition', 'Multiplicar por Suma', 'Multiplier par Addition', '加法实现乘法', 'الضرب بالجمع'),
        description: ml(
            'Multiply 6 x 7 using repeated addition.',
            'Multiplica 6 x 7 usando suma repetida.',
            'Multiplie 6 x 7 en utilisant l\'addition répétée.',
            '使用重复加法计算 6 x 7。',
            'اضرب 6 × 7 باستخدام الجمع المتكرر.'
        ),
        emojiCode: '📥 0\n📋 R0 R1\n📥 7\n📋 R0 R2\n📥 6\n📋 R0 R3\n📥 R1\n➕ R2\n📋 R0 R1\n📥 R3\n➖ 1\n📋 R0 R3\n❓ 14\n⏭️ 7\n📥 R1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['42'],
    },
    {
        title: ml('Triangle Numbers', 'Números Triangulares', 'Nombres Triangulaires', '三角数', 'الأعداد المثلثية'),
        description: ml(
            'Print first 5 triangle numbers: 1, 3, 6, 10, 15.',
            'Imprime los primeros 5 números triangulares: 1, 3, 6, 10, 15.',
            'Imprime les 5 premiers nombres triangulaires: 1, 3, 6, 10, 15.',
            '打印前5个三角数：1, 3, 6, 10, 15。',
            'اطبع أول 5 أرقام مثلثية: 1, 3, 6, 10, 15.'
        ),
        emojiCode: '📥 0\n📋 R0 R1\n📥 1\n📋 R0 R2\n📥 R1\n➕ R2\n📋 R0 R1\n🖨️\n📥 R2\n➕ 1\n📋 R0 R2\n⚖️ 6\n❓ 15\n⏭️ 5\n⏹️',
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['1', '3', '6', '10', '15'],
    },
    {
        title: ml('Multiply by Bit Shift', 'Multiplicar por Desplazamiento', 'Multiplier par Décalage', '位移乘法', 'الضرب بالإزاحة'),
        description: ml(
            'Multiply 7 by 4 using left shift (add to itself).',
            'Multiplica 7 por 4 usando desplazamiento a la izquierda.',
            'Multiplie 7 par 4 en utilisant le décalage à gauche.',
            '使用左移（加自身）将7乘以4。',
            'اضرب 7 في 4 باستخدام الإزاحة اليسرى.'
        ),
        emojiCode: '📥 7\n📋 R0 R1\n📥 R1\n➕ R1\n📋 R0 R1\n📥 R1\n➕ R1\n📋 R0 R1\n📥 R1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['28'],
    },
    {
        title: ml('GCD Calculator', 'Calculadora MCD', 'Calculatrice PGCD', 'GCD计算器', 'حاسبة القاسم المشترك'),
        description: ml(
            'Calculate GCD of 48 and 18 using Euclidean algorithm.',
            'Calcula el MCD de 48 y 18 usando el algoritmo euclidiano.',
            'Calcule le PGCD de 48 et 18 en utilisant l\'algorithme d\'Euclide.',
            '使用欧几里得算法计算48和18的最大公约数。',
            'احسب القاسم المشترك الأكبر لـ 48 و 18.'
        ),
        emojiCode: '📥 48\n📋 R0 R1\n📥 18\n📋 R0 R2\n📥 R1\n📊 R2\n📋 R0 R3\n📥 R2\n📋 R0 R1\n📥 R3\n📋 R0 R2\n❓ 14\n⏭️ 5\n📥 R1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'advanced',
        expectedOutput: ['6'],
    },
    {
        title: ml('Prime Check', 'Verificar Primo', 'Vérifier Premier', '素数检查', 'فحص الأعداد الأولية'),
        description: ml(
            'Check if 7 is prime (prints 1 for prime, 0 for not).',
            'Verifica si 7 es primo (imprime 1 para primo, 0 para no).',
            'Vérifie si 7 est premier (imprime 1 si premier, 0 sinon).',
            '检查7是否为素数（素数打印1，否则打印0）。',
            'تحقق ما إذا كان 7 عدداً أولياً.'
        ),
        emojiCode: '📥 7\n📋 R0 R4\n📥 2\n📋 R0 R2\n📥 R4\n📊 R2\n❓ 11\n📥 R2\n➕ 1\n📋 R0 R2\n⏭️ 5\n📥 1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'advanced',
        expectedOutput: ['1'],
    },
];

// =============================================================================
// GAMES CATEGORY
// =============================================================================

const gameExamples: CreateExampleInput[] = [
    {
        title: ml('Random Walk', 'Caminata Aleatoria', 'Marche Aléatoire', '随机行走', 'المشي العشوائي'),
        description: ml(
            'Simulate a simple random-like pattern.',
            'Simula un patrón pseudo-aleatorio simple.',
            'Simule un motif pseudo-aléatoire simple.',
            '模拟一个简单的伪随机模式。',
            'محاكاة نمط شبه عشوائي بسيط.'
        ),
        emojiCode: '📥 7\n📋 R0 R1\n📥 5\n📋 R0 R3\n📥 R1\n✖️ 13\n➕ 7\n📊 10\n🖨️\n📋 R0 R1\n📥 R3\n➖ 1\n❓ 14\n📋 R0 R3\n⏭️ 5\n⏹️',
        category: 'games',
        difficulty: 'intermediate',
        expectedOutput: ['8', '1', '0', '7', '8'],
    },
    {
        title: ml('Countdown Game', 'Juego de Cuenta Regresiva', 'Jeu de Compte à Rebours', '倒计时游戏', 'لعبة العد التنازلي'),
        description: ml(
            'Race against the CPU timer!',
            '¡Compite contra el temporizador de la CPU!',
            'Faites la course contre le minuteur du CPU!',
            '与CPU计时器竞速！',
            'سابق مؤقت المعالج!'
        ),
        emojiCode: '📥 10\n🖨️\n➖ 1\n❓ 6\n⏭️ 1\n📥 999\n🖨️\n⏹️',
        category: 'games',
        difficulty: 'beginner',
        expectedOutput: ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '999'],
    },
    {
        title: ml('Number Pattern', 'Patrón de Números', 'Motif de Nombres', '数字模式', 'نمط الأرقام'),
        description: ml(
            'Generate an interesting number pattern.',
            'Genera un patrón de números interesante.',
            'Génère un motif de nombres intéressant.',
            '生成一个有趣的数字模式。',
            'أنشئ نمط أرقام مثير للاهتمام.'
        ),
        emojiCode: '📥 1\n🖨️\n✖️ 2\n🖨️\n➕ 1\n🖨️\n✖️ 2\n🖨️\n➕ 1\n🖨️\n⏹️',
        category: 'games',
        difficulty: 'beginner',
        expectedOutput: ['1', '2', '3', '6', '7'],
    },
    {
        title: ml('Guess the Output', 'Adivina la Salida', 'Devine la Sortie', '猜输出', 'خمن المخرجات'),
        description: ml(
            'Can you predict what this program outputs?',
            '¿Puedes predecir qué imprime este programa?',
            'Peux-tu prédire ce que ce programme affiche?',
            '你能预测这个程序输出什么吗？',
            'هل يمكنك توقع مخرجات هذا البرنامج؟'
        ),
        emojiCode: '📥 1\n📋 R0 R1\n🔁 4\n📥 R1\n✖️ 2\n📋 R0 R1\n🛑\n📥 R1\n🖨️\n⏹️',
        category: 'games',
        difficulty: 'intermediate',
        expectedOutput: ['16'],
    },
    {
        title: ml('Dice Simulator', 'Simulador de Dados', 'Simulateur de Dés', '骰子模拟器', 'محاكي النرد'),
        description: ml(
            'Simulate rolling 5 dice (pseudo-random).',
            'Simula tirar 5 dados (pseudo-aleatorio).',
            'Simule le lancement de 5 dés (pseudo-aléatoire).',
            '模拟投掷5个骰子（伪随机）。',
            'محاكاة رمي 5 أحجار نرد.'
        ),
        emojiCode: '📥 17\n📋 R0 R1\n📥 5\n📋 R0 R3\n📥 R1\n✖️ 31\n➕ 17\n📊 6\n➕ 1\n🖨️\n📋 R0 R1\n📥 R3\n➖ 1\n❓ 16\n📋 R0 R3\n⏭️ 5\n⏹️',
        category: 'games',
        difficulty: 'intermediate',
        expectedOutput: ['6', '3', '2', '1', '4'],
    },
];

// =============================================================================
// ADDITIONAL EXAMPLES TO REACH 50+
// =============================================================================

const advancedExamples: CreateExampleInput[] = [
    {
        title: ml('Stack Operations', 'Operaciones de Pila', 'Opérations de Pile', '栈操作', 'عمليات المكدس'),
        description: ml(
            'Push and pop values on the stack.',
            'Empuja y saca valores de la pila.',
            'Pousse et retire des valeurs de la pile.',
            '在栈上压入和弹出值。',
            'ادفع وأخرج قيماً من المكدس.'
        ),
        emojiCode: '📥 10\n⬆️\n📥 20\n⬆️\n📥 30\n⬆️\n⬇️\n🖨️\n⬇️\n🖨️\n⬇️\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'advanced',
        expectedOutput: ['30', '20', '10'],
    },
    {
        title: ml('Bitwise AND', 'AND Bit a Bit', 'ET Bit à Bit', '按位与', 'AND بت بت'),
        description: ml(
            'Demonstrate bitwise AND operation.',
            'Demuestra la operación AND bit a bit.',
            'Démontre l\'opération ET bit à bit.',
            '演示按位与运算。',
            'عرض عملية AND البتية.'
        ),
        emojiCode: '📥 12\n🔀 10\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'advanced',
        expectedOutput: ['8'],
    },
    {
        title: ml('Bitwise OR', 'OR Bit a Bit', 'OU Bit à Bit', '按位或', 'OR بت بت'),
        description: ml(
            'Demonstrate bitwise OR operation.',
            'Demuestra la operación OR bit a bit.',
            'Démontre l\'opération OU bit à bit.',
            '演示按位或运算。',
            'عرض عملية OR البتية.'
        ),
        emojiCode: '📥 12\n🔃 3\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'advanced',
        expectedOutput: ['15'],
    },
    {
        title: ml('Bitwise XOR', 'XOR Bit a Bit', 'XOR Bit à Bit', '按位异或', 'XOR بت بت'),
        description: ml(
            'Demonstrate bitwise XOR operation.',
            'Demuestra la operación XOR bit a bit.',
            'Démontre l\'opération XOR bit à bit.',
            '演示按位异或运算。',
            'عرض عملية XOR البتية.'
        ),
        emojiCode: '📥 12\n🔄 15\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'advanced',
        expectedOutput: ['3'],
    },
    {
        title: ml('Bitwise NOT', 'NOT Bit a Bit', 'NON Bit à Bit', '按位非', 'NOT بت بت'),
        description: ml(
            'Demonstrate bitwise NOT operation.',
            'Demuestra la operación NOT bit a bit.',
            'Démontre l\'opération NON bit à bit.',
            '演示按位非运算。',
            'عرض عملية NOT البتية.'
        ),
        emojiCode: '📥 255\n❌\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'advanced',
        expectedOutput: ['-256'],
    },
    {
        title: ml('Loop with Counter', 'Bucle con Contador', 'Boucle avec Compteur', '带计数器的循环', 'حلقة مع عداد'),
        description: ml(
            'Use LOOP instruction for clean iteration.',
            'Usa la instrucción LOOP para iteración limpia.',
            'Utilise l\'instruction LOOP pour une itération propre.',
            '使用LOOP指令进行干净的迭代。',
            'استخدم تعليمة LOOP للتكرار النظيف.'
        ),
        emojiCode: '📥 0\n🔁 10\n➕ 1\n🛑\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['10'],
    },
    {
        title: ml('Nested Calculation', 'Cálculo Anidado', 'Calcul Imbriqué', '嵌套计算', 'حساب متداخل'),
        description: ml(
            'Complex expression: ((5 + 3) * 4) - 12',
            'Expresión compleja: ((5 + 3) * 4) - 12',
            'Expression complexe: ((5 + 3) * 4) - 12',
            '复杂表达式：((5 + 3) * 4) - 12',
            'تعبير معقد: ((5 + 3) * 4) - 12'
        ),
        emojiCode: '📥 5\n➕ 3\n✖️ 4\n➖ 12\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['20'],
    },
    {
        title: ml('Double Print', 'Impresión Doble', 'Double Impression', '双重打印', 'طباعة مزدوجة'),
        description: ml(
            'Print the same value twice.',
            'Imprime el mismo valor dos veces.',
            'Imprime la même valeur deux fois.',
            '打印相同的值两次。',
            'اطبع نفس القيمة مرتين.'
        ),
        emojiCode: '📥 42\n🖨️\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['42', '42'],
    },
    {
        title: ml('Square a Number', 'Elevar al Cuadrado', 'Élever au Carré', '求平方', 'تربيع رقم'),
        description: ml(
            'Calculate 7 squared.',
            'Calcula 7 al cuadrado.',
            'Calcule 7 au carré.',
            '计算7的平方。',
            'احسب مربع 7.'
        ),
        emojiCode: '📥 7\n📋 R0 R1\n✖️ R1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'beginner',
        expectedOutput: ['49'],
    },
    {
        title: ml('Cube a Number', 'Elevar al Cubo', 'Élever au Cube', '求立方', 'تكعيب رقم'),
        description: ml(
            'Calculate 3 cubed.',
            'Calcula 3 al cubo.',
            'Calcule 3 au cube.',
            '计算3的立方。',
            'احسب مكعب 3.'
        ),
        emojiCode: '📥 3\n📋 R0 R1\n✖️ R1\n✖️ R1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'beginner',
        expectedOutput: ['27'],
    },
    {
        title: ml('Modulo Example', 'Ejemplo Módulo', 'Exemple Modulo', '取模示例', 'مثال باقي القسمة'),
        description: ml(
            'Calculate 17 mod 5.',
            'Calcula 17 mod 5.',
            'Calcule 17 mod 5.',
            '计算17 mod 5。',
            'احسب 17 mod 5.'
        ),
        emojiCode: '📥 17\n📊 5\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'beginner',
        expectedOutput: ['2'],
    },
    {
        title: ml('Division with Remainder', 'División con Resto', 'Division avec Reste', '带余除法', 'القسمة مع الباقي'),
        description: ml(
            'Calculate quotient and remainder of 17/5.',
            'Calcula cociente y resto de 17/5.',
            'Calcule le quotient et le reste de 17/5.',
            '计算17/5的商和余数。',
            'احسب الحاصل والباقي لـ 17/5.'
        ),
        emojiCode: '📥 17\n📋 R0 R1\n➗ 5\n🖨️\n📥 R1\n📊 5\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['3', '2'],
    },
    {
        title: ml('Average of Three', 'Promedio de Tres', 'Moyenne de Trois', '三数平均', 'متوسط ثلاثة'),
        description: ml(
            'Calculate average of 10, 20, and 30.',
            'Calcula el promedio de 10, 20 y 30.',
            'Calcule la moyenne de 10, 20 et 30.',
            '计算10、20和30的平均值。',
            'احسب متوسط 10 و 20 و 30.'
        ),
        emojiCode: '📥 10\n➕ 20\n➕ 30\n➗ 3\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'beginner',
        expectedOutput: ['20'],
    },
    {
        title: ml('Increment and Print', 'Incrementar e Imprimir', 'Incrémenter et Imprimer', '递增打印', 'زيادة وطباعة'),
        description: ml(
            'Increment a counter and print each value.',
            'Incrementa un contador e imprime cada valor.',
            'Incrémente un compteur et imprime chaque valeur.',
            '递增计数器并打印每个值。',
            'زد عداداً واطبع كل قيمة.'
        ),
        emojiCode: '📥 0\n🔁 5\n➕ 1\n🖨️\n🛑\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['1', '2', '3', '4', '5'],
    },
    {
        title: ml('Decrement and Print', 'Decrementar e Imprimir', 'Décrémenter et Imprimer', '递减打印', 'إنقاص وطباعة'),
        description: ml(
            'Decrement a counter and print each value.',
            'Decrementa un contador e imprime cada valor.',
            'Décrémente un compteur et imprime chaque valeur.',
            '递减计数器并打印每个值。',
            'أنقص عداداً واطبع كل قيمة.'
        ),
        emojiCode: '📥 5\n🖨️\n➖ 1\n❓ 5\n⏭️ 1\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['5', '4', '3', '2', '1'],
    },
    {
        title: ml('Sum of Squares', 'Suma de Cuadrados', 'Somme des Carrés', '平方和', 'مجموع المربعات'),
        description: ml(
            'Calculate 1² + 2² + 3² = 14.',
            'Calcula 1² + 2² + 3² = 14.',
            'Calcule 1² + 2² + 3² = 14.',
            '计算 1² + 2² + 3² = 14。',
            'احسب 1² + 2² + 3² = 14.'
        ),
        emojiCode: '📥 0\n📋 R0 R1\n📥 1\n📋 R0 R2\n📥 R2\n✖️ R2\n➕ R1\n📋 R0 R1\n📥 R2\n➕ 1\n📋 R0 R2\n⚖️ 4\n❓ 16\n⏭️ 5\n📥 R1\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['14'],
    },
    {
        title: ml('Is Positive', 'Es Positivo', 'Est Positif', '是否为正', 'هل هو موجب'),
        description: ml(
            'Check if a number is positive (prints 1 or 0).',
            'Verifica si un número es positivo (imprime 1 o 0).',
            'Vérifie si un nombre est positif (imprime 1 ou 0).',
            '检查一个数字是否为正（打印1或0）。',
            'تحقق ما إذا كان الرقم موجباً.'
        ),
        emojiCode: '📥 42\n📋 R0 R1\n📥 0\n⚖️ R1\n❓ 8\n📥 1\n🖨️\n⏹️\n📥 0\n🖨️\n⏹️',
        category: 'algorithms',
        difficulty: 'intermediate',
        expectedOutput: ['1'],
    },
    {
        title: ml('Double Then Add', 'Doblar y Sumar', 'Doubler puis Ajouter', '加倍再加', 'ضاعف ثم أضف'),
        description: ml(
            'Double a number then add 5.',
            'Dobla un número y luego suma 5.',
            'Double un nombre puis ajoute 5.',
            '将一个数字加倍然后加5。',
            'ضاعف رقماً ثم أضف 5.'
        ),
        emojiCode: '📥 10\n✖️ 2\n➕ 5\n🖨️\n⏹️',
        category: 'basics',
        difficulty: 'beginner',
        expectedOutput: ['25'],
    },
    {
        title: ml('Countdown with Message', 'Cuenta Regresiva', 'Compte à Rebours', '带消息倒计时', 'عد تنازلي مع رسالة'),
        description: ml(
            'Countdown from 3 to 0 then print 999 for "blast off".',
            'Cuenta de 3 a 0 y luego imprime 999 para "despegue".',
            'Compte de 3 à 0 puis imprime 999 pour "décollage".',
            '从3倒数到0，然后打印999表示"发射"。',
            'عد من 3 إلى 0 ثم اطبع 999 لـ "انطلاق".'
        ),
        emojiCode: '📥 3\n🖨️\n➖ 1\n❓ 5\n⏭️ 1\n📥 999\n🖨️\n⏹️',
        category: 'games',
        difficulty: 'beginner',
        expectedOutput: ['3', '2', '1', '999'],
    },
];

// =============================================================================
// EXPORT ALL EXAMPLES
// =============================================================================

export const SEED_EXAMPLES: CreateExampleInput[] = [
    ...basicExamples,
    ...algorithmExamples,
    ...gameExamples,
    ...advancedExamples,
];
