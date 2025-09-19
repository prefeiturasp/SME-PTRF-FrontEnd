import React, { useRef } from "react";
import { NumericFormat } from "react-number-format";
import { formatMoneyByCentsBRL, parseMoneyBRL } from "../../../utils/money";

export const ReactNumberFormatInputV2 = (props) => {
  const { value, onChangeEvent, selectAllOnFocus, allowEmpty, placeholder, ...restProps } = props;

  const numberFormatRef = useRef(null);

  const handleFocus = (event) => {
    if (selectAllOnFocus) {
      event.target.select();
    }
  };

  const handleValueChange = (values) => {
    const rawValue = values.value;
    const cents = parseMoneyBRL(rawValue);
    onChangeEvent?.(cents / 100);
  };

  return (
    <NumericFormat
      ref={numberFormatRef}
      onFocus={handleFocus}
      allowEmptyFormatting={allowEmpty}
      thousandSeparator="."
      decimalSeparator=","
      fixedDecimalScale={true}
      decimalScale={2}
      value={value != null ? formatMoneyByCentsBRL(value * 100) : ""}
      onValueChange={handleValueChange}
      placeholder={placeholder ?? "R$ 0,00"}
      {...restProps}
    />
  );
};
