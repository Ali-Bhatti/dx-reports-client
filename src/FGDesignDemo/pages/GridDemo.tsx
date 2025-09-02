import { FGCard, FGDataGrid } from '../../FGDesign';
import { GridColumn } from '@progress/kendo-react-grid';

const data = [
  { id: 1, name: 'John', age: 30, city: 'New York' },
  { id: 2, name: 'Jane', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Bob', age: 35, city: 'Chicago' },
];

const GridDemo: React.FC = () => (
  <FGCard>
    <FGDataGrid data={data} style={{ height: 300 }}>
      <GridColumn field="id" title="ID" width="60px" />
      <GridColumn field="name" title="Name" />
      <GridColumn field="age" title="Age" width="80px" />
      <GridColumn field="city" title="City" />
    </FGDataGrid>
  </FGCard>
);

export default GridDemo;
