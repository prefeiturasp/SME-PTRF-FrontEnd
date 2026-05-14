import React, { InputHTMLAttributes } from 'react';

interface InputFiltroProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string;
    name: string;
    value: string;
    onChange: (name: string, value: string) => void;
    placeholder?: string;
    type?: string;
    className?: string;
}

const InputFiltro: React.FC<InputFiltroProps> = ({
    label,
    name,
    value,
    onChange,
    placeholder = 'Digite para filtrar...',
    type = 'text',
    className = '',
    ...rest
}) => {
    return (
        <div className={className}>
            {label && <label htmlFor={name}>{label}</label>}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onChange(e.target.name, e.target.value)
                }
                className='form-control'
                placeholder={placeholder}
                autoComplete='off'
                {...rest}
            />
        </div>
    );
};

export default InputFiltro;
