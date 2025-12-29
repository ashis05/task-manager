// src/layouts/DashboardLayout.tsx
import {Outlet, useNavigate} from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar} from "@/components/app-sidebar.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
 // Ensure you have this component created

export default function DashboardLayout() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Verify the token exists when the page loads
        const token = localStorage.getItem('token');
        if (!token) {
            // If no token is found, they shouldn't be here -> redirect to login
            navigate('/login');
            return;
        }

        // 2. Fetch user details using the token
        // Note: Server defines this as POST /getUser. We must pass an empty object {} as the body for POST requests.
        axios.post('/api/getUser', {}, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            setUser(res.data);
        }).catch((err) => {
            console.error("Failed to fetch user details", err);
        });
    }, []);

    return (
        <SidebarProvider>
            <AppSidebar user={user}/>
            <main className="w-full flex">
                {/* Trigger button to open/close sidebar */}
                <SidebarTrigger className="hover:bg-[#263552] hover:text-white size-10 mt-2 ml-2" aria-label="Open sidebar"/>

                <div className="mt-4 ml-7">
                    {/* The Outlet renders the current route's component (e.g., Dashboard, Settings) */}
                    <Outlet context={{ user }}/>
                </div>
            </main>
        </SidebarProvider>
    )
}