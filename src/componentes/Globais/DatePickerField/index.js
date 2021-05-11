import React from "react";
import MaskedInput from 'react-text-mask'
import DatePicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import pt from "date-fns/locale/pt-BR";
import "./datePickerField.scss";
import moment from "moment";

registerLocale("pt", pt );


export const DatePickerField = ({ name, about, value, onChange, onCalendarClose, disabled, placeholderText }) => {

    return (
        <DatePicker
            disabled={disabled}
            //selected={(value && new Date(moment(value).format('MMMM D, YYYY'))) || null}
            //selected={(value && new Date(value)) || null}
            selected={(value && new Date(moment(value))) || null}
            onChange={val => {
                onChange(name, val);
            }}
            onCalendarClose={onCalendarClose}
            dateFormat="dd/MM/yyyy"
            name={name}
            locale="pt"
            showYearDropdown
            className={`${ (name === "data_documento" || name === "data_transacao") && !value && about === "PUT" ? 'is_invalid' : ""} form-control`}
            placeholderText={placeholderText}
            customInput={
                <MaskedInput
                    mask = {[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                />
            }
        />
    );
};