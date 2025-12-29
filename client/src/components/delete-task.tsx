import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogContent, DialogFooter, DialogClose
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Loader2, Trash} from "lucide-react";
import {useState} from "react";
import axios from "axios";


interface DeleteTaskProps {
    task?: Task
}

function DeleteTask({task}: DeleteTaskProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!task) return alert('Something went wrong');
        setIsLoading(true);
        try {
            const task_id = task.task_id;
            await axios.delete('/api/deleteTask', {data: {task_id}});
            setOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}
                        className="bg-[#0f1a2e] hover:bg-[#0c1425] border-[#1e293b] w-auto hover:text-red-500">
                    <Trash className="size-5"/>
                </Button>
            </DialogTrigger>
            <DialogContent
                className="px-10 py-8 bg-[#1a2230] w-[800px] h-auto border-0 border-[var(--border-dark)] rounded-xl text-white flex flex-col">
                <DialogHeader className="flex flex-col gap-y-0.5">
                    <DialogTitle className="text-xl font-bold font-manrope">Delete Task</DialogTitle>
                    <DialogDescription className="text-md font-manrope text-[#92a4c9]">
                        Are you sure you want to delete this task?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex mt-2 items-center justify-end gap-4 w-full">
                    <form className={`flex gap-2`} onSubmit={handleDelete}>
                        <DialogClose asChild>
                            <Button className="hover:bg-[#92a4c9] text-white h-10" variant="ghost"
                                    type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isLoading} className="bg-red-500 hover:bg-red-900 text-white h-10 w-32">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Deleting...
                                </>
                            ) : (
                                "Delete Task"
                            )}
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteTask;