import React from "react";
import MaskedInput from 'react-text-mask'
import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import pt from "date-fns/locale/pt-BR";
import "./datePickerField.scss";
import moment from "moment";

registerLocale("pt", pt );


export const DatePickerField = ({ name, value, onChange }) => {
    return (
        <DatePicker
            selected={(value && new Date(moment(value).format('MMMM D, YYYY'))) || null}
            onChange={val => {
                onChange(name, val);
            }}
            dateFormat="dd/MM/yyyy"
            locale="pt"
            showYearDropdown
            className="form-control"
            placeholderText="Somente números"
            customInput={
                <MaskedInput
                    mask = {[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                />
            }
        />
    );
};