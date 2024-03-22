// import logo from './logo.svg';
// import './App.css';

import { Button, TextField } from "@mui/material";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { AuthenticateRoute, LogoutRoute, NotAuthenticateRoute } from '@utils/Authenticate';


function App() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    clearErrors,
  } = useForm({
    mode: 'onChange',
    defaultValues: { username: '', password:''},
  });

  const submitFormLogin = async (data) => {
    const res = await handleLogin(data.username, data.password);
    console.log(res)
    }
  


    return (
      <React.Fragment>
        <ErrorBoundary>
          <CustomRouter history={historyApp}>
            <Switch>
              <Route exact path="/login" component={RouteWrapperLogin} />
              <Route exact path="/logout" component={RouteWrapperLogout} />
              <Route path="/" render={() => <RouteWrapperRoot />} />
            </Switch>
          </CustomRouter>
        </ErrorBoundary>
      </React.Fragment>
    );
  
  
}
export default App;

// const LOGIN_URL = 'http://localhost:5141/api/Login/check-login'




