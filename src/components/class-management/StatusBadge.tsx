
import { ClassStatus } from "@/types/class";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: ClassStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = (status: ClassStatus) => {
    switch (status) {
      case ClassStatus.SCHEDULED:
        return "default";
      case ClassStatus.ONGOING:
        return "secondary";
      case ClassStatus.COMPLETED:
        return "outline";
      case ClassStatus.CANCELLED:
        return "destructive";
      default:
        return "default";
    }
  };

  const getColor = (status: ClassStatus) => {
    switch (status) {
      case ClassStatus.SCHEDULED:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case ClassStatus.ONGOING:
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case ClassStatus.COMPLETED:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      case ClassStatus.CANCELLED:
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "";
    }
  };

  return (
    <Badge 
      variant={getVariant(status)}
      className={`${getColor(status)} border-0`}
    >
      {status}
    </Badge>
  );
}
