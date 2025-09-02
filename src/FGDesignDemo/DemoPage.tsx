import React from 'react';
import {
  FGButton,
  FGDropdown,
  FGTextbox,
  FGDataGrid,
  FGCard,
  FGThemeProvider,
} from '../FGDesign';
import { GridColumn } from '@progress/kendo-react-grid';

const DemoPage: React.FC = () => {
  const dropdownData = ['Apple', 'Banana', 'Orange'];
  const gridData = [
    { id: 1, name: 'John', age: 30, city: 'New York' },
    { id: 2, name: 'Jane', age: 25, city: 'Los Angeles' },
    { id: 3, name: 'Bob', age: 35, city: 'Chicago' },
  ];

  return (
    <FGThemeProvider>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <h2>FGDesign Demo</h2>

        <section>
          <h3>Buttons</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <FGButton variant="primary">Primary</FGButton>
            <FGButton variant="secondary">Secondary</FGButton>
            <FGButton variant="success">Success</FGButton>
            <FGButton variant="warning">Warning</FGButton>
            <FGButton variant="error">Error</FGButton>
            <FGButton variant="ghost">Ghost</FGButton>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <FGButton size="sm">Small</FGButton>
            <FGButton size="md">Medium</FGButton>
            <FGButton size="lg">Large</FGButton>
          </div>
        </section>

        <section>
          <h3>Form Inputs</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <FGTextbox label="Name" placeholder="Enter name" />
            <FGDropdown label="Fruit" data={dropdownData} defaultValue={dropdownData[0]} />
          </div>
        </section>

        <section>
          <h3>Data Grid</h3>
          <FGCard>
            <FGDataGrid data={gridData} style={{ height: 300 }}>
              <GridColumn field="id" title="ID" width="60px" />
              <GridColumn field="name" title="Name" />
              <GridColumn field="age" title="Age" width="80px" />
              <GridColumn field="city" title="City" />
            </FGDataGrid>
          </FGCard>
        </section>
      </div>
    </FGThemeProvider>
  );
};

export default DemoPage;

