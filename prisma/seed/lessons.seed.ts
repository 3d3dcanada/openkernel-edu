/**
 * OpenKernel EDU - Lessons Seed Data
 * 10 foundational lessons with multilingual content
 * 
 * @module prisma/seed/lessons.seed
 */

import type { CreateLessonInput } from '../../src/database/types';
import type { MultilingualText } from '../../src/contracts/tutorial-schema';

// =============================================================================
// HELPER FUNCTIONS
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
// LESSON 1: Your First Emoji Program
// =============================================================================

const lesson01: CreateLessonInput = {
    title: ml(
        'Your First Emoji Program',
        'Tu Primer Programa Emoji',
        'Votre Premier Programme Emoji',
        '你的第一个表情符号程序',
        'برنامجك الأول بالرموز التعبيرية'
    ),
    description: ml(
        'Write and run your very first emoji program! Load a number and print it.',
        'Escribe y ejecuta tu primer programa emoji. Carga un número e imprímelo.',
        'Écrivez et exécutez votre tout premier programme emoji ! Chargez un nombre et imprimez-le.',
        '编写并运行你的第一个表情符号程序！加载一个数字并打印它。',
        'اكتب وشغّل أول برنامج رموز تعبيرية! حمّل رقماً واطبعه.'
    ),
    emojiConcepts: ['📥', '🖨️', '⏹️'],
    difficulty: 'beginner',
    estimatedMins: 5,
    prerequisites: [],
    tags: ['intro', 'basics', 'getting-started'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Type this emoji code to load the number 42 into the computer:',
                'Escribe este código emoji para cargar el número 42 en la computadora:',
                'Tapez ce code emoji pour charger le nombre 42 dans l\'ordinateur:',
                '输入此表情符号代码，将数字42加载到计算机中：',
                'اكتب هذا الكود لتحميل الرقم 42 في الحاسوب:'
            ),
            emojiCode: '📥 42',
            hint: ml(
                '📥 means LOAD - it puts a number into the computer\'s brain (register R0).',
                '📥 significa CARGAR - pone un número en el cerebro de la computadora (registro R0).',
                '📥 signifie CHARGER - il met un nombre dans le cerveau de l\'ordinateur (registre R0).',
                '📥 表示加载 - 它将一个数字放入计算机的大脑（寄存器 R0）。',
                '📥 تعني تحميل - تضع رقماً في دماغ الحاسوب (السجل R0).'
            ),
            explanation: ml(
                'The 📥 instruction loads a value into register R0. Think of R0 as a small box that holds one number.',
                'La instrucción 📥 carga un valor en el registro R0. Piensa en R0 como una pequeña caja que contiene un número.',
                'L\'instruction 📥 charge une valeur dans le registre R0. Pensez à R0 comme une petite boîte qui contient un nombre.',
                '📥 指令将一个值加载到寄存器 R0。把 R0 想象成一个能容纳一个数字的小盒子。',
                'تعليمة 📥 تحمّل قيمة في السجل R0. فكر في R0 كصندوق صغير يحتوي على رقم واحد.'
            ),
        },
        {
            stepNumber: 1,
            instruction: ml(
                'Now print the number so we can see it:',
                'Ahora imprime el número para poder verlo:',
                'Maintenant, imprimez le nombre pour le voir:',
                '现在打印这个数字，这样我们就能看到它：',
                'الآن اطبع الرقم لنتمكن من رؤيته:'
            ),
            emojiCode: '📥 42\n🖨️',
            hint: ml(
                '🖨️ means PRINT - it shows whatever number is in R0.',
                '🖨️ significa IMPRIMIR - muestra el número que está en R0.',
                '🖨️ signifie IMPRIMER - il affiche le nombre qui est dans R0.',
                '🖨️ 表示打印 - 它显示 R0 中的任何数字。',
                '🖨️ تعني طباعة - تظهر أي رقم موجود في R0.'
            ),
            explanation: ml(
                'The 🖨️ instruction outputs the current value of R0 to the console.',
                'La instrucción 🖨️ muestra el valor actual de R0 en la consola.',
                'L\'instruction 🖨️ affiche la valeur actuelle de R0 dans la console.',
                '🖨️ 指令将 R0 的当前值输出到控制台。',
                'تعليمة 🖨️ تخرج القيمة الحالية لـ R0 إلى وحدة التحكم.'
            ),
        },
        {
            stepNumber: 2,
            instruction: ml(
                'Finally, stop the program:',
                'Finalmente, detén el programa:',
                'Enfin, arrêtez le programme:',
                '最后，停止程序：',
                'أخيراً، أوقف البرنامج:'
            ),
            emojiCode: '📥 42\n🖨️\n⏹️',
            expectedOutput: '42',
            hint: ml(
                '⏹️ means HALT - it tells the computer to stop running.',
                '⏹️ significa DETENER - le dice a la computadora que pare de ejecutarse.',
                '⏹️ signifie ARRÊT - il dit à l\'ordinateur de s\'arrêter.',
                '⏹️ 表示停止 - 它告诉计算机停止运行。',
                '⏹️ تعني توقف - تخبر الحاسوب بالتوقف عن العمل.'
            ),
            explanation: ml(
                'Every program needs a ⏹️ at the end, just like how every sentence needs a period!',
                '¡Cada programa necesita un ⏹️ al final, igual que cada oración necesita un punto!',
                'Chaque programme a besoin d\'un ⏹️ à la fin, tout comme chaque phrase a besoin d\'un point!',
                '每个程序结尾都需要一个 ⏹️，就像每个句子都需要句号一样！',
                'كل برنامج يحتاج ⏹️ في النهاية، تماماً مثل كل جملة تحتاج نقطة!'
            ),
        },
    ],
};

