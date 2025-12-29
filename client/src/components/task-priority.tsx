import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";

interface TaskPriorityProps {
    onPriorityChange?: (priority: string) => void,
    initialPriority?: string
}

function TaskPriority({onPriorityChange, initialPriority}: TaskPriorityProps) {
    const [priority, setPriority] = useState<string>(initialPriority || "Low");

    const handlePriorityChange = (value: string) => {
        setPriority(value);
        if (onPriorityChange) {
            onPriorityChange(value);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-[208px] items-center justify-start">
                <Button className="bg-[#1a2230] hover:bg-[#92a4c9] border-[#92a4c9] font-medium"
                        variant="outline">{priority} Priority</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1a2230] text-white">
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={priority} onValueChange={handlePriorityChange}>
                    <DropdownMenuRadioItem value="Low" className="text-[#55ff55]">Low Priority</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Medium" className="text-[#ffbb33]">Medium
                        Priority</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="High" className="text-[#ff5555]">High Priority</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default TaskPriority;