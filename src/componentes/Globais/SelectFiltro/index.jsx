import { Select } from 'antd';
const { Option } = Select; 

const SelectFiltro = ({
  label,
  name,
  value,
  data = [],
  placeholder = "Selecione",
  onChange,
  optionValue = "id",
  optionLabel = "nome",
  allowClear = true,
  className='',
  ...rest
}) => {

  const handleChange = (val) => {
    if (onChange) {
      onChange(name, val);
    }
  };

  const handleFilter = (input, option) => {
    const children = option?.children ?? "";
    return children.toString().toLowerCase().includes(input.toLowerCase());
  };

  return (
    <div className={className}>
      {label && <label htmlFor={name}>{label}</label>}

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
        <Option key="default-option-empty"value="">Selecione um tipo</Option>
        {(data || []).map(item => (
          <Option key={item[optionValue]} value={item[optionValue]}>
            {item[optionLabel]}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectFiltro;