// Import necessary modules and components
import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
    // State to hold user information after login
    const [user, setUser] = useState(null);
    
    // Function to handle login with Google
    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (error) {
            console.error("Error during sign in:", error);
        }
    };

    // Function to handle logout
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    };

    return (
        // Render user information if logged in, otherwise show login button
        <div>
            {user ? (
                <div className="flex flex-col items-start gap-4 p-4 rounded-2xl border border-slate-200 bg-white/80 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-900">Welcome, {user.displayName}!</h2>
                    <p className="text-sm text-slate-600">Email: {user.email}</p>
                    <button
                        className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>
                </div>
            ) : (
                <button
                    className="rounded-xl bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    onClick={handleLogin}
                >
                    Sign in with Google
                </button>
            )}
        </div>
    );
}

export default Login;