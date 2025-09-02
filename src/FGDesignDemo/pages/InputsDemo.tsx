import { FGTextbox, FGDropdown } from '../../FGDesign';

const InputsDemo: React.FC = () => {
  const fruits = ['Apple', 'Banana', 'Orange'];
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <FGTextbox label="Name" placeholder="Enter name" />
      <FGDropdown label="Fruit" data={fruits} defaultValue={fruits[0]} />
    </div>
  );
};

export default InputsDemo;
