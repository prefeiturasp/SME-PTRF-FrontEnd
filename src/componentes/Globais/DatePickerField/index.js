import React from "react";
import MaskedInput from 'react-text-mask'
import DatePicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import pt from "date-fns/locale/pt-BR";
import "./datePickerField.scss";
import moment from "moment";

registerLocale("pt", pt );


export const DatePickerField = ({ name, about, value, className="form-control", onChange, onCalendarOpen, onCalendarClose, disabled, placeholderText, maxDate=null }) => {

    return (
        <DatePicker
            disabled={disabled}
            selected={(value && new Date(moment(value))) || null}
            onChange={val => {
                onChange(name, val);
            }}
            onCalendarOpen={onCalendarOpen}
            onCalendarClose={onCalendarClose}
            dateFormat="dd/MM/yyyy"
            name={name}
            locale="pt"
            showYearDropdown
            className = {className}
            placeholderText={placeholderText}
            maxDate={maxDate}
            customInput={
                <MaskedInput
                    mask = {[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                />
            }
        />
    );
};