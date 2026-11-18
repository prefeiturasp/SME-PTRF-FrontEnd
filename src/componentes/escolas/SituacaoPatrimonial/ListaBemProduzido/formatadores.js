import React from "react";

export const formatarNumeroDocumento = (numeroDocumento) => {
  if (!numeroDocumento || numeroDocumento.trim() === "") {
    return "";
  }

  const numeros = numeroDocumento.split(",").map(num => num.trim()).filter(num => num !== "");

  if (numeros.length === 0) {
    return "-";
  }

  if (numeros.length === 1) {
    return numeros[0];
  }

  return numeros.map(num => (
    <div key={num} style={{ marginBottom: "2px" }}>
      {num}
    </div>
  ));
};

export const formatarNumeroProcesso = (numeroProcesso) => {
  if (!numeroProcesso || numeroProcesso.trim() === "") {
    return "-";
  }

  const numero = numeroProcesso.trim();

  if (numero.includes(".") || numero.includes("-")) {
    return numero;
  }

  if (/^\d+$/.test(numero)) {
    if (numero.length >= 10) {
      const parte1 = numero.substring(0, 4);
      const parte2 = numero.substring(4, 8);
      const parte3 = numero.substring(8, 15);
      const parte4 = numero.substring(15, 16);
      return `${parte1}.${parte2}/${parte3}-${parte4}`;
    } else {
      return numero.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1.$2/$3-$4");
    }
  }
  return numero;
};

export const formatarValorMonetario = (valor) => {
  if (!valor && valor !== 0) {
    return "-";
  }
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  if (isNaN(numero)) {
    return "-";
  }
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatarData = (data) => {
  if (!data) {
    return "-";
  }
  try {
    if (typeof data === 'string' && data.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    }

    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) {
      return "-";
    }
    return dataObj.toLocaleDateString('pt-BR');
  } catch (error) {
    return "-";
  }
};
