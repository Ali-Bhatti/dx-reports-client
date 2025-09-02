import type { ReactElement } from 'react';
import ButtonsDemo from './pages/ButtonsDemo';
import InputsDemo from './pages/InputsDemo';
import GridDemo from './pages/GridDemo';

export interface ComponentDemoItem {
  key: string;
  label: string;
  path: string;
  element: ReactElement;
}

export const componentRegistry: ComponentDemoItem[] = [
  {
    key: 'buttons',
    label: 'Buttons',
    path: '/fg-demo/buttons',
    element: <ButtonsDemo />,
  },
  {
    key: 'inputs',
    label: 'Inputs',
    path: '/fg-demo/inputs',
    element: <InputsDemo />,
  },
  {
    key: 'grid',
    label: 'Grid',
    path: '/fg-demo/grid',
    element: <GridDemo />,
  },
];
