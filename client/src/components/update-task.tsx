import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, DialogFooter, DialogClose
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, SquarePen} from "lucide-react";
import {useEffect, useState} from "react";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/input.tsx";
import {Calendar28} from "@/components/date-picker.tsx";
import TaskPriority from "@/components/task-priority.tsx";
import TaskTags from "@/components/task-tags.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import axios from "axios";

interface UpdateTaskProps {
    task: Task;
    tags: Tag[];
}

function UpdateTask({task, tags}: UpdateTaskProps) {

    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [taskTitle, setTaskTitle] = useState(task.title || "");
    const [date, setDate] = useState<Date | undefined>(new Date(task.due_date) || undefined);
    const [priority, setPriority] = useState<string>(task.priority || "Low");
    const [description, setDescription] = useState(task.description || "");
    // Use a stable state for tags to prevent polling updates from resetting the selection while editing
    const [stableTags, setStableTags] = useState<Tag[]>(tags);
    const [tag_ids, setTag_ids] = useState<string[]>(tags.map(tag => tag.tag_id));

    useEffect(() => {
        if (open) {
            setTaskTitle(task.title || "");
            setDate(new Date(task.due_date) || undefined);
            setPriority(task.priority || "Low");
            setDescription(task.description || "");
            setStableTags(tags);
            setTag_ids(tags.map(tag => tag.tag_id));
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!taskTitle || !date || !priority || !tag_ids.length) return alert('Please fill all the fields');
        setIsLoading(true);
        try {
            const payload = {
                task_id: task.task_id,
                title: taskTitle,
                description: description,
                due_date: date,
                priority: priority,
                tag_ids: tag_ids
            };
            await axios.put('/api/updateTask', payload);
            setOpen(false);
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setIsLoading(false);
        }


    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}
                        className="bg-[#0f1a2e] hover:bg-[#0c1425] border-[#1e293b] w-auto">
                    <SquarePen className="size-5"/>
                </Button>
            </DialogTrigger>
            <DialogContent
                className="px-10 py-8 bg-[#1a2230] w-[800px] h-auto border-0 border-[var(--border-dark)] rounded-xl text-white flex flex-col">
                <DialogHeader className="flex flex-col gap-y-0.5">
                    <DialogTitle className="text-xl font-bold font-manrope">Update Task</DialogTitle>
                    <DialogDescription className="text-md font-manrope text-[#92a4c9]">
                        Update the details below.
                    </DialogDescription>
                </DialogHeader>

                {/* Move Form INSIDE Content */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <Label className="font-manrope text-bold text-lg">Task Title</Label>
                        <Input
                            id="taskTitle"
                            type="text"
                            placeholder="Task Title"
                            value={taskTitle}
                            onChange={(e) => {
                                setTaskTitle(e.target.value)
                            }}
                            required
                            className="border-[#92a4c9] text-white"
                        />
                    </div>

                    {/* Date & Priority Row */}
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <Label className="font-manrope text-bold text-lg">Due Date</Label>
                            <Calendar28 initialDate={date} onDateChange={setDate}/>
                        </div>
                        <div className="flex flex-col gap-1.5 flex-1">
                            <Label className="font-manrope text-bold text-lg">Priority</Label>
                            <TaskPriority initialPriority={priority} onPriorityChange={setPriority}/>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <Label className="font-manrope text-bold text-lg">Tags</Label>
                        {/* Pass the setter function here */}
                        <TaskTags initialTags={stableTags} onTagsChange={setTag_ids}/>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5 w-full">
                        <Label className="font-manrope text-bold text-lg">Description</Label>
                        <Textarea
                            className="w-full h-[100px] rounded-xl resize-none border-[#92a4c9] text-white"
                            placeholder="Add more details..."
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value)
                            }}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <DialogFooter className="flex mt-2 items-center justify-end gap-4 w-full">
                        <DialogClose asChild>
                            <Button className="hover:bg-[#92a4c9] text-white" variant="ghost"
                                    type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#135bec] hover:bg-[#092866] text-white h-10 w-32"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Updating...
                                </>
                            ) : (
                                "Update Task"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateTask;