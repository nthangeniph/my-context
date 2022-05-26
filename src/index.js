import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from './provider/user/index';
import {} from './provider/theme/index';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<UserProvider>
<App />
</UserProvider>
 

  

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))

reportWebVitals()