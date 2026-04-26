import { AuthProvider } from '../src/context/AuthProvider'
import RegisterPage from './pages/RegisterPage';
import './App.css';

function App(){
  return(
    <AuthProvider>
      <div className="app-layout">
        <RegisterPage/>
      </div>
    </AuthProvider>
  )
};

export default App;