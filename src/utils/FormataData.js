import moment from "moment";

export const formataData = (data, formato = 'DD/MM/YYYY') => {
    return moment(data).format(formato);
};