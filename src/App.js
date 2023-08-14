import './App.css';
import LoginPage from './components/Authentication/LoginPage';
import { Switch, Route } from 'react-router-dom/cjs/react-router-dom.min';
import SignUpPage from './components/Authentication/SignUpPage';

function App() {
  return (
    <Switch>
      <Route path="/login">
        <LoginPage/>
      </Route>
      <Route path="/signup">
        <SignUpPage/>
      </Route>
    </Switch>
  );
}

export default App;
