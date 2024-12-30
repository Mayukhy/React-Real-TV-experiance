import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Tv from './components/Tv'
function App() {
  return (
    <BrowserRouter>
    <div className='flex justify-center items-center'>
      <Routes>
      <Route path='/' element={<Tv/>}/>
      <Route path='/channel/:id' element={<Tv/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
