import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CirclePlus, Loader2} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@radix-ui/react-label";
import {useState} from "react";
import {Calendar28} from "@/components/date-picker.tsx";
import TaskPriority from "@/components/task-priority.tsx";
import TaskTags from "@/components/task-tags.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import axios from "axios";


function CreateTask() {
    // 1. Form States
    const [taskTitle, setTaskTitle] = useState("");
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [priority, setPriority] = useState<string>("Low");
    const [description, setDescription] = useState("");
    const [tag_ids, setTag_ids] = useState<string[]>([]);

    // 2. UI States
    const [isOpen, setIsOpen] = useState(false); // To close modal on success
    const [isLoading, setIsLoading] = useState(false);

    // 3. Handle Form Submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!taskTitle || !date || !priority || !tag_ids.length) return alert('Please fill all the fields');
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                title: taskTitle,
                description: description,
                due_date: date,
                priority: priority,
                tag_ids: tag_ids
            };
            await axios.post('/api/createTask', payload, {headers: {'Authorization': `Bearer ${token}`}});
            setTaskTitle("");
            setDescription("");
            setDate(undefined);
            setTag_ids([]);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setIsLoading(false);
        }


    }

    return (
        <div>
            {/* Control the Dialog with 'open' and 'onOpenChange' */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-[#135bec] hover:bg-[#092866] text-white h-12 w-38">
                        <CirclePlus className="size-5 text-white text-bold"/>
                        <h1 className="text-lg ml-2">Create task</h1>
                    </Button>
                </DialogTrigger>

                <DialogContent
                    className="px-10 py-8 bg-[#1a2230] w-[800px] h-auto border-0 border-[var(--border-dark)] rounded-xl text-white flex flex-col">
                    <DialogHeader className="flex flex-col gap-y-0.5">
                        <DialogTitle className="text-xl font-bold font-manrope">Create New Task</DialogTitle>
                        <DialogDescription className="text-md font-manrope text-[#92a4c9]">
                            Fill in the details below to create a new task.
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
                                <Calendar28 onDateChange={setDate}/>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label className="font-manrope text-bold text-lg">Priority</Label>
                                <TaskPriority onPriorityChange={setPriority}/>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col gap-1.5 w-full">
                            <Label className="font-manrope text-bold text-lg">Tags</Label>
                            {/* Pass the setter function here */}
                            <TaskTags onTagsChange={setTag_ids}/>
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
                                        type="button">Cancel</Button>
                            </DialogClose>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-[#135bec] hover:bg-[#092866] text-white h-10 w-32"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Task"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateTask;