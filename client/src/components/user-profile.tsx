import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CircleUserRound} from "lucide-react";
import {useNavigate} from "react-router-dom";

function UserProfile({user}: { user: any }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert('Logged Out Successfully');
        navigate('/login');
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="bg-[var(--bg-dark)] flex items-center justify-start h-12 hover:bg-[#0c244a] px-3 text-white font-manrope font-bold ">
                    <CircleUserRound className="size-9 mr-2"/>
                    <h1>{user?.name}</h1>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0c244a] w-56 border-0" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        className="text-white bg-[#0c244a] focus:bg-[var(--bg-dark)] focus:text-white cursor-pointer"
                        onClick={handleLogout}
                    >
                        Log Out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserProfile;