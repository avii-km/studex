import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getStudent, deleteStudent } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, Edit, Trash2, User } from 'lucide-react';
import Modal from '../components/Modal';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        if (id) {
            getStudent(id)
                .then(data => setStudent({ ...data, roll_no: id }))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleDelete = async () => {
        if (id) {
            try {
                await deleteStudent(id);
                navigate('/');
            } catch (error) {
                console.error(error);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
    if (!student) return <div style={{ padding: '2rem', textAlign: 'center' }}>Student not found</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Link>
                </div>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '50%' }}>
                                <User size={48} color="var(--primary-color)" />
                            </div>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{student.name}</h1>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>Roll No: {student.roll_no}</p>
                                <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '999px', fontSize: '0.875rem', fontWeight: '500' }}>
                                    {student.gender}
                                </span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to={`/edit/${student.roll_no}`} className="btn btn-primary">
                                <Edit size={20} /> Edit
                            </Link>
                            <button onClick={() => setDeleteOpen(true)} className="btn btn-danger">
                                <Trash2 size={20} /> Delete
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Academic Performance</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {['math', 'science', 'social'].map(subject => (
                                    <div key={subject} style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ textTransform: 'capitalize', fontWeight: '500' }}>{subject}</span>
                                            <span style={{ fontWeight: 'bold', color: student.marks[subject] < 30 ? 'var(--danger-color)' : 'var(--success-color)' }}>
                                                {student.marks[subject]} / 50
                                            </span>
                                        </div>
                                        {student.weak_areas[subject] && student.weak_areas[subject].length > 0 && (
                                            <div>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Weak Areas:</p>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {student.weak_areas[subject].map((area: string, idx: number) => (
                                                        <span key={idx} style={{ fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Guardian Information</h3>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Name</p>
                                    <p style={{ fontWeight: '500', fontSize: '1.125rem' }}>{student.guardian.name}</p>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Relation</p>
                                    <p style={{ fontWeight: '500' }}>{student.guardian.relation}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Contact</p>
                                    <p style={{ fontWeight: '500' }}>{student.guardian.contact}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title="Confirm Delete">
                    <p style={{ marginBottom: '1.5rem' }}>Are you sure you want to delete <strong>{student.name}</strong>? This action cannot be undone.</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={() => setDeleteOpen(false)} className="btn btn-outline">Cancel</button>
                        <button onClick={handleDelete} className="btn btn-danger">Delete Student</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default StudentDetails;
