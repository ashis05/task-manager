import React, {useEffect} from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroupContent,
    SidebarHeader, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem, SidebarSeparator,
} from "@/components/ui/sidebar"
import UserProfile from "@/components/user-profile.tsx";
import {Calendar, CalendarClock, Logs} from "lucide-react";
import {useTagStore} from "@/store/tagStore.ts";
import axios from "axios";
import {useTaskStore} from "@/store/DisplayedTask.ts";


export function AppSidebar({user}: { user: any }) {

    const {availableTags, setAvailableTags} = useTagStore();
    const {typeTask, setTypeTask} = useTaskStore();

    const getTags = async () => {
        const token = localStorage.getItem('token');
        const response = await axios('/api/getTags', {headers: {Authorization: `Bearer ${token}`}});
        setAvailableTags(response.data)
    }

    useEffect(() => {
        getTags();
    }, []);


    return (
        <div>
            <Sidebar className="border-r border-[#3b5975]">
                <SidebarHeader className="text-white my-5">
                    <UserProfile user={user}/>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroupContent className="text-white gap-y-3 mx-2 w-full">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={typeTask === "All Tasks"}
                                    className="hover:bg-[#0c244a] hover:text-white active:bg-[#0c244a] active:text-white in-focus:bg-[#0c244a] in-focus:text-white h-12 rounded-y-xl data-[active=true]:bg-[#0c244a] data-[active=true]:text-white"
                                    onClick={() => setTypeTask("All Tasks")}>
                                    <Logs className="!size-5.25 "/>
                                    <h1 className="font-bold font-manrope text-white">All Tasks</h1>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={typeTask === "Today"}
                                    className="hover:bg-[#0c244a] hover:text-white active:bg-[#0c244a] active:text-white in-focus:bg-[#0c244a] in-focus:text-white h-12 rounded-y-xl data-[active=true]:bg-[#0c244a] data-[active=true]:text-white"
                                    onClick={() => setTypeTask("Today")}>
                                    <Calendar className="!size-5.25 "/>
                                    <h1 className="font-bold font-manrope text-white">Today</h1>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={typeTask === "Upcoming"}
                                    className="hover:bg-[#0c244a] hover:text-white active:bg-[#0c244a] active:text-white in-focus:bg-[#0c244a] in-focus:text-white h-12 rounded-y-xl data-[active=true]:bg-[#0c244a] data-[active=true]:text-white"
                                    onClick={() => setTypeTask("Upcoming")}>
                                    <CalendarClock className="!size-5.25 "/>
                                    <h1 className="font-bold font-manrope text-white">Upcoming</h1>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <SidebarSeparator/>
                    <SidebarGroupContent className="text-white gap-y-3 mx-2 w-auto flex flex-col flex-wrap">
                        {
                            availableTags.map((tag) => (
                                <SidebarMenuItem key={tag.tag_id}>
                                    <SidebarMenuButton
                                        isActive={typeTask === tag.tag_id}
                                        style={{'--tag-color': tag.color} as React.CSSProperties}
                                        className="h-12 rounded-y-xl text-[var(--tag-color)] hover:bg-[var(--tag-color)] hover:text-white transition-colors active:bg-[var(--tag-color)] active:text-white in-focus:bg-[var(--tag-color)] in-focus:text-white data-[active=true]:bg-[var(--tag-color)] data-[active=true]:text-white"
                                        onClick={() => setTypeTask(tag.tag_id)}>
                                        <h1 className="font-bold font-manrope">{tag.name}</h1>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarGroupContent>
                </SidebarContent>
            </Sidebar>
        </div>
    )
}
