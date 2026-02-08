/**
 * OpenKernel EDU - Language Middleware
 * Parses Accept-Language header for i18n support
 *
 * @module api/middleware/language
 */

import type { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { SupportedLanguage } from '../../contracts/tutorial-schema';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'es', 'fr', 'zh', 'ar', 'hi', 'pt', 'ru'];
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/**
 * Parse Accept-Language header and set request context
 */
export function languageMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const acceptLanguage = req.headers['accept-language'] ?? '';
    const language = parseAcceptLanguage(acceptLanguage);

    req.context = {
        language,
        requestId: uuidv4(),
        userId: req.headers['x-user-id'] as string | undefined,
    };

    next();
}

/**
 * Parse Accept-Language header and return best matching language
 */
function parseAcceptLanguage(header: string): SupportedLanguage {
    if (!header) return DEFAULT_LANGUAGE;

    // Parse header: "en-US,en;q=0.9,es;q=0.8"
    const languages = header
        .split(',')
        .map(part => {
            const [lang, q] = part.trim().split(';q=');
            return {
                language: lang.trim(),
                quality: q ? parseFloat(q) : 1.0,
            };
        })
        .sort((a, b) => b.quality - a.quality);

    for (const { language } of languages) {
        // Check exact match
        if (SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)) {
            return language as SupportedLanguage;
        }

        // Check language prefix (e.g., "en-US" -> "en")
        const prefix = language.split('-')[0];
        if (SUPPORTED_LANGUAGES.includes(prefix as SupportedLanguage)) {
            return prefix as SupportedLanguage;
        }

        // Special case: "zh" -> "zh-CN"
        if (prefix === 'zh') {
            return 'zh';
        }
    }

    return DEFAULT_LANGUAGE;
}
