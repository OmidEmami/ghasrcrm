import ReceiverDashboard from "./components/ReceiverDashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div>
      <ToastContainer />
      <ReceiverDashboard />
    </div>
  );
}

export default App;
