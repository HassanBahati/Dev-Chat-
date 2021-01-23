import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect, useLocation } from "react-router-dom";
import AddRoom from "./Components/AddRoom";
import ChatRoom from './Components/ChatRoom';
import Login from './Components/Login';
import RoomList from './Components/RoomList';

function App() {
  let location = useLocation;
  return (
    <Router>
      <div>
        <Redirect 
          to= {{
            pathname: '/roomlist',
            state: {from: location}
          }}
        />
        <Switch>
          <Route path='/login'>
            <Login />
          </Route>
          <SecureRoute path='/roomlist'>
            <RoomList/>
          </SecureRoute>
          <SecureRoute path='/addroom'>
            <AddRoom/>
          </SecureRoute>
          <SecureRoute path='/chatroom/:room'>
            <ChatRoom/>
          </SecureRoute>
        </Switch>
      </div>
    </Router>
  );
}

export default App;


function SecureRoute({ children, ...rest }) {
  return(
    <Route 
      { ...rest }
      render = {({ location }) =>  
        localStorage.getItem('nickname') ? (
          children 
        ) : (
          <Redirect 
            to = {{ 
              pathname = '/login',
              state = { from: location }
             }}
          />
        )
       }
    />
  );
}