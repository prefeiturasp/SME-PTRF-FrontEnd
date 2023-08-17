import moment from "moment";

export const formataDataParaPadraoYYYYMMDD = (data) => {
    const date = new Date(data);
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
};

export const formataData = (data, formato = 'DD/MM/YYYY') => {
    return moment(data).format(formato);
};