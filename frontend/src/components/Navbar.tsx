import { Link } from 'react-router-dom';
import { GraduationCap, Plus } from 'lucide-react';

const Navbar = () => {
    return (
        <nav style={{ backgroundColor: 'var(--surface-color)', boxShadow: 'var(--shadow-sm)', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 10 }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    <GraduationCap size={32} />
                    <span style={{ color: 'var(--text-primary)' }}>Student<span style={{ color: 'var(--primary-color)' }}>Manager</span></span>
                </Link>
                <Link to="/add" className="btn btn-primary">
                    <Plus size={20} />
                    <span>Add Student</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
