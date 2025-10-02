import React, { useState } from "react";
import Cabecalho from "./Cabecalho";
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {FormRecebimentoPelaDiretoria} from "./FormRecebimentoPelaDiretoria";
import {InformacoesPrestacaoDeContas} from "./InformacoesPrestacaoDeContas";
import ComentariosDeAnalise from "./ComentariosDeAnalise";
import {TabsArquivosDeReferencia} from "./ArquivosDeReferencia/TabsArquivosDeReferencia";
import ConferenciaDeLancamentos from "./ConferenciaDeLancamentos";
import DevolucaoParaAcertos from "./DevolucaoParaAcertos";
import ConferenciaDeDocumentos from "./ConferenciaDeDocumentos";
import DevolutivaDaAssociacao from "./DevolutivaDaAssociacao";
import JustificativaDeFaltaDeAjustes from "./JustificativaDeFaltaDeAjustes";
import {RetornaSeTemPermissaoEdicaoAcompanhamentoDePc} from "../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";
import { PendenciasRecebimento } from "../PendenciasRecebimento";
import ConferenciaDespesasPeriodosAnteriores from "./ConferenciaDespesasPeriodosAnteriores";
import { visoesService } from "../../../../services/visoes.service";
import { STATUS_PRESTACAO_CONTA } from "../../../../constantes/prestacaoConta";


