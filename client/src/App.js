import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './pages/Home';
import Createpost from './pages/CreatePost';
import Post from './pages/Post';


function App() {
  return (
    <div className="App"> 
      <Router>
        <div className="navbar">
          <Link to="/createpost"> Create A post</Link>
          <Link to="/"> Home Page</Link>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/createpost" element={<Createpost/>} />
          <Route path="/post/:id" element={<Post/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
