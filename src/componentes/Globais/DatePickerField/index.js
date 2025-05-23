import React from "react";
import MaskedInput from 'react-text-mask'
import DatePicker, {registerLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { ptBR } from "date-fns/locale";
import "./datePickerField.scss";
import moment from "moment";

registerLocale("pt", ptBR);


export const DatePickerField = ({ dataQa="", name, id, value, className="form-control", onChange, onCalendarOpen, onCalendarClose, disabled, placeholderText, maxDate=null, wrapperClassName=null, minDate=null }) => {

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