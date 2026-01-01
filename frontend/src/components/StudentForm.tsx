import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addStudent, updateStudent } from '../services/api';
import { Save, ArrowLeft } from 'lucide-react';

interface StudentFormProps {
    initialData?: any;
    isEdit?: boolean;
}

const StudentForm = ({ initialData, isEdit = false }: StudentFormProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roll_no: '',
        name: '',
        gender: 'Male',
        marks: { math: 0, science: 0, social: 0 },
        weak_areas: { math: [], science: [], social: [] },
        guardian: { name: '', relation: '', contact: '' }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...(prev[parent as keyof typeof prev] as any), [field]: value }
        }));
    };

    const handleWeakAreaChange = (subject: string, value: string) => {
        const areas = value.split(',').map(s => s.trim()).filter(s => s);
        handleNestedChange('weak_areas', subject, areas);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isEdit) {
                await updateStudent(formData.roll_no, formData);
            } else {
                await addStudent(formData);
            }
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button type="button" onClick={() => navigate('/')} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                    <ArrowLeft size={20} />
                </button>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
            </div>

            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="input-group">
                    <label className="input-label">Roll Number</label>
                    <input
                        type="text"
                        name="roll_no"
                        value={formData.roll_no}
                        onChange={handleChange}
                        className="input-field"
                        disabled={isEdit}
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Marks & Weak Areas</h3>

            {['math', 'science', 'social'].map(subject => (
                <div key={subject} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '1rem' }}>
                    <div className="input-group">
                        <label className="input-label" style={{ textTransform: 'capitalize' }}>{subject} Marks</label>
                        <input
                            type="number"
                            value={(formData.marks as any)[subject]}
                            onChange={(e) => handleNestedChange('marks', subject, parseFloat(e.target.value))}
                            className="input-field"
                            min="0" max="50"
                        />
                    </div>
                    <div className="input-group">
                        <label className="input-label" style={{ textTransform: 'capitalize' }}>{subject} Weak Areas (comma separated)</label>
                        <input
                            type="text"
                            value={(formData.weak_areas as any)[subject].join(', ')}
                            onChange={(e) => handleWeakAreaChange(subject, e.target.value)}
                            className="input-field"
                            placeholder="e.g. Algebra, Geometry"
                        />
                    </div>
                </div>
            ))}

            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', marginTop: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Guardian Details</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="input-group">
                    <label className="input-label">Name</label>
                    <input
                        type="text"
                        value={formData.guardian.name}
                        onChange={(e) => handleNestedChange('guardian', 'name', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Relation</label>
                    <input
                        type="text"
                        value={formData.guardian.relation}
                        onChange={(e) => handleNestedChange('guardian', 'relation', e.target.value)}
                        className="input-field"
                        required
                    />
                </div>
                <div className="input-group">
                    <label className="input-label">Contact (10 digits)</label>
                    <input
                        type="text"
                        value={formData.guardian.contact}
                        onChange={(e) => handleNestedChange('guardian', 'contact', e.target.value)}
                        className="input-field"
                        maxLength={10}
                        required
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    <Save size={20} />
                    {loading ? 'Saving...' : 'Save Student'}
                </button>
            </div>
        </form>
    );
};

export default StudentForm;
