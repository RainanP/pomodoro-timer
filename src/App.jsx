import './App.css'
import Register from './components/register'
import Login from './components/login'
import Principal from './components/principal'
import { Route, Routes } from 'react-router-dom'; // Biblioteca que vai nos permitir criar nossas rotas


function App() {
  return (
    // Criando nossas rotas
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/registro' element={<Register />} />
      <Route path='/main' element={<Principal />} />
    </Routes>
  )
}

export default App
