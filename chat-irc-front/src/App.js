import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ChannelPage from "./Pages/ChannelPage";
import DashboardPage from "./Pages/DashboardPage";
import indexPage from "./Pages/indexPage";
import LoginPage from "./Pages/LoginPage";
import RegistersPage from "./Pages/RegistersPage";
import io from 'socket.io-client';
import makeToast from "./Toaster";


function App() {
  const [socket, setSocket] = React.useState(null);

  const setupSocket = () => {
    const token = sessionStorage.getItem("Chat_Token");
    if (token && !socket) {
      const newSocket = io("http://localhost:8000", {
        query: {
          token: sessionStorage.getItem("Chat_Token"),
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        makeToast("error", "Socket Disconnected!");
      });

      newSocket.on("connect", () => {
        makeToast("success", "Socket Connected!");
      });

      setSocket(newSocket);
    }
  };

  React.useEffect(() => {
    setupSocket();
    //eslint-disable-next-line
  }, []);
  return <BrowserRouter>
    <Switch>
      <Route path="/" component={indexPage} exact/>
      <Route path="/login" render={() => <LoginPage setupSocket={setupSocket}/>} exact/>
      <Route path="/register" component={RegistersPage} exact/>
      <Route path="/dashboard" render={() =><DashboardPage socket={socket}/>} exact/>
      <Route path="/channel/:id" render={() => <ChannelPage socket={socket}/>} exact/>
    </Switch>
  </BrowserRouter>;
}

export default App;