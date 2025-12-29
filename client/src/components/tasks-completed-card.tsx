import {Card, CardContent} from "@/components/ui/card";
import {CircleCheckBig} from "lucide-react";
import {useEffect, useState} from "react";
import axios from "axios";

export function TasksCompletedCard() {

    const [completedTasks, setCompletedTasks] = useState<number>(0);

    useEffect(() => {

        const fetchdata = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/getCompletedTasks', {headers: {Authorization: `Bearer ${token}`}});
                setCompletedTasks(response.data.length);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            }
        }

        fetchdata();
        const interval = setInterval(fetchdata, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card className="w-full max-w-[350px] bg-[#0c1425] border-[#1e293b] rounded-xl shadow-md">
            <CardContent className=" flex items-center justify-between">

                {/* Left Side: Text and Count */}
                <div className="flex flex-col ">
                      <span className="text-md font-bold text-slate-400 tracking-wider uppercase">
                        Tasks Completed
                      </span>
                    <span className="text-5xl font-bold text-white">
                          {completedTasks > 999 ? "999+" : completedTasks}
                      </span>
                </div>

                {/* Right Side: Faded Icon */}
                <div className="flex items-center justify-center">
                    {/* The icon color is set to a very dark blue/slate to create the 'watermark' look */}
                    <CircleCheckBig
                        className="size-20 text-[#1e293b] opacity-80"
                        strokeWidth={1.5}
                    />
                </div>

            </CardContent>
        </Card>
    );
}