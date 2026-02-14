// OpenKernel EDU - Live Demo Registry
import { lazy } from 'react';

export interface DemoInfo {
  id: string;
  titleKey: string;
  descKey: string;
  icon: string;
  concepts: string[];
}

export const DEMOS: DemoInfo[] = [
  {
    id: 'emoji-kernel-v1',
    titleKey: 'demos.demo1_title',
    descKey: 'demos.demo1_desc',
    icon: '\u2699\uFE0F',
    concepts: ['Processes', 'Scheduling', 'Syscalls', 'Memory', 'Filesystem'],
  },
  {
    id: 'emoji-kernel-v2',
    titleKey: 'demos.demo2_title',
    descKey: 'demos.demo2_desc',
    icon: '\u{1F310}',
    concepts: ['Virtual Memory', 'Networking', 'IPC', 'Devices', 'Terminal'],
  },
  {
    id: 'emoji-os-3d',
    titleKey: 'demos.demo3_title',
    descKey: 'demos.demo3_desc',
    icon: '\u{1F4BB}',
    concepts: ['Multi-core CPU', 'System Monitoring', 'Embedded Apps', 'Performance'],
  },
];

// Lazy-load demos to keep bundle small
export const DemoComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'emoji-kernel-v1': lazy(() => import('./EmojiKernelV1')),
  'emoji-kernel-v2': lazy(() => import('./EmojiKernelV2')),
  'emoji-os-3d': lazy(() => import('./EmojiOS3D')),
};
