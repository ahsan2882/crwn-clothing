import { Link, Outlet } from "react-router";
import { useContext } from "react";
import { ReactComponent as Logo } from "../../assets/crown.svg";
import "./navigation.styles.scss";
import { UserContext } from "../../contexts/user.context";
import { signOutUser } from "../../utils/firebase/firebase.utils";

export default function Navigation() {
  const { currentUser } = useContext(UserContext);

  const signOutHandler = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <>
      <div className="navigation">
        <Link className="logo-container" to="/">
          <Logo className="logo" />
        </Link>
        <div className="nav-links-container">
          <Link className="nav-link" to="/shop">
            SHOP
          </Link>
          {currentUser ? (
            <button type="button" className="nav-link" onClick={signOutHandler}>
              SIGN OUT
            </button>
          ) : (
            <Link className="nav-link" to="/auth">
              SIGN IN
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </>
  );
}
