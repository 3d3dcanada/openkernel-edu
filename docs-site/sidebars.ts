import { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    tutorialSidebar: [
        {
            type: 'category',
            label: 'Student Guide',
            items: ['intro', 'quickstart', 'reference', 'common-mistakes'],
        },
        {
            type: 'category',
            label: 'Teacher Guide',
            items: ['teacher/curriculum-integration', 'teacher/assessment-rubrics', 'teacher/troubleshooting', 'teacher/customizing-lessons'],
        },
        {
            type: 'category',
            label: 'Developer Docs',
            items: ['dev/api-reference', 'dev/contributing', 'dev/architecture-decisions'],
        },
        {
            type: 'category',
            label: 'Curriculum Materials',
            items: ['curriculum/course-plan', 'curriculum/homework', 'curriculum/exams'],
        },
    ],
};

export default sidebars;
