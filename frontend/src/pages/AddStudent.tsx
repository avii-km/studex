import StudentForm from '../components/StudentForm';
import Navbar from '../components/Navbar';

const AddStudent = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <StudentForm />
            </div>
        </div>
    );
};

export default AddStudent;