// =============================================================================
// LESSON 2: Understanding Registers
// =============================================================================

const lesson02: CreateLessonInput = {
    title: ml(
        'Understanding Registers',
        'Entendiendo los Registros',
        'Comprendre les Registres',
        '理解寄存器',
        'فهم السجلات'
    ),
    description: ml(
        'Learn about the 8 registers (R0-R7) - the CPU\'s tiny but fast memory.',
        'Aprende sobre los 8 registros (R0-R7) - la memoria pequeña pero rápida de la CPU.',
        'Apprenez les 8 registres (R0-R7) - la mémoire petite mais rapide du CPU.',
        '了解8个寄存器（R0-R7）- CPU的微小但快速的内存。',
        'تعلم عن السجلات الثمانية (R0-R7) - ذاكرة المعالج الصغيرة والسريعة.'
    ),
    emojiConcepts: ['📥', '📋', '🖨️'],
    difficulty: 'beginner',
    estimatedMins: 8,
    prerequisites: [],
    tags: ['registers', 'cpu', 'basics'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Load a value into R0 (the default register):',
                'Carga un valor en R0 (el registro predeterminado):',
                'Chargez une valeur dans R0 (le registre par défaut):',
                '将一个值加载到 R0（默认寄存器）：',
                'حمّل قيمة في R0 (السجل الافتراضي):'
            ),
            emojiCode: '📥 100\n🖨️\n⏹️',
            expectedOutput: '100',
            explanation: ml(
                'R0 is the main working register. Most instructions use R0 by default.',
                'R0 es el registro de trabajo principal. La mayoría de las instrucciones usan R0 por defecto.',
                'R0 est le registre de travail principal. La plupart des instructions utilisent R0 par défaut.',
                'R0 是主要工作寄存器。大多数指令默认使用 R0。',
                'R0 هو سجل العمل الرئيسي. معظم التعليمات تستخدم R0 افتراضياً.'
            ),
        },
        {
            stepNumber: 1,
            instruction: ml(
                'Copy R0 to R1 to save it, then load a new value:',
                'Copia R0 a R1 para guardarlo, luego carga un nuevo valor:',
                'Copiez R0 vers R1 pour le sauvegarder, puis chargez une nouvelle valeur:',
                '将 R0 复制到 R1 以保存它，然后加载一个新值：',
                'انسخ R0 إلى R1 لحفظه، ثم حمّل قيمة جديدة:'
            ),
            emojiCode: '📥 100\n📋 R0 R1\n📥 200\n🖨️\n⏹️',
            expectedOutput: '200',
            hint: ml(
                '📋 copies from the first register to the second one.',
                '📋 copia del primer registro al segundo.',
                '📋 copie du premier registre vers le second.',
                '📋 从第一个寄存器复制到第二个。',
                '📋 تنسخ من السجل الأول إلى الثاني.'
            ),
            explanation: ml(
                'You can copy values between registers with 📋. This is like making a backup before changing R0.',
                'Puedes copiar valores entre registros con 📋. Es como hacer una copia de seguridad antes de cambiar R0.',
                'Vous pouvez copier des valeurs entre registres avec 📋. C\'est comme faire une sauvegarde avant de modifier R0.',
                '您可以使用 📋 在寄存器之间复制值。这就像在更改 R0 之前进行备份。',
                'يمكنك نسخ القيم بين السجلات باستخدام 📋. هذا مثل عمل نسخة احتياطية قبل تغيير R0.'
            ),
        },
        {
            stepNumber: 2,
            instruction: ml(
                'Watch the CPU Visualizer panel to see all 8 registers update in real-time!',
                '¡Observa el panel del Visualizador de CPU para ver los 8 registros actualizarse en tiempo real!',
                'Regardez le panneau du Visualiseur CPU pour voir les 8 registres se mettre à jour en temps réel!',
                '观察CPU可视化面板，实时查看所有8个寄存器的更新！',
                'شاهد لوحة عرض المعالج لرؤية جميع السجلات الثمانية تتحدث في الوقت الفعلي!'
            ),
            emojiCode: '📥 10\n📋 R0 R1\n📥 20\n📋 R0 R2\n📥 30\n📋 R0 R3\n🖨️\n⏹️',
            expectedOutput: '30',
            explanation: ml(
                'The CPU has 8 registers (R0-R7). Each holds one number. They\'re the fastest memory in a computer!',
                'La CPU tiene 8 registros (R0-R7). Cada uno contiene un número. ¡Son la memoria más rápida en una computadora!',
                'Le CPU a 8 registres (R0-R7). Chacun contient un nombre. C\'est la mémoire la plus rapide d\'un ordinateur!',
                'CPU有8个寄存器（R0-R7）。每个寄存器保存一个数字。它们是计算机中最快的内存！',
                'المعالج لديه 8 سجلات (R0-R7). كل واحد يحتوي على رقم. إنها أسرع ذاكرة في الحاسوب!'
            ),
        },
    ],
};

