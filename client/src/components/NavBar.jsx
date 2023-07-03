import { useContext } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <header className="bg-cyan-600">
      <div className="h-full container mx-auto flex justify-between items-center">
        <h2>
          <Link to="/" className="no-underline text-2xl">ChatApp</Link>
        </h2>
        {user && <span className="text-amber-400">Logged in as {user?.name}</span>}
        <nav>
          <ul className="h-full flex items-center justify-between gap-x-3">
            {
              user && (
                <>
                  <Notification />
                  <li onClick={() => logoutUser()}>
                    <Link to="/login" className="no-underline">Logout</Link>
                  </li>
                </>
              )
            }
            {
              !user && (
                <>
                  <li>
                    <Link to="/login" className="no-underline">Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="no-underline">Register</Link>
                  </li></>
              )
            }
          </ul>
        </nav>
      </div>
    </header>
  )
}
export default NavBar;