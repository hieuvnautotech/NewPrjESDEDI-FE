// import logo from './logo.svg';
// import './App.css';

import { Button, TextField } from "@mui/material";
import { useForm } from 'react-hook-form';
import axios from 'axios';

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
    <div className="App">
      <header className="App-header">
       <div>
       <form onSubmit={handleSubmit(submitFormLogin)}>
       <TextField  name="username" label="user name" variant="outlined"  {...register('username')}/>
       <TextField
        name="password"
          label="Password"
          type="password"
          {...register('password')}
        />
        <Button variant="contained"  type="submit">Login</Button>
        </form>
       </div>
      </header>
    </div>
  );
}

const LOGIN_URL = 'http://localhost:5141/api/Login/check-login'

const handleLogin = async (userName, userPassword) => {
  try {
    return await axios.post(LOGIN_URL, {
      userName: userName,
      userPassword: userPassword,
      isOnApp: false,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
  }
};

export default App;
