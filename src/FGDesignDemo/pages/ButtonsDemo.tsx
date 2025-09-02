import { FGButton } from '../../FGDesign';

const ButtonsDemo: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <FGButton variant="primary">Primary</FGButton>
      <FGButton variant="secondary">Secondary</FGButton>
      <FGButton variant="success">Success</FGButton>
      <FGButton variant="warning">Warning</FGButton>
      <FGButton variant="error">Error</FGButton>
      <FGButton variant="ghost">Ghost</FGButton>
    </div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <FGButton size="sm">Small</FGButton>
      <FGButton size="md">Medium</FGButton>
      <FGButton size="lg">Large</FGButton>
    </div>
  </div>
);

export default ButtonsDemo;