// =============================================================================
// LESSON 3: Emoji Math
// =============================================================================

const lesson03: CreateLessonInput = {
    title: ml(
        'Emoji Math',
        'Matemáticas Emoji',
        'Maths Emoji',
        '表情符号数学',
        'رياضيات الرموز التعبيرية'
    ),
    description: ml(
        'Perform arithmetic operations: add, subtract, multiply, divide.',
        'Realiza operaciones aritméticas: sumar, restar, multiplicar, dividir.',
        'Effectuez des opérations arithmétiques: addition, soustraction, multiplication, division.',
        '执行算术运算：加、减、乘、除。',
        'أجرِ العمليات الحسابية: الجمع والطرح والضرب والقسمة.'
    ),
    emojiConcepts: ['➕', '➖', '✖️', '➗'],
    difficulty: 'beginner',
    estimatedMins: 8,
    prerequisites: [],
    tags: ['math', 'arithmetic', 'basics'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Add two numbers together:',
                'Suma dos números:',
                'Additionnez deux nombres:',
                '将两个数字相加：',
                'اجمع رقمين معاً:'
            ),
            emojiCode: '📥 10\n➕ 5\n🖨️\n⏹️',
            expectedOutput: '15',
            explanation: ml(
                '➕ adds the value to R0. So R0 (10) + 5 = 15!',
                '➕ suma el valor a R0. ¡Entonces R0 (10) + 5 = 15!',
                '➕ ajoute la valeur à R0. Donc R0 (10) + 5 = 15!',
                '➕ 将值加到 R0。所以 R0 (10) + 5 = 15！',
                '➕ تضيف القيمة إلى R0. إذاً R0 (10) + 5 = 15!'
            ),
        },
        {
            stepNumber: 1,
            instruction: ml(
                'Now try subtraction:',
                'Ahora prueba la resta:',
                'Maintenant essayez la soustraction:',
                '现在尝试减法：',
                'الآن جرب الطرح:'
            ),
            emojiCode: '📥 20\n➖ 8\n🖨️\n⏹️',
            expectedOutput: '12',
            explanation: ml(
                '➖ subtracts from R0. So R0 (20) - 8 = 12!',
                '➖ resta de R0. ¡Entonces R0 (20) - 8 = 12!',
                '➖ soustrait de R0. Donc R0 (20) - 8 = 12!',
                '➖ 从 R0 中减去。所以 R0 (20) - 8 = 12！',
                '➖ تطرح من R0. إذاً R0 (20) - 8 = 12!'
            ),
        },
        {
            stepNumber: 2,
            instruction: ml(
                'Multiplication and division:',
                'Multiplicación y división:',
                'Multiplication et division:',
                '乘法和除法：',
                'الضرب والقسمة:'
            ),
            emojiCode: '📥 6\n✖️ 7\n🖨️\n➗ 2\n🖨️\n⏹️',
            expectedOutput: '42\n21',
            hint: ml(
                'Operations chain together! First 6*7=42, then 42/2=21.',
                'Las operaciones se encadenan! Primero 6*7=42, luego 42/2=21.',
                'Les opérations s\'enchaînent! D\'abord 6*7=42, puis 42/2=21.',
                '运算可以链接在一起！首先 6*7=42，然后 42/2=21。',
                'العمليات تتسلسل! أولاً 6*7=42، ثم 42/2=21.'
            ),
            explanation: ml(
                'Each operation modifies R0 in sequence. You can chain them like a calculator!',
                'Cada operación modifica R0 en secuencia. ¡Puedes encadenarlas como una calculadora!',
                'Chaque opération modifie R0 en séquence. Vous pouvez les enchaîner comme une calculatrice!',
                '每个运算按顺序修改 R0。您可以像计算器一样链接它们！',
                'كل عملية تعدل R0 بالتتابع. يمكنك سلسلتها مثل الآلة الحاسبة!'
            ),
        },
        {
            stepNumber: 3,
            instruction: ml(
                'Build your own calculator! Try: (100 + 50) * 2 - 75',
                '¡Construye tu propia calculadora! Prueba: (100 + 50) * 2 - 75',
                'Construisez votre propre calculatrice! Essayez: (100 + 50) * 2 - 75',
                '构建你自己的计算器！试试：(100 + 50) * 2 - 75',
                'ابنِ آلتك الحاسبة! جرب: (100 + 50) * 2 - 75'
            ),
            emojiCode: '📥 100\n➕ 50\n✖️ 2\n➖ 75\n🖨️\n⏹️',
            expectedOutput: '225',
            explanation: ml(
                'Real CPUs work exactly like this - one operation at a time, modifying registers.',
                'Las CPUs reales funcionan exactamente así - una operación a la vez, modificando registros.',
                'Les vrais CPU fonctionnent exactement comme ça - une opération à la fois, modifiant les registres.',
                '真正的CPU就是这样工作的 - 一次一个操作，修改寄存器。',
                'المعالجات الحقيقية تعمل تماماً هكذا - عملية واحدة في كل مرة، تعدل السجلات.'
            ),
        },
    ],
};

