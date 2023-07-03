import { Routes, Route, Navigate } from "react-router-dom";
import { Chat, Login, Register } from "./pages";
import NavBar from "./components/NavBar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <div className="container mx-auto my-4">
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="*" element={<Navigate replace={true} to="/" />} />
        </Routes>
      </div>
    </ChatContextProvider>
  )
}

export default App
