import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RemoteControl from './components/RemoteControl';

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<RemoteControl />} />
          <Route path="/remote" element={<RemoteControl />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;