// =============================================================================
// LESSON 4: Loops - Repeating Things
// =============================================================================

const lesson04: CreateLessonInput = {
    title: ml(
        'Loops - Repeating Things',
        'Bucles - Repetir Cosas',
        'Boucles - Répéter des Choses',
        '循环 - 重复操作',
        'الحلقات - تكرار الأشياء'
    ),
    description: ml(
        'Make the computer repeat instructions using loops and jumps.',
        'Haz que la computadora repita instrucciones usando bucles y saltos.',
        'Faites répéter des instructions à l\'ordinateur en utilisant des boucles et des sauts.',
        '使用循环和跳转让计算机重复指令。',
        'اجعل الحاسوب يكرر التعليمات باستخدام الحلقات والقفزات.'
    ),
    emojiConcepts: ['🔁', '⏭️', '❓', '🛑'],
    difficulty: 'beginner',
    estimatedMins: 10,
    prerequisites: [],
    tags: ['loops', 'control-flow', 'basics'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Count down from 5 to 1 using JUMP:',
                'Cuenta hacia atrás del 5 al 1 usando JUMP:',
                'Comptez à rebours de 5 à 1 en utilisant JUMP:',
                '使用JUMP从5倒数到1：',
                'عد تنازلياً من 5 إلى 1 باستخدام JUMP:'
            ),
            emojiCode: '📥 5\n🖨️\n➖ 1\n❓ 5\n⏭️ 1\n⏹️',
            expectedOutput: '5\n4\n3\n2\n1',
            hint: ml(
                '⏭️ 1 means "jump back to line 1". ❓ jumps only if R0 is zero.',
                '⏭️ 1 significa "salta a la línea 1". ❓ salta solo si R0 es cero.',
                '⏭️ 1 signifie "sauter à la ligne 1". ❓ saute seulement si R0 est zéro.',
                '⏭️ 1 表示"跳转到第1行"。❓ 仅当R0为零时才跳转。',
                '⏭️ 1 تعني "اقفز إلى السطر 1". ❓ تقفز فقط إذا كان R0 صفراً.'
            ),
            explanation: ml(
                'JUMP creates a loop by going back to an earlier instruction. JUMP_IF_ZERO breaks the loop when R0 reaches 0.',
                'JUMP crea un bucle volviendo a una instrucción anterior. JUMP_IF_ZERO rompe el bucle cuando R0 llega a 0.',
                'JUMP crée une boucle en revenant à une instruction précédente. JUMP_IF_ZERO sort de la boucle quand R0 atteint 0.',
                'JUMP通过返回到较早的指令来创建循环。当R0达到0时，JUMP_IF_ZERO会跳出循环。',
                'JUMP تنشئ حلقة بالعودة إلى تعليمة سابقة. JUMP_IF_ZERO تخرج من الحلقة عندما يصل R0 إلى 0.'
            ),
        },
        {
            stepNumber: 1,
            instruction: ml(
                'Use LOOP for a simpler way to repeat:',
                'Usa LOOP para una forma más simple de repetir:',
                'Utilisez LOOP pour une façon plus simple de répéter:',
                '使用LOOP以更简单的方式重复：',
                'استخدم LOOP لطريقة أبسط للتكرار:'
            ),
            emojiCode: '📥 0\n🔁 5\n➕ 1\n🖨️\n🛑\n⏹️',
            expectedOutput: '1\n2\n3\n4\n5',
            explanation: ml(
                '🔁 N repeats the block between 🔁 and 🛑 exactly N times. Much easier than manual jumps!',
                '🔁 N repite el bloque entre 🔁 y 🛑 exactamente N veces. ¡Mucho más fácil que los saltos manuales!',
                '🔁 N répète le bloc entre 🔁 et 🛑 exactement N fois. Beaucoup plus facile que les sauts manuels!',
                '🔁 N 将 🔁 和 🛑 之间的代码块重复正好 N 次。比手动跳转容易多了！',
                '🔁 N تكرر الكتلة بين 🔁 و 🛑 بالضبط N مرات. أسهل بكثير من القفزات اليدوية!'
            ),
        },
    ],
};

