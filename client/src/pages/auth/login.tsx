import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CircleCheckBig, LogIn} from "lucide-react";
import {Label} from "@radix-ui/react-label";
import {Input} from "@/components/ui/input.tsx";
import {useState} from "react";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import {Button} from "@/components/ui/button.tsx";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Spinner } from "@/components/ui/spinner.tsx";

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            const response = await axios.post('/api/login', {email, password});
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        }catch (error) {
            alert('Invalid Credentials');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen w-full ">
            {isLoading && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <Spinner className="size-16 text-[#135bec]" />
                </div>
            )}
            <Card className="w-100 h-125 bg-[#1a2230] border-0 border-[var(--border-dark)] rounded-xl">
                <CardHeader className="mx-5 mt-5">
                    <CardTitle className="text-white justify-start items-center flex flex-row">
                        <CircleCheckBig  className="size-8 mr-2 text-[#135bec]"/>
                        <h1 className="text-lg font-bold font-manrope ">Task Manager</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-white flex flex-col items-start justify-center gap-4 mx-5 mt-[-1rem]">
                    <h2 className="text-center text-4xl font-bold font-manrope ">
                        Welcome Back
                    </h2>
                    <p className="text-center text-[15px] font-manrope mt-[-0.75rem] mx-1 text-[#92a4c9]">
                        Start managing your tasks now
                    </p>
                    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label className="font-manrope">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="font-manrope">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => {setPassword(e.target.value)}}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
                                </button>
                            </div>
                        </div>
                        <div className="relative mt-3.5">
                            <Button type="submit" className="w-full bg-[#135bec] hover:bg-[#092866] text-white rounded-md py-2 h-10" disabled={isLoading}>
                                Login
                                <LogIn className="text-white" />
                            </Button>
                        </div>
                        <div className="flex justify-center ">
                            <p className="text-[#92a4c9]">Don't have an account? <a href="/signup" className="text-[#135bec] hover:underline">Sign up</a></p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;