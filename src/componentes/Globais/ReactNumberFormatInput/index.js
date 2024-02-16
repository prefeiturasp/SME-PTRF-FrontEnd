import React, {useRef} from "react";
import NumberFormat from "react-number-format";

export const ReactNumberFormatInput = (props) => {
    const { 
        selectAllOnFocus,
        onChangeEvent,
        allowEmpty,
        placeholder,
        ...restProps
    } = props;

    const numberFormatRef = useRef(null);

    const handleFocus = (event) => {
        if(selectAllOnFocus) {
            event.target.select();
        }
      };

    return (
    <NumberFormat
        ref={numberFormatRef}
        onFocus={handleFocus}
        allowEmptyFormatting={allowEmpty}
        decimalScale={2}
        fixedDecimalScale={true}
        onChange={onChangeEvent}
        placeholder={placeholder ? placeholder : "R$0,00"}
        {...restProps}
    /> )
}