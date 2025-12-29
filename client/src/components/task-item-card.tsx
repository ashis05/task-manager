import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Flag, Clock, CircleCheck, Dot} from "lucide-react";
import {useEffect, useState} from "react";
import axios from "axios";
import UpdateTask from "@/components/update-task.tsx";
import DeleteTask from "@/components/delete-task.tsx";

interface TaskItemCardProps {
    task: Task;
}

export function TaskItemCard({task}: TaskItemCardProps) {

    const [completed, setCompleted] = useState<boolean>(task.is_completed);
    const [tags, setTags] = useState<Tag[]>([]);

    const taskCompleted = async (task_id: number) => {
        const newStatus = !completed;
        setCompleted(newStatus); // Optimistic update
        try {
            await axios.put(`/api/completeTask`, {task_id, is_completed: newStatus});
        } catch (err) {
            console.error(err);
            setCompleted(completed); // Revert if API fails
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High':
                return '#ff5555';
            case 'Medium':
                return '#ffbb33';
            case 'Low':
                return '#55ff55';
        }
    }

    const getFormattedDate = (date: string | Date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    const getTags = async (task_id: number) => {
        try {
            const response = await axios.get(`/api/getTagsById`, {params: {task_id}});
            return response.data;
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        const loadTags = async () => {
            if (task.task_id) {
                const data = await getTags(task.task_id);
                if (data) setTags(data);
            }
        }
        loadTags();
        const interval = setInterval(loadTags, 1000);

        return () => clearInterval(interval);
    }, [task.task_id]);


    return (
        <Card
            className="w-full bg-[#0c1425] border-[#1e293b] rounded-xl flex flex-row items-center justify-between py-5 px-7 shadow-sm hover:bg-[#0f1a2e] transition-colors group">
            {/*Left Side:*/}
            <div className=" w-auto items-center justify-start flex gap-3 ">
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 rounded-full size-7 border-2"
                            style={{backgroundColor: completed ? "#ffffff" : "#0c1425"}}
                            onClick={() => taskCompleted(task.task_id)}>
                        {
                            completed ? <CircleCheck className="text-[#0c1425] size-7"/> : ""
                        }
                    </button>
                </div>
                <div className="flex flex-col items-start gap-2 ">
                    <h1 className="text-white font-medium text-lg">{task.title}</h1>
                    <div className="flex items-center justify-center gap-x-3">
                        <div style={{color: getPriorityColor(task.priority)}}
                             className="flex items-center justify-start gap-1">
                            <Flag className="size-4"/>
                            <span className="text-xs">{task.priority} Priority</span>
                        </div>
                        <Dot className="bg-[#1e293b] text-[#1e293b] size-1.5 rounded-full mt-1"/>
                        <div className="flex items-center justify-start gap-1 text-[#92a4c9]">
                            <Clock className="size-4" style={{color: "#92a4c9"}}/>
                            <span className="text-xs">{getFormattedDate(task.due_date)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/*Right Side*/}
            <div className="flex items-center justify-end w-1/3 gap-x-3">
                {tags.map((tag) => (

                    <Badge
                        key={tag.tag_id}
                        variant="secondary"
                        className=" text-white border-none px-4 py-1.5 font-normal rounded-lg w-auto"
                        style={{backgroundColor: tag.color}}
                    >
                        {tag.name}
                    </Badge>
                ))}
                <UpdateTask task={task} tags={tags}/>
                <DeleteTask task={task}/>
            </div>
        </Card>
    );
}