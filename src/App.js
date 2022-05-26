
import './App.css';
import 'antd/dist/antd.css'
import 'antd/dist/antd.less'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import Login from './components/login';
import Home from './home';



function App() {
  return (
   
    <Router>
       <Routes>
       <Route exact path='/' element={< Home />}></Route>
      <Route exact path='/home' element={< Home />}></Route>
      <Route exact path='/login' element={< Login />}></Route>
    </Routes>
  
    </Router>
    
    

  );
}

export default App;
