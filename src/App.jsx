import Login from "./components/Login";
import VoiceInput from "./components/VoiceInput";
import { useAuth } from "./context/UserContext";

function App() {
  const { user } = useAuth();

  return user ? (
    <div>
      <Login />
      <VoiceInput />
    </div>
  ) : (
    <div>
      <h1 className="text-blue-700">Voice Scheduler</h1>
      <div className="mt-12">
        <Login />
      </div>
    </div>
  );
}

export default App;