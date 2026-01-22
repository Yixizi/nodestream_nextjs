import { Button } from "@/components/ui/button";
import { useExecuteWorkflow } from "@/features/workflows/hooks/use-workflows";
import { FlaskConical } from "lucide-react";

interface Props {
    workflowId: string;
}

export const ExecuteWorkflowButton = ({ workflowId }: Props) => {

    const executeWorkflow = useExecuteWorkflow();
    const handleExecute = () => {
        executeWorkflow.mutate({
            id: workflowId,
        });
    }
    return (
        <Button size={'lg'} onClick={handleExecute} disabled={executeWorkflow.isPending}>
            <FlaskConical className="size-4" />
            <span>执行</span>
        </Button>
    );
};