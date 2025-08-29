import React from "react";
import MaskedInput from 'react-text-mask'
import DatePicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from "date-fns/locale";
import "./datePickerField.scss";
import dayjs from "dayjs";

registerLocale("pt", ptBR);


export const DatePickerField = ({ dataQa="", name, id, value, className="form-control", onChange, onCalendarOpen, onCalendarClose, disabled, placeholderText, maxDate=null, wrapperClassName=null, minDate=null }) => {
    const parseDate = (dateString) => {
        if (!dateString) return null;
        if (dateString instanceof Date) return dateString;
        const date = dayjs(dateString, "YYYY-MM-DD", true); 
        return date.isValid() ? date.toDate() : null;
    };

    return (
        <DatePicker
            disabled={disabled}
            selected={parseDate(value)}
            onChange={val => {
                onChange(name, val);
            }}
            onCalendarOpen={onCalendarOpen}
            onCalendarClose={onCalendarClose}
            dateFormat="dd/MM/yyyy"
            name={name}
            id={id}
            locale="pt"
            showYearDropdown
            className = {className}
            placeholderText={placeholderText}
            maxDate={maxDate}
            minDate={minDate}
            wrapperClassName={wrapperClassName}
            customInput={
                <MaskedInput
                    data-qa={dataQa}
                    mask = {[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                />
            }
        />
    );
};