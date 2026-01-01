import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import StudentDetails from './pages/StudentDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddStudent />} />
        <Route path="/edit/:id" element={<EditStudent />} />
        <Route path="/student/:id" element={<StudentDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
