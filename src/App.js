import LoginPage from "./components/Authentication/LoginPage";
import { Switch,Route, Redirect,} from "react-router-dom/cjs/react-router-dom.min";
import SignUpPage from "./components/Authentication/SignUpPage";
import ComposeMail from "./components/Pages/ComposeMail";
import NavigationBar from "./components/NavBar/NavigationBar";
import SentBox from "./components/Pages/SentBox";
import Inbox from "./components/Pages/Inbox";
import { useDispatch, useSelector } from "react-redux";
import InboxView from "./components/Pages/InboxView";
import SentboxView from "./components/Pages/SentboxView";
import classes from "./App.module.css";
import { useCallback, useEffect } from "react";
import { mailActions } from "./store/MailSlice";
import useHttp from "./hooks/useHttp";

function App() {
  const sendRequest = useHttp();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // console.log(isLoggedIn,"app email")

  const userEmail = localStorage.getItem("email");
  const userName = userEmail && userEmail.split("@")[0];

  const fetchData =useCallback(async(type) => {
    const data = await sendRequest({endPoint: `${userName}/${type}`});
    // console.log(data, "refresh pp")
    const loadedMails = [];
    for (let key in data) {
      let mail = { id: key, ...data[key] };
      loadedMails.push(mail);
    }
    if (type === "inbox") {
      dispatch(mailActions.replaceInboxMail(loadedMails))
    }
    else {
      dispatch(mailActions.replaceSentboxMail(loadedMails))
    }
  },[dispatch, sendRequest,userName]);

  useEffect(()=> {
    if (!isLoggedIn) {
      return
    }
    fetchData("inbox");
    fetchData("sentbox");
    // setInterval(fetchData("inbox"), 3000);
    const interval = setInterval(() => {
      fetchData("inbox");
    },5000);
    
    return () => clearInterval(interval);
  },[isLoggedIn, fetchData, userName]);
  return (
    <div className={classes.box}>
      <NavigationBar />
      <div style={{width:"1400px"}}>
        <Switch>
          <Route exact path="/login">
            {isLoggedIn && <Redirect to="inbox" />}
            {!isLoggedIn && <LoginPage />}
          </Route>
          <Route exact path="/signup">
            {isLoggedIn && <Redirect to="inbox" />}
            {!isLoggedIn && <SignUpPage />}
          </Route>
          <Route exact path="/compose-mail">
            {isLoggedIn && <ComposeMail />}
            {!isLoggedIn && <Redirect to="login" />}
          </Route>
          <Route exact path="/inbox">
            {isLoggedIn && <Inbox/>}
            {!isLoggedIn && <Redirect to="login" />}
          </Route>
          <Route exact path="/inbox/:id">
            {isLoggedIn && <InboxView />}
            {!isLoggedIn && <Redirect to="login" />}
          </Route>
          <Route exact path="/sentbox">
            {isLoggedIn && <SentBox />}
            {!isLoggedIn && <Redirect to="login" />}
          </Route>
          <Route exact path="/sentbox/:id">
            {isLoggedIn && <SentboxView />}
            {!isLoggedIn && <Redirect to="login" />}
          </Route>
          <Route exact path="*">
            {isLoggedIn && <Redirect to="/inbox" />}
            {!isLoggedIn && <Redirect to="login" />}
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
