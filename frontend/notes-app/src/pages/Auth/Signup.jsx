import { useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import { validateEmail } from "../../utils/helper";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();

        if (!name) {
            setError("Please enter a name");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email");
            return;
        }

        if (!password) {
            setError("Please enter a password");
            return;
        }
        setError("");

        try {
            const response = await fetch('http://localhost:8000/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName: name, email, password }),
            });

            const resData = await response.json();

            if (resData && resData.error) {
                setError(resData.message);
                return;
            }

            if (resData && resData.accessToken) {
                localStorage.setItem('token', resData.accessToken);
                navigate('/dashboard');
            }
        }
        catch (error) {
            setError("An unexpected error occured. Please try again");
        }

    }
    return (
        <>
            <Navbar />

            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border rounded bg-white px-7 py-10">
                    <form onSubmit={handleSignup}>
                        <h4 className="text-2xl mb-7">Signup</h4>
                        <input type="text" placeholder="Name" className="input-box" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="text" placeholder="Email" className="input-box" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
                        <button className="btn-primary" type="submit">Create Account</button>
                        <p className="text-sm text-center mt-4">
                            Already have an account?{" "}<Link to='/login' className="font-medium text-primary underline">
                                Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}