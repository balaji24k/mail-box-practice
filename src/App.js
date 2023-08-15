import LoginPage from './components/Authentication/LoginPage';
import { Switch, Route, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import SignUpPage from './components/Authentication/SignUpPage';
import ComposeMail from './components/Pages/ComposeMail';
import NavigationBar from './components/NavBar/NavigationBar';
import SentBox from './components/Pages/SentBox';
import Inbox from "./components/Pages/Inbox";
import { useSelector } from 'react-redux';


function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return (
    <>
      <NavigationBar/>
      <Switch>
        <Route path="/login">
          {isLoggedIn && <Redirect to="inbox"/>}
          {!isLoggedIn && <LoginPage/>}
        </Route>
        <Route path="/signup">
          {isLoggedIn && <Redirect to="inbox"/>}
          {!isLoggedIn && <SignUpPage/>}
        </Route>
        <Route path="/compose-mail">
          {isLoggedIn && <ComposeMail/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route path="/inbox">
          {isLoggedIn && <Inbox/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route path="/sentbox">
          {isLoggedIn && <SentBox/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route path="*">
          {isLoggedIn && <Redirect to="/inbox"/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
      </Switch>
    </>

  );
}

export default App;
