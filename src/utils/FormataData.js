import moment from "moment";

export const formataData = (data, formato = "DD/MM/YYYY") => {
  return moment(data).format(formato);
};

export const formatDateOrDash = (date) => (date ? moment(date).format("DD/MM/YYYY") : "-");
