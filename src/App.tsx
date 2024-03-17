import React from 'react';
import LandingPage from './landing';
import VideoInput from './videoinput';
import { Route } from "wouter";
import Login from './login';
import SignUp from './signup';


function App() {
  return (
    <div>
      <Route path="/" component={LandingPage} />
      <Route path="/input" component={VideoInput} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
    </div>
  );
}

export default App;
