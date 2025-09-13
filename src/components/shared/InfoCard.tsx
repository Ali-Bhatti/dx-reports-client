
interface InfoCardProps {
  title: string;
  value: string | number;
  className?: string;
  onClick?: () => void;
}

const InfoCard = ({
  title,
  value,
  className = '',
  onClick
}: InfoCardProps) => {
  const baseClasses = "bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200";
  const interactiveClasses = onClick ? "cursor-pointer hover:border-gray-300" : "";
  
  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      <div className="space-y-1">
        <p className="text-sm text-gray-500 font-medium">
          {title}
        </p>
        <p className="text-2xl font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};


export default InfoCard;
