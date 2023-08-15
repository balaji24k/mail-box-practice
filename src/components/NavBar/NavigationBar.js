import classes from "./NavBar.module.css";
import { Button, Col, Navbar } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { authActions } from "../../store/AuthSlice";

const NavigationBar = () => {
  const dispatch = useDispatch();

  const userEmail = useSelector((state) => state.auth.userEmail);
  const userName = userEmail && userEmail.split("@")[0];

  const logoutHandler = () => {
    dispatch(authActions.logout());
  };

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        {userEmail && (
          <>
            <Col className="col-4">
              <h4 className={classes.userName}>User: {userName}</h4>
            </Col>
            <Col className="col-6">
              <Navbar.Brand className="m-4">
                <NavLink
                  to="/compose-mail"
                  activeClassName={classes.activeLink}
                  className={classes.navlink}
                >
                  Compose-Mail
                </NavLink>
              </Navbar.Brand>
              <Navbar.Brand className="m-4">
                <NavLink
                  to="/inbox"
                  activeClassName={classes.activeLink}
                  className={classes.navlink}
                >
                  Inbox
                </NavLink>
              </Navbar.Brand>
              <Navbar.Brand className="m-4">
                <NavLink
                  to="/sentbox"
                  activeClassName={classes.activeLink}
                  className={classes.navlink}
                >
                  SentBox
                </NavLink>
              </Navbar.Brand>
            </Col>
            <Col className="col-2">
              <Button onClick={logoutHandler} variant="danger">
                Logout
              </Button>
            </Col>
          </>
        )}
      </Navbar>
    </div>
  );
};

export default NavigationBar;
