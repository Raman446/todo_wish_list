import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routing } from './component/Routing';
import { ToastContainer } from 'react-toastify';

function App() {


  return (
    <div className="App">
      <Routing />
      <ToastContainer style={{ marginTop: "50px" }} />
    </div>
  );
}

export default App;
