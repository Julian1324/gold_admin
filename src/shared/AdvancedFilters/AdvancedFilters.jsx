import './AdvancedFilters.css';

const AdvancedFilters = ({ fields = [], values = {}, onChange, onSubmit, onClear }) => {
    const handleFieldChange = (fieldName, value) => {
        onChange?.({ ...values, [fieldName]: value });
    };

    const renderField = (field) => {
        if (field.type === 'select') {
            return (
                <select
                    className="form-select"
                    value={values[field.name] || ''}
                    onChange={(event) => handleFieldChange(field.name, event.target.value)}
                >
                    {(field.options || []).map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={field.type || 'text'}
                className="form-control"
                placeholder={field.placeholder || ''}
                value={values[field.name] || ''}
                onChange={(event) => handleFieldChange(field.name, event.target.value)}
            />
        );
    };

    return (
        <form className="advancedFilters row g-3 align-items-end mb-3" onSubmit={onSubmit}>
            {fields.map((field) => (
                <div className={field.className || 'col-md-2'} key={field.name}>
                    <label className="form-label">{field.label}</label>
                    {renderField(field)}
                </div>
            ))}
            <div className="col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-warning">Filtrar</button>
                <button type="button" className="btn btn-outline-secondary" onClick={onClear}>Limpiar filtros</button>
            </div>
        </form>
    );
};

export default AdvancedFilters;
