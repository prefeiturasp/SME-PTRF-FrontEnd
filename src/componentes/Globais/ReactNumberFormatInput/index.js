import React, { useRef } from "react";
import { NumericFormat } from "react-number-format";

export const ReactNumberFormatInput = (props) => {
  const { selectAllOnFocus, onChangeEvent, allowEmpty, placeholder, ...restProps } = props;

  const numberFormatRef = useRef(null);

  const handleFocus = (event) => {
    if (selectAllOnFocus) {
      event.target.select();
    }
  };

  return (
    <NumericFormat
      ref={numberFormatRef}
      onFocus={handleFocus}
      allowEmptyFormatting={allowEmpty}
      decimalScale={2}
      fixedDecimalScale={true}
      onChange={onChangeEvent}
      placeholder={placeholder ? placeholder : "R$0,00"}
      {...restProps}
    />
  );
};
