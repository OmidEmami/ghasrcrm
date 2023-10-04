import ReceiverDashboard from "./components/ReceiverDashboard";
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import MissedCalls from "./components/MissedCalls";

function App() {
  return (
  
    <>
    <BrowserRouter>
    <Switch>
      <Route exact path="/">
    <ReceiverDashboard />
      </Route>
     <Route exact path="/missedcalls">
      <MissedCalls />
     </Route>
      </Switch>
      </BrowserRouter>
      </>
  );
}

export default App;
