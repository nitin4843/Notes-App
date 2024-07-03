import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PasswordInput from "../../components/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

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
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                })
            });

            const resData = await response.json();

            if (resData && resData.error) {
                setError(resData.message);
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
                    <form onSubmit={handleSubmit}>
                        <h4 className="text-2xl mb-7">Login</h4>
                        <input type="text" placeholder="Email" className="input-box" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
                        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
                        <button className="btn-primary" type="submit">Login</button>
                        <p className="text-sm text-center mt-4">
                            Not registered yet?{" "}<Link to='/signup' className="font-medium text-primary underline">
                                Create an Account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}