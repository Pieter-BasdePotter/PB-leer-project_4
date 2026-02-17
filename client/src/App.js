import './App.css';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Home from './pages/Home';
import Createpost from './pages/CreatePost';


function App() {
  return <div className="App"> 
  <Router>
    <Link to="/createpost"> Create A post</Link>
    <Link to="/"> Home Page</Link>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/createpost" element={<Createpost />} />
    </Routes>
  </Router></div>;
}

export default App;
