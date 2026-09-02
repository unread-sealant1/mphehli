import React from 'react';
import '../styles/admin-ui.css';

export const AdminButton = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const variantClass = {
    primary: 'admin-btn-primary',
    secondary: 'admin-btn-secondary',
    danger: 'admin-btn-danger',
    ghost: 'admin-btn-ghost',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`admin-btn ${variantClass[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const AdminInput = ({ label, value, onChange, placeholder, type = 'text', className = '', error = false, ...props }) => (
  <div className={`admin-input-group ${className}`}>
    {label && <label className="admin-input-label">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`admin-input-field ${error ? 'admin-input-error' : ''}`}
      {...props}
    />
  </div>
);

export const AdminSelect = ({ label, value, onChange, options, className = '', error = false, ...props }) => (
  <div className={`admin-input-group ${className}`}>
    {label && <label className="admin-input-label">{label}</label>}
    <select
      value={value}
      onChange={onChange}
      className={`admin-input-field ${error ? 'admin-input-error' : ''}`}
      {...props}
    >
      {options.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);

export const AdminTable = ({ headers, data, renderRow, emptyMessage = 'No data found' }) => {
  return (
    <div className="admin-table-container">
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, idx) => renderRow(item, idx))
            ) : (
              <tr>
                <td colSpan={headers.length} style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate-400)', fontStyle: 'italic' }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
