import React from "react";
import Cabecalho from "./Cabecalho";
import {BotoesAvancarRetroceder} from "./BotoesAvancarRetroceder";
import {TrilhaDeStatus} from "./TrilhaDeStatus";
import {FormRecebimentoPelaDiretoria} from "./FormRecebimentoPelaDiretoria";
import {InformacoesPrestacaoDeContas} from "./InformacoesPrestacaoDeContas";
import {InformacoesDevolucaoAoTesouro} from "./InformacoesDevolucaoAoTesouro";
import ComentariosDeAnalise from "./ComentariosDeAnalise";
import {TabsArquivosDeReferencia} from "./ArquivosDeReferencia/TabsArquivosDeReferencia";
import ConferenciaDeLancamentos from "./ConferenciaDeLancamentos";
import DevolucaoParaAcertos from "./DevolucaoParaAcertos";
import {BotaoSalvarRodape} from "./BotaoSalvarRodape";
import ConferenciaDeDocumentos from "./ConferenciaDeDocumentos";
import DevolutivaDaAssociacao from "./DevolutivaDaAssociacao";


export const GetComportamentoPorStatus = (
    {
        valoresReprogramadosAjustes,
        setValoresReprogramadosAjustes,
        prestacaoDeContas,
        receberPrestacaoDeContas,
        setShowReabrirPc,
        stateFormRecebimentoPelaDiretoria,
        handleChangeFormRecebimentoPelaDiretoria,
        tabelaPrestacoes,
        analisarPrestacaoDeContas,
        setShowNaoRecebida,
        salvarAnalise,
        setShowConcluirAnalise,
        setShowRecebida,
        handleChangeFormInformacoesPrestacaoDeContas,
        informacoesPrestacaoDeContas,
        initialFormDevolucaoAoTesouro,
        formRef,
        despesas,
        buscaDespesaPorFiltros,
        buscaDespesa,
        valorTemplate,
        despesasTabelas,
        tiposDevolucao,
        validateFormDevolucaoAoTesouro,
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
        btnSalvarDisabled,
        setBtnSalvarDisabled,
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
        setAnalisesDeContaDaPrestacao
    }) => {

    if (prestacaoDeContas && prestacaoDeContas.status) {
        if (prestacaoDeContas.status === 'NAO_RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Receber"}
                        textoBtnRetroceder={"Reabrir PC"}
                        metodoAvancar={receberPrestacaoDeContas}
                        metodoRetroceder={() => setShowReabrirPc(true)}
                        disabledBtnAvancar={!stateFormRecebimentoPelaDiretoria.data_recebimento}
                        disabledBtnRetroceder={false}
                    />
                    <TrilhaDeStatus
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <FormRecebimentoPelaDiretoria
                        handleChangeFormRecebimentoPelaDiretoria={handleChangeFormRecebimentoPelaDiretoria}
                        stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                        tabelaPrestacoes={tabelaPrestacoes}
                        disabledNome={true}
                        disabledData={false}
                        disabledStatus={true}
                        exibeMotivo={false}
                        exibeRecomendacoes={false}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Analisar"}
                        textoBtnRetroceder={"Não recebida"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={() => setShowNaoRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
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
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )

        } else if (prestacaoDeContas.status === 'EM_ANALISE') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={true}
                        metodoSalvarAnalise={salvarAnalise}
                        btnSalvarDisabled={btnSalvarDisabled}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Recebida"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowRecebida(true)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
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
                        editavel={true}
                    />
                    <InformacoesDevolucaoAoTesouro
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        initialValues={initialFormDevolucaoAoTesouro}
                        formRef={formRef}
                        despesas={despesas}
                        buscaDespesaPorFiltros={buscaDespesaPorFiltros}
                        buscaDespesa={buscaDespesa}
                        valorTemplate={valorTemplate}
                        despesasTabelas={despesasTabelas}
                        tiposDevolucao={tiposDevolucao}
                        validateFormDevolucaoAoTesouro={validateFormDevolucaoAoTesouro}
                        setBtnSalvarDisabled={setBtnSalvarDisabled}
                    />
                    <TabsArquivosDeReferencia
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                        infoAta={infoAta}
                        toggleBtnEscolheConta={toggleBtnEscolheConta}
                        exibeAtaPorConta={exibeAtaPorConta}
                        clickBtnEscolheConta={clickBtnEscolheConta}
                        infoAtaPorConta={infoAtaPorConta}

                        // Props AnalisesDeContaDaPrestacao
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        handleChangeAnalisesDeContaDaPrestacao={handleChangeAnalisesDeContaDaPrestacao}
                        getObjetoIndexAnalise={getObjetoIndexAnalise}
                        editavel={true}

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
                        editavel={true}
                    />
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={true}
                    />
                    <DevolucaoParaAcertos
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={true}
                        setLoadingAcompanhamentoPC={setLoading}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                    <div className='d-flex flex-row-reverse bd-highlight'>
                        <BotaoSalvarRodape
                            exibeSalvar={true}
                            textoBtn={'Salvar'}
                            metodoSalvarAnalise={salvarAnalise}
                            btnSalvarDisabled={btnSalvarDisabled}
                        />
                    </div>

                </>
            )
        } else if (prestacaoDeContas.status === 'DEVOLVIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
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
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
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
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'DEVOLVIDA_RETORNADA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        esconderBotaoRetroceder={true}
                        textoBtnAvancar={"Receber após acertos"}
                        metodoAvancar={() => receberAposAcertos(prestacaoDeContas)}
                        disabledBtnAvancar={!dataRecebimentoDevolutiva}
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
                    />

                    <InformacoesPrestacaoDeContas
                        handleChangeFormInformacoesPrestacaoDeContas={handleChangeFormInformacoesPrestacaoDeContas}
                        informacoesPrestacaoDeContas={informacoesPrestacaoDeContas}
                        editavel={false}
                    />
                    <TabsArquivosDeReferencia
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
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
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'DEVOLVIDA_RECEBIDA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />
                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Analisar"}
                        textoBtnRetroceder={"Apresentada após acertos"}
                        metodoAvancar={analisarPrestacaoDeContas}
                        metodoRetroceder={() => desfazerReceberAposAcertos(prestacaoDeContas)}
                        disabledBtnAvancar={false}
                        disabledBtnRetroceder={false}
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
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
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
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'APROVADA_RESSALVA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />

                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Voltar para análise"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowVoltarParaAnalise(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={false}
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
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
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
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        } else if (prestacaoDeContas.status === 'APROVADA' || prestacaoDeContas.status === 'REPROVADA') {
            return (
                <>
                    <Cabecalho
                        prestacaoDeContas={prestacaoDeContas}
                        exibeSalvar={false}
                    />

                    <BotoesAvancarRetroceder
                        prestacaoDeContas={prestacaoDeContas}
                        textoBtnAvancar={"Concluir análise"}
                        textoBtnRetroceder={"Voltar para análise"}
                        metodoAvancar={() => setShowConcluirAnalise(true)}
                        metodoRetroceder={() => setShowVoltarParaAnalise(true)}
                        disabledBtnAvancar={true}
                        disabledBtnRetroceder={false}
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
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
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
                    <ConferenciaDeDocumentos
                        prestacaoDeContas={prestacaoDeContas}
                        editavel={false}
                    />
                    <DevolucaoParaAcertos
                        valoresReprogramadosAjustes={valoresReprogramadosAjustes}
                        setValoresReprogramadosAjustes={setValoresReprogramadosAjustes}
                        prestacaoDeContas={prestacaoDeContas}
                        analisesDeContaDaPrestacao={analisesDeContaDaPrestacao}
                        carregaPrestacaoDeContas={carregaPrestacaoDeContas}
                        infoAta={infoAta}
                        editavel={false}
                        setAnalisesDeContaDaPrestacao={setAnalisesDeContaDaPrestacao}
                    />
                    <ComentariosDeAnalise
                        prestacaoDeContas={prestacaoDeContas}
                    />
                </>
            )
        }
    }
};