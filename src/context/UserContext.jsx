import {createContext, useContext, useState, useEffect} from "react";
import { auth } from "../firebase";
// Import onAuthStateChanged to listen for authentication state changes
import {onAuthStateChanged} from "firebase/auth";
import { getUserData } from "../services/firestore";

// Create a UserContext to hold the authenticated user information
const UserContext = createContext(null);

// UserProvider component to wrap the application and provide user information to all components
function UserProvider({ children }) {
    // State to hold the current user information
    const [user, setUser] = useState(null);
    // State to hold an access token if needed elsewhere
    const [accessToken, setAccessToken] = useState(null);
    // State to hold the user's spreadsheet ID for Sheets integration
    const [spreadsheetId, setSpreadsheetId] = useState(null);
    
    // Listen for authentication state changes and update the user state accordingly
    useEffect(() => {
        // Subscribe to authentication state changes
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            // Update the user state with the current user information
            setUser(currentUser);
            if (currentUser) {
                const userData = await getUserData(currentUser.uid);
                if (userData?.spreadsheetId) {
                    setSpreadsheetId(userData.spreadsheetId);
                }
            }
        });

        // Cleanup the subscription on unmount
        return () => unsubscribe();
    }, []);

    // Provide the user information to all child components through the UserContext
    return (
        <UserContext.Provider value={{ user, accessToken, setAccessToken, spreadsheetId, setSpreadsheetId }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to access the user information from the UserContext
function useAuth() {
    return useContext(UserContext);
}

export { UserProvider, useAuth };
