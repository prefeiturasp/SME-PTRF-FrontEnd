import { Select } from 'antd';
import type { SelectProps } from 'antd';
import React from 'react';

const { Option } = Select;

type DataItem = Record<string, any>;

type SelectFiltroProps = {
    label?: string;
    name: string;
    value?: any;
    data?: DataItem[];
    placeholder?: string;
    onChange?: (name: string, value: any) => void;
    optionValue?: string;
    optionLabel?: string;
    searchFields?: string[];
    allowClear?: boolean;
    className?: string;
} & Omit<SelectProps, 'value' | 'onChange'>;

const SelectFiltro: React.FC<SelectFiltroProps> = ({
    label,
    name,
    value,
    data = [],
    placeholder = 'Selecione',
    onChange,
    optionValue = 'id',
    optionLabel = 'nome',
    searchFields,
    allowClear = true,
    className = '',
    ...rest
}) => {
    const handleChange = (val: any) => {
        if (onChange) {
            onChange(name, val);
        }
    };

    const handleFilter: SelectProps['filterOption'] = (input, option) => {
        const children = option?.children ?? '';
        const currentDataItem = option?.['data-item'];
        
        if (searchFields && searchFields.length > 0 && currentDataItem) {
            return searchFields.some((field) =>
                String(currentDataItem[field] ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase())
            );
        }
        
        return children.toString().toLowerCase().includes(input.toLowerCase());
    };

    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} style={{ display: 'block', marginBottom: 8 }}>
                    {label}
                </label>
            )}

            <Select
                allowClear={allowClear}
                style={{ width: '100%' }}
                placeholder={placeholder}
                filterOption={handleFilter}
                id={name}
                value={value}
                onChange={handleChange}
                {...rest}
            >
                <Option key='default-option-empty' value=''>
                    Selecione um tipo
                </Option>

                {(data || []).map((item, index) => (
                    <Option key={item?.[optionValue] ?? index} value={item?.[optionValue]} data-item={item}>
                        {item?.[optionLabel]}
                    </Option>
                ))}
            </Select>
        </div>
    );
};

export default SelectFiltro;
