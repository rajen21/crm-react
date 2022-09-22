import { BrowserRouter, Routes, Route } from 'react-router-dom';

import UserLoginForm from './containers/Login/index';
import Registration from './containers/regisration/index';
import Home from './containers/home/index';
import Profile from './containers/profile/index';
import Header from './components/navbar/Header';
import PasswordChange from './containers/passwordChange/index';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      {window.location.pathname !== '/user/login' ? <Header /> : ''}
      <Routes>
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path='/' element={<Home />} />
        <Route path='/user/registration' element={<Registration />} />
        <Route path='/profile/edit/:editid' element={<Registration />} />
        <Route path='/profile/password-change/:editid' element={<PasswordChange />} />
        <Route path='/profile/:viewid' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
