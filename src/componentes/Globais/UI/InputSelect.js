import React from "react";

export const InputSelect = ({
    options = [],
    label = '',
    id = '',
    name = '',
    value,
    onChange,
}) => {
    return (
        <>
            <label htmlFor={name}><strong>{label}</strong></label>
            <select
                value={value}
                onChange={onChange}
                name={name}
                id={id}
                className="form-control"
            >
                <option value=''>Selecionar</option>
                {options.map((_opt, inded) => {
                    return (
                        <option key={inded} value={_opt.value}>{_opt.label}</option>        
                    )
                })}
            </select>
        </>
    )
};