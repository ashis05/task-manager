import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {CircleCheckBig} from "lucide-react";
import {Label} from "@radix-ui/react-label";
import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button.tsx";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp.tsx";

function ValidateOtp() {
    const [otp, setOtp] = useState("");
    const [email, setEmail] = useState("");
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
            setEmail(res.data.email);
        }).catch((err) => {
            console.error("Failed to fetch user details", err);
        });
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            
            // 2. Send the OTP and Token to backend
            await axios.post('/api/validateOtp', { otp }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert('Email Verified Successfully');
            navigate('/dashboard');
        } catch (error: any) {
            console.error("OTP Validation Error", error);
            const errorMessage = error.response?.data?.msg || error.response?.data?.error || 'Invalid OTP or Error verifying';
            alert(errorMessage);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <Card className="w-[400px] h-95 py-4 bg-[#1a2230] border-0 border-[var(--border-dark)] rounded-xl">
                <CardHeader className="mx-5 mt-5">
                    <CardTitle className="text-white justify-start items-center flex flex-row">
                        <CircleCheckBig  className="size-8 mr-2 text-[#135bec]"/>
                        <h1 className="text-lg font-bold font-manrope ">Task Manager</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-white flex flex-col items-start justify-center gap-4 mx-5 mt-[-1rem]">
                    <h2 className="text-center text-4xl font-bold font-manrope ">OTP Verification</h2>
                    <p className="text-center text-[15px] font-manrope mt-[-0.75rem] mx-1 text-[#92a4c9]">
                        Enter the code sent to <span className="text-white">{email || "your email"}</span>
                    </p>
                    <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-2">
                            <Label className="font-manrope">One-Time Password</Label>
                            <InputOTP maxLength={6} value={otp} onChange={(value) => {setOtp(value)}} required>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        <div className="relative mt-3.5">
                            <Button type="submit" className="w-full bg-[#135bec] hover:bg-[#092866] text-white rounded-md py-2 h-10">
                                Verify
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default ValidateOtp;