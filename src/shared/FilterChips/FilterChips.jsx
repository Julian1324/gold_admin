import './FilterChips.css';

const FilterChips = ({ options = [], activeValue = '', onChange, className = '' }) => {
    return (
        <div className={`filterChipsWrapper ${className}`.trim()}>
            {options.map((option) => (
                <button
                    key={option.id}
                    type="button"
                    className={`chipFilter ${activeValue === option.id ? 'active' : ''}`}
                    onClick={() => {
                        if (activeValue === option.id) return;
                        onChange?.(option.id);
                    }}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default FilterChips;