export const GetComportamentoPorStatus = (
    {
        prestacaoDeContas,
        receberPrestacaoDeContas,
        setShowReabrirPc,
        stateFormRecebimentoPelaDiretoria,
        handleChangeFormRecebimentoPelaDiretoria,
        tabelaPrestacoes,
        analisarPrestacaoDeContas,
        setShowNaoRecebida,
        setShowConcluirAnalise,
        setShowRecebida,
        handleChangeFormInformacoesPrestacaoDeContas,
        informacoesPrestacaoDeContas,
        valorTemplate,
        infoAta,
        clickBtnEscolheConta,
        toggleBtnEscolheConta,
        exibeAtaPorConta,
        infoAtaPorConta,
        analisesDeContaDaPrestacao,
        handleChangeAnalisesDeContaDaPrestacao,
        getObjetoIndexAnalise,
        toggleBtnTabelaAcoes,
        clickBtnTabelaAcoes,
        setShowVoltarParaAnalise,
        carregaPrestacaoDeContas,
        dataRecebimentoDevolutiva,
        handleChangedataRecebimentoDevolutiva,
        receberAposAcertos,
        desfazerReceberAposAcertos,
        setLoading,
        adicaoAjusteSaldo,
        setAdicaoAjusteSaldo,
        onClickAdicionarAcertoSaldo,
        onClickDescartarAcerto,
        formErrosAjusteSaldo,
        validaAjustesSaldo,
        handleOnKeyDownAjusteSaldo,
        onClickSalvarAcertoSaldo,
        ajusteSaldoSalvoComSucesso,
        onClickDeletarAcertoSaldo,
        setAnalisesDeContaDaPrestacao,
        bloqueiaBtnRetroceder,
        tooltipRetroceder,
        tooltipAvancar,
        handleConcluirPCemAnalise,
        verificaDadosParaRecebimentoDePrestacaoDeContas
    }) => {

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc()
    const flagAjustesDespesasAnterioresAtiva = visoesService.featureFlagAtiva('ajustes-despesas-anteriores')
    const [updateListaDeDocumentosParaConferencia, setUpdateListaDeDocumentosParaConferencia] = useState(0);
    const [carregaLancamentosParaConferencia, setCarregaLancamentosParaConferencia] = useState(0);
    const [carregaDespesasPeriodosAnterioresParaConferencia, setCarregaDespesasPeriodosAnterioresParaConferencia] = useState(0);

    const onUpdateListaDeDocumentosParaConferencia = () => {
        setUpdateListaDeDocumentosParaConferencia(prev => prev + 1);
    };

    const onCarregaLancamentosParaConferencia = () => {
        setCarregaLancamentosParaConferencia(prev => prev + 1);
    };

    const onCarregaDespesasPeriodosAnterioresParaConferencia = () => {
        setCarregaDespesasPeriodosAnterioresParaConferencia(prev => prev + 1)
    };

    const podeReceber = () => {
        return (
            TEMPERMISSAO && 
            stateFormRecebimentoPelaDiretoria.data_recebimento && 
            informacoesPrestacaoDeContas.processo_sei && 
            prestacaoDeContas.ata_aprensentacao_gerada
        )
    };

    const podeReceberDevolvidaRetornada = () => {
        // const naoRequerAta = prestacaoDeContas.possui_apenas_categorias_que_nao_requerem_ata;
        // if (naoRequerAta) {
        //     return TEMPERMISSAO && dataRecebimentoDevolutiva;
        // }
        // return TEMPERMISSAO && dataRecebimentoDevolutiva && prestacaoDeContas.ata_retificacao_gerada;
        return TEMPERMISSAO && dataRecebimentoDevolutiva;
    };


    const tooltipReceberAposAcerto = () => {
        if(prestacaoDeContas && prestacaoDeContas.status === STATUS_PRESTACAO_CONTA.DEVOLVIDA_RETORNADA && !dataRecebimentoDevolutiva){
            return "É necessário informar a data de recebimento para realizar o recebimento da Prestação de Contas."
        } 
        // else if(prestacaoDeContas && prestacaoDeContas.status === STATUS_PRESTACAO_CONTA.DEVOLVIDA_RETORNADA && !prestacaoDeContas.ata_retificacao_gerada && !prestacaoDeContas.possui_apenas_categorias_que_nao_requerem_ata){
        //     return "É necessário efetuar a geração da ata de retificação para realizar o recebimento da Prestação de Contas."
        // }
            
        return null;
    }

    if (prestacaoDeContas && prestacaoDeContas.status) {
        if (prestacaoDeContas.status === 'NAO_RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Receber"}
                        textoBtnRetroceder={"Reabrir PC"}
                        metodoAvancar={() => verificaDadosParaRecebimentoDePrestacaoDeContas()}
                        metodoRetroceder={() => setShowReabrirPc(true)}
                        disabledBtnAvancar={!podeReceber()}
                        disabledBtnRetroceder={!TEMPERMISSAO}
                        tooltipAvancar={tooltipAvancar()}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <PendenciasRecebimento prestacaoDeContas={prestacaoDeContas}/>
                    
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={!TEMPERMISSAO}
                        disabledStatus={true}
                        exibeMotivo={false}
                        exibeRecomendacoes={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Analisar"}
                        textoBtnRetroceder={"Não recebida"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={() => setShowNaoRecebida(true)}
                        disabledBtnAvancar={!TEMPERMISSAO}
                        disabledBtnRetroceder={bloqueiaBtnRetroceder() || !TEMPERMISSAO}
                        tooltipRetroceder={tooltipRetroceder()}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                        exibeRecomendacoes={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )

        } else if (prestacaoDeContas.status === 'EM_ANALISE') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={() => handleConcluirPCemAnalise()}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={!TEMPERMISSAO}
                        disabledBtnRetroceder={bloqueiaBtnRetroceder() || !TEMPERMISSAO}
                        tooltipRetroceder={tooltipRetroceder()}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                        exibeRecomendacoes={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <TabsArquivosDeReferencia
                        infoAta={infoAta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        infoAtaPorConta={infoAtaPorConta}

                        // Props AnalisesDeContaDaPrestacao
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={TEMPERMISSAO}

                        // Props ResumoFinanceiroTabelaTotais
                        valorTemplate={valorTemplate}

                        // Props ResumoFinanceiroTabelaAcoes
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}

                        //ArquivosDeReferenciaVisualizacaoDownload
                        prestacaoDeContas={prestacaoDeContas}
                        adicaoAjusteSaldo={adicaoAjusteSaldo}
                        setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                        onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                        onClickDescartarAcerto={onClickDescartarAcerto}
                        formErrosAjusteSaldo={formErrosAjusteSaldo}
                        validaAjustesSaldo={validaAjustesSaldo}
                        handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                        onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                        ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                        onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
                    />

                    <ConferenciaDeLancamentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                        onCarregaLancamentosParaConferencia={onCarregaLancamentosParaConferencia}
                    />
                    
                    {
                        flagAjustesDespesasAnterioresAtiva ? (
                            <ConferenciaDespesasPeriodosAnteriores
                                prestacaoDeContas={prestacaoDeContas}
                                editavel={TEMPERMISSAO}
                                onCarregaLancamentosParaConferencia={onCarregaDespesasPeriodosAnterioresParaConferencia}                    
                            />
                        ) : null
                    }

                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                        onUpdateListaDeDocumentosParaConferencia={onUpdateListaDeDocumentosParaConferencia}
                    />

                    <DevolucaoParaAcertos
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={TEMPERMISSAO}
                        setLoadingAcompanhamentoPC={setLoading}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                        updateListaDeDocumentosParaConferencia={updateListaDeDocumentosParaConferencia}
                        carregaLancamentosParaConferencia={carregaLancamentosParaConferencia}
                        carregaDespesasPeriodosAnterioresParaConferencia={carregaDespesasPeriodosAnterioresParaConferencia}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'DEVOLVIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                        exibeRecomendacoes={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <TabsArquivosDeReferencia
                        infoAta={infoAta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        infoAtaPorConta={infoAtaPorConta}

                        // Props AnalisesDeContaDaPrestacao
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}

                        // Props ResumoFinanceiroTabelaTotais
                        valorTemplate={valorTemplate}

                        // Props ResumoFinanceiroTabelaAcoes
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}

                        //ArquivosDeReferenciaVisualizacaoDownload
                        prestacaoDeContas={prestacaoDeContas}
                        adicaoAjusteSaldo={adicaoAjusteSaldo}
                        setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                        onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                        onClickDescartarAcerto={onClickDescartarAcerto}
                        formErrosAjusteSaldo={formErrosAjusteSaldo}
                        validaAjustesSaldo={validaAjustesSaldo}
                        handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                        onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                        ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                        onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
                    />
                    <ConferenciaDeLancamentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    {
                        flagAjustesDespesasAnterioresAtiva ? (
                            <ConferenciaDespesasPeriodosAnteriores
                                prestacaoDeContas={prestacaoDeContas}
                                editavel={false}
                            />
                        ) : null
                    }                    
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'DEVOLVIDA_RETORNADA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        esconderBotaoRetroceder={true}
                        textoBtnAvancar={"Receber após acertos"}
                        metodoAvancar={() => receberAposAcertos(prestacaoDeContas)}
                        disabledBtnAvancar={!podeReceberDevolvidaRetornada()}
                        tooltipAvancar={tooltipReceberAposAcerto()}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    
                    <PendenciasRecebimento prestacaoDeContas={prestacaoDeContas}/>

                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                        exibeRecomendacoes={false}
                    />
                    <DevolutivaDaAssociacao
                        prestacaoDeContas={prestacaoDeContas}
                        dataRecebimentoDevolutiva={dataRecebimentoDevolutiva}
                        handleChangedataRecebimentoDevolutiva={handleChangedataRecebimentoDevolutiva}
                        editavel={TEMPERMISSAO}
                    />
                    <JustificativaDeFaltaDeAjustes
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <TabsArquivosDeReferencia
                        infoAta={infoAta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        infoAtaPorConta={infoAtaPorConta}

                        // Props AnalisesDeContaDaPrestacao
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}

                        // Props ResumoFinanceiroTabelaTotais
                        valorTemplate={valorTemplate}

                        // Props ResumoFinanceiroTabelaAcoes
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}

                        //ArquivosDeReferenciaVisualizacaoDownload
                        prestacaoDeContas={prestacaoDeContas}
                        adicaoAjusteSaldo={adicaoAjusteSaldo}
                        setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                        onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                        onClickDescartarAcerto={onClickDescartarAcerto}
                        formErrosAjusteSaldo={formErrosAjusteSaldo}
                        validaAjustesSaldo={validaAjustesSaldo}
                        handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                        onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                        ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                        onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
                    />
                    <ConferenciaDeLancamentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />

                    {
                        flagAjustesDespesasAnterioresAtiva ? (
                            <ConferenciaDespesasPeriodosAnteriores
                                prestacaoDeContas={prestacaoDeContas}
                                editavel={false}
                            />
                        ) : null
                    }

                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'DEVOLVIDA_RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Analisar"}
                        textoBtnRetroceder={"Apresentada após acertos"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={() => desfazerReceberAposAcertos(prestacaoDeContas)}
                        disabledBtnAvancar={!TEMPERMISSAO}
                        disabledBtnRetroceder={!TEMPERMISSAO}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        exibeMotivo={false}
                        exibeRecomendacoes={false}
                    />
                    <DevolutivaDaAssociacao
                        prestacaoDeContas={prestacaoDeContas}
                        dataRecebimentoDevolutiva={dataRecebimentoDevolutiva}
                        handleChangedataRecebimentoDevolutiva={handleChangedataRecebimentoDevolutiva}
                        editavel={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <TabsArquivosDeReferencia
                        infoAta={infoAta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        infoAtaPorConta={infoAtaPorConta}

                        // Props AnalisesDeContaDaPrestacao
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}

                        // Props ResumoFinanceiroTabelaTotais
                        valorTemplate={valorTemplate}

                        // Props ResumoFinanceiroTabelaAcoes
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}

                        //ArquivosDeReferenciaVisualizacaoDownload
                        prestacaoDeContas={prestacaoDeContas}
                        adicaoAjusteSaldo={adicaoAjusteSaldo}
                        setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                        onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                        onClickDescartarAcerto={onClickDescartarAcerto}
                        formErrosAjusteSaldo={formErrosAjusteSaldo}
                        validaAjustesSaldo={validaAjustesSaldo}
                        handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                        onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                        ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                        onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
                    />
                    <ConferenciaDeLancamentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    {
                        flagAjustesDespesasAnterioresAtiva ? (
                            <ConferenciaDespesasPeriodosAnteriores
                                prestacaoDeContas={prestacaoDeContas}
                                editavel={false}
                            />
                        ) : null
                    }                    
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'APROVADA_RESSALVA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />

                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Voltar para análise"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowVoltarParaAnalise()}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={!TEMPERMISSAO}
                        esconderBotaoAvancar={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        prestacaoDeContas={prestacaoDeContas}
                        exibeMotivo={true}
                        exibeRecomendacoes={true}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <TabsArquivosDeReferencia
                        infoAta={infoAta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        infoAtaPorConta={infoAtaPorConta}

                        // Props AnalisesDeContaDaPrestacao
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}

                        // Props ResumoFinanceiroTabelaTotais
                        valorTemplate={valorTemplate}

                        // Props ResumoFinanceiroTabelaAcoes
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}

                        //ArquivosDeReferenciaVisualizacaoDownload
                        prestacaoDeContas={prestacaoDeContas}
                        adicaoAjusteSaldo={adicaoAjusteSaldo}
                        setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                        onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                        onClickDescartarAcerto={onClickDescartarAcerto}
                        formErrosAjusteSaldo={formErrosAjusteSaldo}
                        validaAjustesSaldo={validaAjustesSaldo}
                        handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                        onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                        ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                        onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
                    />
                    <ConferenciaDeLancamentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />

                    {
                        flagAjustesDespesasAnterioresAtiva ? (
                            <ConferenciaDespesasPeriodosAnteriores
                                prestacaoDeContas={prestacaoDeContas}
                                editavel={false}
                            />
                        ) : null
                    }

                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'APROVADA' || prestacaoDeContas.status === 'REPROVADA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                    />

                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Voltar para análise"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowVoltarParaAnalise(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={!TEMPERMISSAO}
                        esconderBotaoAvancar={true}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={true}
                        disabledStatus={true}
                        prestacaoDeContas={prestacaoDeContas}
                        exibeMotivo={true}
                        motivo={'motivos_reprovacao'}
                        outros_motivos={'outros_motivos_reprovacao'}
                        exibeRecomendacoes={false}
                    />
                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <TabsArquivosDeReferencia
                        infoAta={infoAta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        infoAtaPorConta={infoAtaPorConta}

                        // Props AnalisesDeContaDaPrestacao
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={false}

                        // Props ResumoFinanceiroTabelaTotais
                        valorTemplate={valorTemplate}

                        // Props ResumoFinanceiroTabelaAcoes
                        toggleBtnTabelaAcoes={toggleBtnTabelaAcoes}
                        clickBtnTabelaAcoes={clickBtnTabelaAcoes}

                        //ArquivosDeReferenciaVisualizacaoDownload
                        prestacaoDeContas={prestacaoDeContas}
                        adicaoAjusteSaldo={adicaoAjusteSaldo}
                        setAdicaoAjusteSaldo={setAdicaoAjusteSaldo}
                        onClickAdicionarAcertoSaldo={onClickAdicionarAcertoSaldo}
                        onClickDescartarAcerto={onClickDescartarAcerto}
                        formErrosAjusteSaldo={formErrosAjusteSaldo}
                        validaAjustesSaldo={validaAjustesSaldo}
                        handleOnKeyDownAjusteSaldo={handleOnKeyDownAjusteSaldo}
                        onClickSalvarAcertoSaldo={onClickSalvarAcertoSaldo}
                        ajusteSaldoSalvoComSucesso={ajusteSaldoSalvoComSucesso}
                        onClickDeletarAcertoSaldo={onClickDeletarAcertoSaldo}
                    />
                    <ConferenciaDeLancamentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />

                    {
                        flagAjustesDespesasAnterioresAtiva ? (
                            <ConferenciaDespesasPeriodosAnteriores
                                prestacaoDeContas={prestacaoDeContas}
                                editavel={false}
                            />
                        ) : null
                    }                    
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={TEMPERMISSAO}
                    />
                </>
            )
        }
    }
};