// =============================================================================
// LESSON 5: Conditional Logic
// =============================================================================

const lesson05: CreateLessonInput = {
    title: ml(
        'Conditional Logic - Making Decisions',
        'Lógica Condicional - Tomando Decisiones',
        'Logique Conditionnelle - Prendre des Décisions',
        '条件逻辑 - 做出决定',
        'المنطق الشرطي - اتخاذ القرارات'
    ),
    description: ml(
        'Make your program choose different paths based on conditions.',
        'Haz que tu programa elija diferentes caminos según las condiciones.',
        'Faites choisir différents chemins à votre programme selon les conditions.',
        '让你的程序根据条件选择不同的路径。',
        'اجعل برنامجك يختار مسارات مختلفة بناءً على الشروط.'
    ),
    emojiConcepts: ['❓', '⚖️', '⏭️'],
    difficulty: 'intermediate',
    estimatedMins: 10,
    prerequisites: [],
    tags: ['conditionals', 'branching', 'control-flow'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Use JUMP_IF_ZERO to skip code when R0 is zero:',
                'Usa JUMP_IF_ZERO para saltar código cuando R0 es cero:',
                'Utilisez JUMP_IF_ZERO pour sauter du code quand R0 est zéro:',
                '当R0为零时使用JUMP_IF_ZERO跳过代码：',
                'استخدم JUMP_IF_ZERO لتخطي الكود عندما يكون R0 صفراً:'
            ),
            emojiCode: '📥 0\n❓ 4\n📥 99\n🖨️\n⏹️',
            hint: ml(
                'Since R0 is 0, ❓ jumps to line 4, skipping the PRINT.',
                'Como R0 es 0, ❓ salta a la línea 4, saltando el PRINT.',
                'Puisque R0 est 0, ❓ saute à la ligne 4, sautant le PRINT.',
                '由于R0为0，❓跳转到第4行，跳过PRINT。',
                'بما أن R0 يساوي 0، فإن ❓ تقفز إلى السطر 4، متخطية PRINT.'
            ),
            explanation: ml(
                '❓ checks if R0 is zero. If yes, it jumps to the specified line. This is how computers make decisions!',
                '❓ comprueba si R0 es cero. Si es así, salta a la línea especificada. ¡Así es como las computadoras toman decisiones!',
                '❓ vérifie si R0 est zéro. Si oui, il saute à la ligne spécifiée. C\'est ainsi que les ordinateurs prennent des décisions!',
                '❓ 检查R0是否为零。如果是，它会跳转到指定的行。这就是计算机做决定的方式！',
                '❓ تتحقق مما إذا كان R0 صفراً. إذا نعم، تقفز إلى السطر المحدد. هكذا تتخذ الحواسيب القرارات!'
            ),
        },
        {
            stepNumber: 1,
            instruction: ml(
                'Compare values with CMP:',
                'Compara valores con CMP:',
                'Comparez des valeurs avec CMP:',
                '使用CMP比较值：',
                'قارن القيم باستخدام CMP:'
            ),
            emojiCode: '📥 10\n⚖️ 10\n❓ 6\n📥 0\n🖨️\n⏹️\n📥 1\n🖨️\n⏹️',
            explanation: ml(
                '⚖️ compares R0 with a value. If they\'re equal, the zero flag is set, and ❓ will jump.',
                '⚖️ compara R0 con un valor. Si son iguales, se establece la bandera cero, y ❓ saltará.',
                '⚖️ compare R0 avec une valeur. S\'ils sont égaux, le drapeau zéro est défini, et ❓ sautera.',
                '⚖️ 将R0与一个值进行比较。如果它们相等，则设置零标志，❓将跳转。',
                '⚖️ تقارن R0 بقيمة. إذا كانتا متساويتين، يتم تعيين علم الصفر، و ❓ ستقفز.'
            ),
        },
    ],
};

// =============================================================================
// LESSON 6: Memory Basics
// =============================================================================

