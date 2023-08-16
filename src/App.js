import LoginPage from './components/Authentication/LoginPage';
import { Switch, Route, Redirect } from 'react-router-dom/cjs/react-router-dom.min';
import SignUpPage from './components/Authentication/SignUpPage';
import ComposeMail from './components/Pages/ComposeMail';
import NavigationBar from './components/NavBar/NavigationBar';
import SentBox from './components/Pages/SentBox';
import Inbox from "./components/Pages/Inbox";
import { useSelector } from 'react-redux';
import InboxView from './components/Pages/InboxView';
import SentboxView from './components/Pages/SentboxView';


function App() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  return (
    <>
      <NavigationBar/>
      <Switch>
        <Route exact path="/login">
          {isLoggedIn && <Redirect to="inbox"/>}
          {!isLoggedIn && <LoginPage/>}
        </Route>
        <Route exact path="/signup">
          {isLoggedIn && <Redirect to="inbox"/>}
          {!isLoggedIn && <SignUpPage/>}
        </Route>
        <Route exact path="/compose-mail">
          {isLoggedIn && <ComposeMail/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route exact path="/inbox">
          {isLoggedIn && <Inbox/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route exact path="/inbox/:id">
          {isLoggedIn && <InboxView/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route exact path="/sentbox">
          {isLoggedIn && <SentBox/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route exact path="/sentbox/:id">
          {isLoggedIn && <SentboxView/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
        <Route exact path="*">
          {isLoggedIn && <Redirect to="/inbox"/>}
          {!isLoggedIn && <Redirect to="login"/>}
        </Route>
      </Switch>
    </>

  );
}

export default App;
