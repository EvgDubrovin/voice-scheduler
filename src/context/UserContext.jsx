import {createContext, useContext, useState, useEffect} from "react";
import { auth } from "../firebase";
// Import onAuthStateChanged to listen for authentication state changes
import {onAuthStateChanged} from "firebase/auth";

// Create a UserContext to hold the authenticated user information
const UserContext = createContext(null);

// UserProvider component to wrap the application and provide user information to all components
function UserProvider({ children }) {
    // State to hold the current user information
    const [user, setUser] = useState(null);
    
    // Listen for authentication state changes and update the user state accordingly
    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            // Update the user state with the current user information
            setUser(currentUser);
        });

        // Cleanup the subscription on unmount
        return () => unsubscribe();
    }, []);

    // Provide the user information to all child components through the UserContext
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to access the user information from the UserContext
function useUser() {
    return useContext(UserContext);
}

export { UserProvider, useUser };
