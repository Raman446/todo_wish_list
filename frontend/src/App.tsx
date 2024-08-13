import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routing } from './component/Routing';
import { ToastContainer } from 'react-toastify';

function App() {
  const theme = {
    spacing: 1,
  }

  return (
    <div className="App">
      <Routing />
      <ToastContainer style={{marginTop:"40px"}} />
    </div>
  );
}

export default App;
