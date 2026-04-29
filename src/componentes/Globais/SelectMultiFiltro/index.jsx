import { Select } from 'antd';
import './scss/SelectMultiFiltro.scss';

const { Option } = Select;

const SelectMultiFiltro = ({
  label,
  name,
  value,
  data = [],
  placeholder = "Selecione as informações",
  onChange,
  className = "",
  containerStyle,
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
    <div className={className} style={containerStyle}>
      {label && <label htmlFor={name} style={{ display: 'block', marginBottom: '8px' }}>{label}</label>}
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder={placeholder}
        id={name}
        value={value}
        onChange={handleChange}
        filterOption={handleFilter}
        className="multiselect-lista-valores-reprogramados"
        {...rest}
      >
        {(data || []).map((item) => (
          <Option key={item.id} value={item.id}>
            {item.nome}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectMultiFiltro;