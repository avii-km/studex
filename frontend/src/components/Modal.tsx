import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', margin: '1rem', position: 'relative', animation: 'fadeIn 0.2s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.25rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={24} />
                    </button>
                </div>
                {children}
            </div>
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
};

export default Modal;
