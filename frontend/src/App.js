import logo from './logo.svg';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>

        <Route path='/'/>
        <Route path='/auth' />

        <Route path='/home'/>
        <Route path='/history'/>
        <Route path='/:url'/>




        </Routes>



      </AuthProvider>



    </div>
  );
}

export default App;
