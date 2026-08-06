export class TextoDocumentoConsolidadoPC {
    constructor(habilita_lauda) {
        this.habilita_lauda = habilita_lauda;
    }

    normal(case_text = "lower") {
        let text = "relatório"

        if (this.habilita_lauda) {
            text = "publicação";
        }

        if (case_text === "upper") {
            text = text.toUpperCase();
        }

        if (case_text === "capitalize") {
            text = text.charAt(0).toUpperCase() + text.slice(1);
        }

        return text;
    }

    possessivo() {
        const artigo = this.habilita_lauda ? "da" : "do";

        return `${artigo} ${this.normal()}`;
    }

    possessivo_acao() {
        const artigo = this.habilita_lauda ? "da" : "do";

        return `${artigo} ${this.texto_acao_simples()}`;
    }

    texto_artigo_a() {
        return this.habilita_lauda ? "gerada após a publicação" : "a geração do relatório";
    }

    texto_emissao() {
        return this.habilita_lauda ? "gerada após a publicação" : "emitida após a geração do relatório";
    }

    texto_acao() {
        return this.habilita_lauda ? "publicação" : "envio externo";
    }

    texto_acao_simples() {
        return this.habilita_lauda ? "publicação" : "envio";
    }

    texto_acao_objeto() {
        return this.habilita_lauda ? "da publicação" : "do envio da documentação"
    }

    texto_titulo_publicacao_modal() {
        return this.habilita_lauda ? "publicação" : "data do envio da documentação"
    }

    texto_pagina_publicacao() {
        return this.habilita_lauda ? "e página da publicação" : "";
    }

    texto_input_label() {
        return this.habilita_lauda ? "e a página da publicação no Diário Oficial da Cidade" : "do envio externo da documentação";
    }

    texto_remover_publicacao() {
        return this.habilita_lauda ? "Remover publicação" : "Remover envio externo da documentação";
    }

    texto_removido() {
        return this.habilita_lauda ? "e página da publicação removidas com sucesso." : "com sucesso.";
    }

    texto_publicacao_aplicada() {
        return this.habilita_lauda ? "e página da publicação aplicadas" : "aplicada";
    }

    texto_lauda_a_ser_publicada() {
        return this.habilita_lauda ? " e nova lauda a ser publicada" : "";
    }

    texto_acao_concreta() {
        return this.habilita_lauda ? "fazer a publicação" : "gerar o relatório";
    }

    texto_status_filtro(is_not=false) {
        let text_status = "Enviado (Externamente)"

        if (is_not) {
            text_status = "Gerado"
        }

        if (this.habilita_lauda) {
            text_status = `${is_not ? 'Não ' : ''}Publicado no D.O`;
        }

        return `${text_status}`
    }

    text_in() {
        let text = "no Relátorio"

        if (this.habilita_lauda) {
            text = "na Publicação";
        }

        return text;
    }

    text_for_status_track_first_step() {
        let firstPart = "Gerado"
        let seecondPart = ""

        if (this.habilita_lauda) {
            firstPart = "Não publicado no"
            seecondPart = "Diário Oficial"
        }

        return (
            <strong>{firstPart} <br /> {seecondPart}</strong>
        )
    }

    text_for_status_track_second_step() {
        let firstPart = "Enviado"
        let seecondPart = "(Externamente)"

        if (this.habilita_lauda) {
            firstPart = "Publicado no"
            seecondPart = "Diário Oficial"
        }

        return (
            <strong>{firstPart} <br /> {seecondPart}</strong>
        )
    }

}
