import { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
    title: 'OpenKernel EDU docs',
    tagline: 'The world\'s most accessible computer science education platform.',
    favicon: 'img/favicon.ico',

    url: 'https://docs.openkernel.edu',
    baseUrl: '/',

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'es', 'fr', 'zh-CN', 'ar', 'hi'],
        localeConfigs: {
            en: { label: 'English' },
            es: { label: 'Español' },
            fr: { label: 'Français' },
            'zh-CN': { label: '中文' },
            ar: { label: 'العربية', direction: 'rtl' },
            hi: { label: 'हिन्दी' },
        },
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: 'https://github.com/openkernel-edu/openkernel-edu/tree/main/docs-site/',
                },
                blog: {
                    showReadingTime: true,
                    editUrl: 'https://github.com/openkernel-edu/openkernel-edu/tree/main/docs-site/',
                },
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'OpenKernel EDU',
            logo: {
                alt: 'OpenKernel EDU Logo',
                src: 'img/logo.svg',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Student Guide',
                },
                { to: '/blog', label: 'Blog', position: 'left' },
                {
                    type: 'localeDropdown',
                    position: 'right',
                },
                {
                    href: 'https://github.com/openkernel-edu/openkernel-edu',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Student Guide',
                            to: '/docs/intro',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Discord',
                            href: 'https://discord.gg/openkernel',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/openkernel',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/openkernel-edu/openkernel-edu',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} OpenKernel EDU. Built with Docusaurus.`,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
