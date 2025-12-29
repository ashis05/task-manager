import {useOutletContext} from "react-router-dom";
import {format, isSameDay, addDays} from 'date-fns'
import {Clock} from "lucide-react";
import CreateTask from "@/components/create-task.tsx";
import {TasksCompletedCard} from "@/components/tasks-completed-card.tsx";
import {TasksRemainingCard} from "@/components/tasks-remaining-card.tsx";
import {TaskItemCard} from "@/components/task-item-card.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useTaskStore} from "@/store/DisplayedTask.ts";


function DashBoard() {
    const {user} = useOutletContext<{ user: any }>()
    const currentDate = new Date();
    const [task, setTask] = useState<Task[]>();
    const {typeTask} = useTaskStore();

    // Custom format string: e.g., "Monday, December 22, 2025"
    const formattedDateAndDay = format(currentDate, 'EEEE, MMMM dd, yyyy')

    useEffect(() => {
        const getAllTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/getAllTasks', {headers: {Authorization: `Bearer ${token}`}});
                setTask(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        getAllTasks();
        const interval = setInterval(getAllTasks, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    const filteredRemainingTasks = task?.filter((t) => {
        if (!t.is_completed) {
            if (typeTask === "Today") {
                return isSameDay(new Date(t.due_date), currentDate);
            }
            if (typeTask === "Upcoming") {
                const tomorrow = addDays(currentDate, 1);
                return isSameDay(new Date(t.due_date), tomorrow);
            }
            if (typeTask === "All Tasks") {
                return true;
            }
            return t.tags?.some((tag) => tag.tag_id === typeTask);
        }
        return false;
    });

    const filteredCompletedTasks = task?.filter((t) => {
        return t.is_completed === true;
    });

    return (
        <div className="h-auto w-full ">
            <div className="flex flex-col items-start flex-1">
                <h1 className="text-5xl font-bold font-manrope">Welcome, {user.name}</h1>
                <div className="flex items-center mt-1 ml-1.5 gap-x-1" data-slot="date-and-time">
                    <Clock className="size-4.5 text-[#92a4c9]"/>
                    <h1 className="text-lg font-manrope text-[#92a4c9]">{formattedDateAndDay}</h1>
                </div>
            </div>
            <div className="flex flex-col gap-y-10 mt-10">
                <CreateTask/>
                <div className="flex gap-5 ">
                    <TasksRemainingCard/>
                    <TasksCompletedCard/>
                </div>
                <div className="flex flex-col gap-5 w-full">
                    <h1 className="font-bold font-manrope text-3xl">Remaining Tasks</h1>
                    {filteredRemainingTasks?.map((task) => (
                        <TaskItemCard task={task} key={task.task_id}/>
                    ))}
                </div>
                {filteredCompletedTasks && filteredCompletedTasks.length > 0 && (
                    <div className="flex flex-col gap-5 w-full">
                        <h1 className="font-bold font-manrope text-3xl">Completed Tasks</h1>
                        {filteredCompletedTasks.map((task) => (
                            <TaskItemCard task={task} key={task.task_id}/>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashBoard;

// task?.map((task) => (
//
//     <TaskItemCard task={task} key={task.task_id}/>
// ))