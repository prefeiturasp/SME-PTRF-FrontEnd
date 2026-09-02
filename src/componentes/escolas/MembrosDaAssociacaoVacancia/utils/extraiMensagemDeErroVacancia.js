// Erros de negócio da v2 (CargoComposicaoVacanciaValidationError) chegam como
// {"mensagem": "texto"} - diferente dos non_field_errors/detail que a v1 usa.

export const extraiMensagemDeErroVacancia = (error) => {
    const dados = error?.response?.data;

    if (!dados) {
        console.info(error)
        return 'Erro inesperado, tente novamente.';
    }

    if (dados.mensagem) {
        return dados.mensagem;
    }

    if (dados.non_field_errors && dados.non_field_errors.length > 0) {
        return dados.non_field_errors.join(' ');
    }

    return dados.detail || 'Erro inesperado, tente novamente.';
};