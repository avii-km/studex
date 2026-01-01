import { Link } from 'react-router-dom';
import { User, Trash2, Edit, ChevronRight } from 'lucide-react';

interface StudentCardProps {
    student: any;
    onDelete: (id: string) => void;
}

const StudentCard = ({ student, onDelete }: StudentCardProps) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem', borderRadius: '50%' }}>
                        <User size={24} color="var(--primary-color)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{student.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Roll No: {student.roll_no}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', flex: 1 }}>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Gender</p>
                    <p style={{ fontWeight: '500' }}>{student.gender}</p>
                </div>
                <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Guardian</p>
                    <p style={{ fontWeight: '500' }}>{student.guardian?.name}</p>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/edit/${student.roll_no}`} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }} title="Edit">
                        <Edit size={16} />
                    </Link>
                    <button onClick={() => onDelete(student.roll_no)} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }} title="Delete">
                        <Trash2 size={16} />
                    </button>
                </div>
                <Link to={`/student/${student.roll_no}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.875rem' }}>
                    Details <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default StudentCard;