const lesson06: CreateLessonInput = {
    title: ml(
        'Memory - The Computer\'s Notebook',
        'Memoria - El Cuaderno de la Computadora',
        'Mémoire - Le Carnet de l\'Ordinateur',
        '内存 - 计算机的笔记本',
        'الذاكرة - دفتر الحاسوب'
    ),
    description: ml(
        'Learn to store and retrieve data from the 256-byte virtual memory.',
        'Aprende a almacenar y recuperar datos de la memoria virtual de 256 bytes.',
        'Apprenez à stocker et récupérer des données de la mémoire virtuelle de 256 octets.',
        '学习从256字节虚拟内存中存储和检索数据。',
        'تعلم تخزين واسترجاع البيانات من الذاكرة الافتراضية 256 بايت.'
    ),
    emojiConcepts: ['💾', '📥'],
    difficulty: 'intermediate',
    estimatedMins: 10,
    prerequisites: [],
    tags: ['memory', 'store', 'intermediate'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Store a value in memory:',
                'Almacena un valor en memoria:',
                'Stockez une valeur en mémoire:',
                '在内存中存储一个值：',
                'خزّن قيمة في الذاكرة:'
            ),
            emojiCode: '📥 42\n💾 R0 0\n📥 0\n🖨️\n⏹️',
            expectedOutput: '0',
            hint: ml(
                'Watch the Memory Grid light up when you store a value!',
                '¡Mira cómo la Cuadrícula de Memoria se ilumina cuando almacenas un valor!',
                'Regardez la Grille Mémoire s\'allumer quand vous stockez une valeur!',
                '当你存储一个值时，观察内存网格亮起！',
                'شاهد شبكة الذاكرة تضيء عندما تخزن قيمة!'
            ),
            explanation: ml(
                '💾 stores the value from a register into memory at a specific address. Memory keeps data even after R0 changes.',
                '💾 almacena el valor de un registro en memoria en una dirección específica. La memoria conserva los datos incluso después de que R0 cambie.',
                '💾 stocke la valeur d\'un registre en mémoire à une adresse spécifique. La mémoire garde les données même après que R0 change.',
                '💾 将寄存器中的值存储到内存中的特定地址。即使R0改变，内存也会保留数据。',
                '💾 تخزن القيمة من سجل في الذاكرة في عنوان محدد. الذاكرة تحتفظ بالبيانات حتى بعد تغير R0.'
            ),
        },
        {
            stepNumber: 1,
            instruction: ml(
                'Store multiple values and see the memory grid fill up:',
                'Almacena múltiples valores y ve cómo la cuadrícula de memoria se llena:',
                'Stockez plusieurs valeurs et voyez la grille mémoire se remplir:',
                '存储多个值，看内存网格填满：',
                'خزّن قيماً متعددة وشاهد شبكة الذاكرة تمتلئ:'
            ),
            emojiCode: '📥 72\n💾 R0 0\n📥 101\n💾 R0 1\n📥 108\n💾 R0 2\n🖨️\n⏹️',
            hint: ml(
                'Each memory address can hold a number 0-255. These are ASCII codes for "Hel"!',
                'Cada dirección de memoria puede contener un número 0-255. ¡Estos son códigos ASCII para "Hel"!',
                'Chaque adresse mémoire peut contenir un nombre 0-255. Ce sont des codes ASCII pour "Hel"!',
                '每个内存地址可以容纳0-255的数字。这些是"Hel"的ASCII码！',
                'كل عنوان ذاكرة يمكن أن يحتوي على رقم 0-255. هذه هي رموز ASCII لـ "Hel"!'
            ),
            explanation: ml(
                'Memory has 256 addresses (0-255). Each can store a byte (0-255). This is how text is stored!',
                'La memoria tiene 256 direcciones (0-255). Cada una puede almacenar un byte (0-255). ¡Así se almacena el texto!',
                'La mémoire a 256 adresses (0-255). Chacune peut stocker un octet (0-255). C\'est ainsi que le texte est stocké!',
                '内存有256个地址（0-255）。每个可以存储一个字节（0-255）。这就是文本存储的方式！',
                'الذاكرة لديها 256 عنواناً (0-255). كل واحد يمكن أن يخزن بايت (0-255). هكذا يتم تخزين النص!'
            ),
        },
    ],
};

// =============================================================================
// LESSON 7: Building a Counter
// =============================================================================

const lesson07: CreateLessonInput = {
    title: ml(
        'Building a Counter',
        'Construyendo un Contador',
        'Construire un Compteur',
        '构建计数器',
        'بناء عداد'
    ),
    description: ml(
        'Build a program that counts from 0 to any number.',
        'Construye un programa que cuente del 0 a cualquier número.',
        'Construisez un programme qui compte de 0 à n\'importe quel nombre.',
        '构建一个从0数到任意数字的程序。',
        'ابنِ برنامجاً يعد من 0 إلى أي رقم.'
    ),
    emojiConcepts: ['➕', '⚖️', '❓', '⏭️'],
    difficulty: 'intermediate',
    estimatedMins: 12,
    prerequisites: [],
    tags: ['loops', 'counter', 'intermediate'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Build a counter from 1 to 5:',
                'Construye un contador del 1 al 5:',
                'Construisez un compteur de 1 à 5:',
                '构建一个从1到5的计数器：',
                'ابنِ عداداً من 1 إلى 5:'
            ),
            emojiCode: '📥 0\n➕ 1\n🖨️\n⚖️ 5\n❓ 6\n⏭️ 1\n⏹️',
            expectedOutput: '1\n2\n3\n4\n5',
            explanation: ml(
                'This is a fundamental programming pattern: initialize, increment, check condition, loop or exit.',
                'Este es un patrón de programación fundamental: inicializar, incrementar, verificar condición, bucle o salir.',
                'C\'est un modèle de programmation fondamental: initialiser, incrémenter, vérifier la condition, boucler ou sortir.',
                '这是一个基本的编程模式：初始化、递增、检查条件、循环或退出。',
                'هذا نمط برمجة أساسي: تهيئة، زيادة، فحص الشرط، حلقة أو خروج.'
            ),
        },
    ],
};

