import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Routing } from './component/Routing';
import { ToastContainer } from 'react-toastify';
import { StylesProvider } from '@mui/styles';

function App() {
  return (
    <div className="App">
      <StylesProvider injectFirst>
        <Routing />
        <ToastContainer className="toast-container" />
      </StylesProvider>
    </div>
  );
}

export default App;