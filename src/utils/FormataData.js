import moment from "moment";

export const formataDataParaPadraoYYYYMMDD = (data) => {
    const date = new Date(data);
    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const dia = String(date.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
};

export const formataDataYYYYMMDDParaApresentacao = (data) => {
    const date = new Date(data);
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const ano = date.getFullYear();

    return `${dia < 10 ? "0" : ""}${dia}/${mes < 10 ? "0" : ""}${mes}/${ano}`;
}

export const formataData = (data, formato = 'DD/MM/YYYY') => {
    return moment(data).format(formato);
};