// =============================================================================
// LESSON 8: Fibonacci Sequence
// =============================================================================

const lesson08: CreateLessonInput = {
    title: ml(
        'The Fibonacci Sequence',
        'La Secuencia Fibonacci',
        'La Suite de Fibonacci',
        '斐波那契数列',
        'متتالية فيبوناتشي'
    ),
    description: ml(
        'Implement the famous Fibonacci algorithm using emoji!',
        '¡Implementa el famoso algoritmo Fibonacci usando emoji!',
        'Implémentez le célèbre algorithme de Fibonacci avec des emoji!',
        '使用表情符号实现著名的斐波那契算法！',
        'نفذ خوارزمية فيبوناتشي الشهيرة باستخدام الرموز التعبيرية!'
    ),
    emojiConcepts: ['📋', '➕', '⚖️', '❓'],
    difficulty: 'advanced',
    estimatedMins: 15,
    prerequisites: [],
    tags: ['algorithms', 'fibonacci', 'advanced'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'The Fibonacci sequence: each number is the sum of the two before it (1, 1, 2, 3, 5, 8...). Let\'s build it!',
                'La secuencia Fibonacci: cada número es la suma de los dos anteriores (1, 1, 2, 3, 5, 8...). ¡Vamos a construirla!',
                'La suite de Fibonacci: chaque nombre est la somme des deux précédents (1, 1, 2, 3, 5, 8...). Construisons-la!',
                '斐波那契数列：每个数字是前两个数字的和（1, 1, 2, 3, 5, 8...）。让我们来构建它！',
                'متتالية فيبوناتشي: كل رقم هو مجموع الرقمين السابقين (1, 1, 2, 3, 5, 8...). لنبنيها!'
            ),
            emojiCode: `📥 1
📋 R0 R1
📋 R0 R2
🖨️
📥 R1
➕ R2
📋 R0 R3
📋 R0 R1
🖨️
📥 R2
📋 R0 R1
📥 R3
📋 R0 R2
⚖️ 100
❓ 16
⏭️ 4
⏹️`,
            explanation: ml(
                'This uses multiple registers to track the previous two Fibonacci numbers and compute the next one.',
                'Esto usa múltiples registros para rastrear los dos números Fibonacci anteriores y calcular el siguiente.',
                'Ceci utilise plusieurs registres pour suivre les deux nombres de Fibonacci précédents et calculer le suivant.',
                '这使用多个寄存器来跟踪前两个斐波那契数并计算下一个。',
                'هذا يستخدم سجلات متعددة لتتبع رقمي فيبوناتشي السابقين وحساب التالي.'
            ),
        },
    ],
};

// =============================================================================
// LESSON 9: Stack Operations
// =============================================================================

const lesson09: CreateLessonInput = {
    title: ml(
        'Stack Operations - Function Basics',
        'Operaciones de Pila - Bases de Funciones',
        'Opérations de Pile - Bases des Fonctions',
        '栈操作 - 函数基础',
        'عمليات المكدس - أساسيات الدوال'
    ),
    description: ml(
        'Learn the stack - the foundation of function calls in real computers.',
        'Aprende la pila - la base de las llamadas a funciones en computadoras reales.',
        'Apprenez la pile - le fondement des appels de fonction dans les vrais ordinateurs.',
        '学习栈 - 真实计算机中函数调用的基础。',
        'تعلم المكدس - أساس استدعاءات الدوال في الحواسيب الحقيقية.'
    ),
    emojiConcepts: ['⬆️', '⬇️'],
    difficulty: 'advanced',
    estimatedMins: 12,
    prerequisites: [],
    tags: ['stack', 'functions', 'advanced'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Push values onto the stack and pop them back (notice they come out in reverse order!):',
                'Empuja valores a la pila y sácalos (¡nota que salen en orden inverso!):',
                'Poussez des valeurs sur la pile et retirez-les (remarquez qu\'elles sortent dans l\'ordre inverse!):',
                '将值压入栈并弹出（注意它们以相反的顺序出来！）：',
                'ادفع قيماً إلى المكدس وأخرجها (لاحظ أنها تخرج بترتيب معكوس!):'
            ),
            emojiCode: '📥 1\n⬆️\n📥 2\n⬆️\n📥 3\n⬆️\n⬇️\n🖨️\n⬇️\n🖨️\n⬇️\n🖨️\n⏹️',
            expectedOutput: '3\n2\n1',
            hint: ml(
                'The stack is LIFO: Last In, First Out. Like a stack of plates!',
                'La pila es LIFO: Último en Entrar, Primero en Salir. ¡Como una pila de platos!',
                'La pile est LIFO: Dernier Entré, Premier Sorti. Comme une pile d\'assiettes!',
                '栈是后进先出（LIFO）。就像一叠盘子！',
                'المكدس هو LIFO: آخر داخل، أول خارج. مثل كومة من الأطباق!'
            ),
            explanation: ml(
                'The stack is crucial for function calls. When you call a function, the return address is pushed. When you return, it\'s popped.',
                'La pila es crucial para las llamadas a funciones. Cuando llamas a una función, la dirección de retorno se empuja. Cuando retornas, se saca.',
                'La pile est cruciale pour les appels de fonction. Quand vous appelez une fonction, l\'adresse de retour est poussée. Quand vous retournez, elle est retirée.',
                '栈对于函数调用至关重要。当你调用一个函数时，返回地址被压入。当你返回时，它被弹出。',
                'المكدس حاسم لاستدعاءات الدوال. عندما تستدعي دالة، يتم دفع عنوان العودة. عندما تعود، يتم إخراجه.'
            ),
        },
    ],
};

