
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import HomeComponent from './pages/home';
import HistoryComponent from './pages/history';
import VedioMeetComponent from './pages/VedioMeet';

function App() {
  return (
    <div>
      <BrowserRouter>
      <AuthProvider>
        <Routes>

        <Route path='/' element={<LandingPage/>}/>
        <Route path='/auth' element={<Authentication/>} />

        <Route path='/home' element={<HomeComponent/>} />
        <Route path='/history' element={<HistoryComponent/>} />
        <Route path='/:url' element={<VedioMeetComponent/>}  />




        </Routes>



      </AuthProvider>

</BrowserRouter>

    </div>
  );
}

export default App;
