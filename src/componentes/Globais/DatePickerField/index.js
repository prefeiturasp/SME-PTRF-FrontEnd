import React from "react";
import MaskedInput from 'react-text-mask'
import DatePicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import pt from "date-fns/locale/pt-BR";
import "./datePickerField.scss";
import moment from "moment";

registerLocale("pt", pt );


export const DatePickerField = ({ name, about, value, className="form-control", onChange, onCalendarClose, disabled, placeholderText }) => {

    return (
        <DatePicker
            disabled={disabled}
            selected={(value && new Date(moment(value))) || null}
            onChange={val => {
                onChange(name, val);
            }}
            onCalendarClose={onCalendarClose}
            dateFormat="dd/MM/yyyy"
            name={name}
            locale="pt"
            showYearDropdown
            className = {className}
            placeholderText={placeholderText}
            customInput={
                <MaskedInput
                    mask = {[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                />
            }
        />
    );
};