// =============================================================================
// LESSON 10: Your Own Mini Operating System
// =============================================================================

const lesson10: CreateLessonInput = {
    title: ml(
        'Your Own Mini Operating System',
        'Tu Propio Mini Sistema Operativo',
        'Votre Propre Mini Système d\'Exploitation',
        '你自己的迷你操作系统',
        'نظام تشغيلك المصغر الخاص'
    ),
    description: ml(
        'Combine everything you\'ve learned to build a simple OS-like program!',
        '¡Combina todo lo que has aprendido para construir un programa similar a un SO simple!',
        'Combinez tout ce que vous avez appris pour construire un programme simple semblable à un OS!',
        '结合你所学的一切，构建一个简单的类似操作系统的程序！',
        'اجمع كل ما تعلمته لبناء برنامج بسيط يشبه نظام التشغيل!'
    ),
    emojiConcepts: ['📥', '💾', '📋', '➕', '⚖️', '❓', '⏭️', '🖨️', '⏹️'],
    difficulty: 'advanced',
    estimatedMins: 20,
    prerequisites: [],
    tags: ['os', 'capstone', 'advanced'],
    steps: [
        {
            stepNumber: 0,
            instruction: ml(
                'Build a program that: 1) Initializes memory, 2) Runs a computation, 3) Stores the result, 4) Prints a report:',
                'Construye un programa que: 1) Inicializa memoria, 2) Ejecuta un cálculo, 3) Almacena el resultado, 4) Imprime un reporte:',
                'Construisez un programme qui: 1) Initialise la mémoire, 2) Exécute un calcul, 3) Stocke le résultat, 4) Imprime un rapport:',
                '构建一个程序：1) 初始化内存，2) 运行计算，3) 存储结果，4) 打印报告：',
                'ابنِ برنامجاً: 1) يهيئ الذاكرة، 2) يجري حساباً، 3) يخزن النتيجة، 4) يطبع تقريراً:'
            ),
            emojiCode: `# Mini OS: Initialize, Compute, Store, Report
# Phase 1: Initialize memory with zeros
📥 0
💾 R0 0
💾 R0 1
💾 R0 2

# Phase 2: Compute sum of 1 to 10
📥 0
📋 R0 R1
📥 1
📋 R0 R2
📥 R1
➕ R2
📋 R0 R1
📥 R2
➕ 1
📋 R0 R2
⚖️ 11
❓ 18
⏭️ 10

# Phase 3: Store result in memory
📥 R1
💾 R0 0
🖨️

# Phase 4: Halt
⏹️`,
            expectedOutput: '55',
            explanation: ml(
                'Congratulations! You\'ve built a program that mirrors what real operating systems do: initialize hardware, run processes, manage memory, and produce output.',
                '¡Felicidades! Has construido un programa que refleja lo que hacen los sistemas operativos reales: inicializar hardware, ejecutar procesos, gestionar memoria y producir salida.',
                'Félicitations! Vous avez construit un programme qui reflète ce que font les vrais systèmes d\'exploitation: initialiser le matériel, exécuter des processus, gérer la mémoire et produire une sortie.',
                '恭喜！你已经构建了一个反映真实操作系统工作的程序：初始化硬件、运行进程、管理内存和产生输出。',
                'تهانينا! لقد بنيت برنامجاً يعكس ما تفعله أنظمة التشغيل الحقيقية: تهيئة العتاد، تشغيل العمليات، إدارة الذاكرة، وإنتاج المخرجات.'
            ),
        },
    ],
};

// =============================================================================
// EXPORT ALL LESSONS
// =============================================================================

export const SEED_LESSONS: CreateLessonInput[] = [
    lesson01,
    lesson02,
    lesson03,
    lesson04,
    lesson05,
    lesson06,
    lesson07,
    lesson08,
    lesson09,
    lesson10,
];
