import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getStudent } from '../services/api';
import StudentForm from '../components/StudentForm';
import Navbar from '../components/Navbar';

const EditStudent = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        if (id) {
            getStudent(id)
                .then(data => setStudent({ ...data, roll_no: id }))
                .catch(console.error);
        }
    }, [id]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                {student ? <StudentForm initialData={student} isEdit /> : <p>Loading...</p>}
            </div>
        </div>
    );
};

export default EditStudent;
