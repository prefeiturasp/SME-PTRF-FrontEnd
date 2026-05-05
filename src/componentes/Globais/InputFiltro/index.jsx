const InputFiltro = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Digite para filtrar...",
  type = "text",
  className = "",
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
        onChange={(e) => onChange(e.target.name, e.target.value)}
        className="form-control"
        placeholder={placeholder}
        autoComplete="off"
        {...rest}
      />
    </div>
  );
};

export default InputFiltro;