import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParentLearner } from '@/contexts/ParentLearnerContext';
import { useNavigate, useNavigation } from "react-router-dom";

export function ParentLearnerSelector() {
  const {
    selectedLearner,
    setSelectedLearner,
    learners
  } = useParentLearner();
  const navigate = useNavigate();

  return (
    <Select
      value={selectedLearner?.id || ""}
      onValueChange={(value) => {
        const learner = learners.find(l => l.id === value);
        setSelectedLearner(learner || learners[0]);
        navigate("/parent/")
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a learner" />
      </SelectTrigger>
      <SelectContent>
        {learners.map((learner) => (
          <SelectItem key={learner.id} value={learner.id}>
            <div className="flex items-center gap-2">
              <span className="font-medium">{learner.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
