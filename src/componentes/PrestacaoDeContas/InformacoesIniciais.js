import React from "react";
export const InformacoesIniciais = () => {

    return(
        <div className="col-12 container-texto-introdutorio mb-4">
            <p className="titulos-informacoes pt-3">Fique de olho</p>
            <p>Antes de fazer a prestação de contas será necessário seguir alguns passos:</p>
            <div className="col-12 pb-2">
                <p><span className="titulos-informacoes">1. Atualização dos dados cadastrais e conciliação bancária:</span> selecione um período e uma conta e clique no botão “Consolidar e fechar o período” para abrir a lista com as despesas e receitas. Com tudo validado e preenchido, basta clicar no botão “Fechar período”, isso garante que não haverão alterações nas informações validadas</p>
                <p><span className="titulos-informacoes">2. Geração dos documentos:</span> gerar os documentos permite que essa versão fique salva no sistema, podendo ser recuperada, visualizada e baixada em qualquer momento. Esta ação também gera os documentos oficiais e finais prontos para o envio para a sua Diretoria Regional de Educação (DRE) e anexo ao Sistemas... (SEI).</p>
                <p><span className="titulos-informacoes">3. Encerrar o período:</span> o encerramento da prestação de contas do período marca essa prestação de contas como finalizada, significa que os documentos já foram enviados e estão apenas pendentes de validação pela DRE.</p>
            </div>
        </div>
    )
}