import { useEffect, useState } from 'react';
import { getStudents, deleteStudent } from '../services/api';
import StudentCard from '../components/StudentCard';
import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import { Search, ArrowUpDown, Filter } from 'lucide-react';

const Dashboard = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await getStudents();
            // data is object {roll_no: student}, convert to array and attach roll_no
            const studentsArray = Object.entries(data).map(([key, value]: [string, any]) => ({
                ...value,
                roll_no: key
            }));
            setStudents(studentsArray);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await deleteStudent(deleteId);
                fetchStudents();
                setDeleteId(null);
            } catch (error) {
                console.error("Failed to delete student", error);
            }
        }
    };

    const handleSort = async (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        // Client side sort for all fields (Backend sort returns list without IDs)
        const sorted = [...students].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setStudents(sorted);
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.roll_no?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--background-color)' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem' }}>
                <div className="page-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                        <h1 className="page-title">Student Dashboard</h1>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    className="input-field"
                                    style={{ paddingLeft: '2.5rem', width: '250px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button onClick={() => handleSort('name')} className={`btn ${sortConfig?.key === 'name' ? 'btn-primary' : 'btn-outline'}`}>
                                <ArrowUpDown size={16} /> Name
                            </button>
                            <button onClick={() => handleSort('roll_no')} className={`btn ${sortConfig?.key === 'roll_no' ? 'btn-primary' : 'btn-outline'}`}>
                                <Filter size={16} /> Roll No
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        <p style={{ fontSize: '1.25rem' }}>No students found.</p>
                        <p>Try adjusting your search or add a new student.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {filteredStudents.map(student => (
                            <StudentCard key={student.roll_no} student={student} onDelete={setDeleteId} />
                        ))}
                    </div>
                )}

                <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Are you sure you want to delete this student? This action cannot be undone.</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={() => setDeleteId(null)} className="btn btn-outline">Cancel</button>
                        <button onClick={handleDelete} className="btn btn-danger">Delete Student</button>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Dashboard;
