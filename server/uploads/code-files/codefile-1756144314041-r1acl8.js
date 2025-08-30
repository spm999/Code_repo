// import React from 'react';
import Login from './components/auth/Login/Login';
import Register from './components/auth/Register/Register';
import ForgetPass from './components/auth/ForgetPassword/ForgetPass';
import {Route, Routes} from 'react-router-dom';
import TodoList from './components/auth/TodoList/TodoList.js';
import React, { useState, useEffect } from 'react';


 function App() {
  return (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register/>} />
          <Route path="/ForgetPass" element={<ForgetPass />} />
          <Route path="/TodoList/:userId" element={<TodoList />} />
        </Routes>
  );
}

export default App;


































































































// const App = () => {
//   return (
//     <div>
//       <Login />
//       <Register />
//     </div>
//   );
// };

// export default App;