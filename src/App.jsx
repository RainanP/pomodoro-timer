import './App.css'
import Register from './components/register'
import Login from './components/login'
import Principal from './components/principal'
import { Route, Routes } from 'react-router-dom'; // Biblioteca que vai nos permitir criar nossas rotas


function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Register />} />
        <Route path='/' element={<Principal />} />
      </Routes>
    </div>
  )
}

export default App
