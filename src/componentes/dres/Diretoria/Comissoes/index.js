import React, {useEffect, useState} from "react";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import {MenuInterno} from "../../../Globais/MenuInterno";
import {getUnidade} from "../../../../services/dres/Unidades.service";
import Loading from "../../../../utils/Loading";
import { TopoComBotoes } from "./TopoComBotoes";
import { Filtros } from "./FormFiltros";
import { ListaComissoes } from "./ListaComissoes";
import "./comissoes.scss"
import { getMembrosComissao, getComissoes, getMembrosComissaoFiltro, postMembroComissao, patchMembroComissao, deleteMembroComissao } from "../../../../services/dres/Comissoes.service";
import { ModalAdicionarMembroComissao, ModalEditarMembroComissao, ModalConfirmaExclusaoMembroComissao } from "./Modais";
import { consultarRF } from "../../../../services/escolas/Associacao.service";
import { apenasNumero } from "../../../../utils/ValidacoesAdicionaisFormularios";
import { ModalInfoNaoPodeGravar } from "../../../sme/Parametrizacoes/Estrutura/Acoes/ModalInfoNaoPodeGravar";

export const Comissoes = () => {
    const estadoInicialFiltros = {
        filtrar_por_rf_ou_nome: "",
        filtar_por_comissao: "",
    };

    const estadoInicialModal = {
        registro_funcional_modal: "",
        nome_modal: "",
        email_modal: "",
        comissoes_modal: []
    };

    const estadoInicialErrosModal = {
        servidor_nao_encontrado: null,
        comissao_vazia: null,
        email_invalido: null
    }

    const [loading, setLoading] = useState(true);
    const [loadingMembrosComissao, setLoadingMembrosComissao] = useState(true);
    const [dadosDiretoria, setDadosDiretoria] = useState(null);
    const [membrosComissao, setMembrosComissao] = useState([]);
    const [listaComissoes, setListaComissoes] = useState([]);
    const [estadoFiltros, setEstadoFiltros] = useState(estadoInicialFiltros)
    const [showModalAdicao, setShowModalAdicao] = useState(false);
    const [showModalEdicao, setShowModalEdicao] = useState(false);
    const [showModalExclusao, setShowModalExclusao] = useState(false);
    const [estadoModal, setEstadoModal] = useState(estadoInicialModal)
    const [errosModal, setErrosModal] = useState(estadoInicialErrosModal)
    const [showModalInfoNaoPodeGravar, setShowModalInfoNaoPodeGravar] = useState(false);
    const [mensagemModalInfoNaoPodeGravar, setMensagemModalInfoNaoPodeGravar] = useState("");
    

    useEffect(() => {
        buscaDiretoria()
    }, []);

    useEffect(() => {
        buscaMembrosComissao()
    }, [dadosDiretoria]);

    useEffect(() => {
        buscaComissoes()
    }, []);
    
    const buscaDiretoria = async () => {
        let diretoria = await getUnidade();
        setDadosDiretoria(diretoria);
        setLoading(false)
    };

    const buscaMembrosComissao = async () => {
        if(dadosDiretoria && dadosDiretoria.uuid){
            let membros_comissao = await getMembrosComissao(dadosDiretoria.uuid);
            setMembrosComissao(membros_comissao);
            setLoadingMembrosComissao(false);
        }
    }

    const buscaComissoes = async () => {
        let dados = await getComissoes();
        setListaComissoes(dados)
    }

    const handleOnChangeFiltros = (name, value) => {
        setEstadoFiltros({
            ...estadoFiltros,
            [name]: value
        });
    }

    const handleOnSubmitFiltros = async (event) => {
        setLoadingMembrosComissao(true);
        event.preventDefault();
        let resultado_filtros = await getMembrosComissaoFiltro(dadosDiretoria.uuid, 
                                                               estadoFiltros.filtar_por_comissao, 
                                                               estadoFiltros.filtrar_por_rf_ou_nome)

        setMembrosComissao(resultado_filtros);
        setLoadingMembrosComissao(false);
    }
    
    const handleOnLimparFiltros = async() => {
        setLoadingMembrosComissao(true);
        setEstadoFiltros(estadoInicialFiltros);
        await buscaMembrosComissao();
    }

    const handleOnShowModalAdicao = () => {
        setErrosModal(estadoInicialErrosModal);
        setEstadoModal(estadoInicialModal);
        setShowModalAdicao(true);
    }

    const handleOnHideModalAdicao = () => {
        setShowModalAdicao(false);
    }

    const handleOnShowModalEdicao = (values) => {
        /* 
            É necessário criar uma lista apenas com os ids das comissoes
            para o component Select preencher o value corretamente
        */

        let lista_ids_comissoes = []
        for(let i=0; i<=values.comissoes.length-1; i++){
            lista_ids_comissoes.push(values.comissoes[i].id)
        }

        let estado = {
            uuid: values.uuid,
            registro_funcional_modal: values.rf,
            nome_modal: values.nome,
            email_modal: values.email ? values.email : '',
            comissoes_modal: lista_ids_comissoes,
        }

        setErrosModal(estadoInicialErrosModal);
        setEstadoModal(estado);
        setShowModalEdicao(true);
    }

    const handleOnHideModalEdicao = () => {
        setShowModalEdicao(false);
    }

    const handleOnChangeModal = (name, value, edicao=false) => {
        setEstadoModal({
            ...estadoModal,
            [name]: value
        });
    }

    const handleOnChangeMultipleSelectModal =  async (value) => {
        let name = "comissoes_modal"

        setEstadoModal({
            ...estadoModal,
            [name]: value
        });
    }

    const handleOnChangeRegistroFuncional= (e, edicao=false) => {
        let name = e.target.name;
        let value = e.target.value;

        if(apenasNumero(value)){
            setEstadoModal({
                ...estadoModal,
                [name]: value
            })
        } 
    }

    const handleOnBlurRegistroFuncional = async() => {
        try{
            let rf = estadoModal.registro_funcional_modal;
            let servidor = await consultarRF(rf);
    
            if (servidor.status === 200 || servidor.status === 201) {
                let nome_servidor = servidor.data[0].nm_pessoa
                
                let name = "nome_modal"
    
                setEstadoModal({
                    ...estadoModal,
                    [name]: nome_servidor
                });
                
                let erro = "servidor_nao_encontrado"
                setErrosModal({
                    ...errosModal,
                    [erro]: null
                });
            }
        }
        catch (e){
            let name = "nome_modal"
            setEstadoModal({
                ...estadoModal,
                [name]: ''
            });

            let erro = "servidor_nao_encontrado"
            setErrosModal({
                ...errosModal,
                [erro]: "Servidor não encontrado"
            });
        }
    }

    const validaCampos = () => {
        let validado = true;
        let erros_encontrados = {
            servidor_nao_encontrado: errosModal.servidor_nao_encontrado,
            comissao_vazia: null,
            email_invalido: null
        }

        // Valida campo RF
        if(estadoModal.registro_funcional_modal === ""){
            if(erros_encontrados.servidor_nao_encontrado === null){
                erros_encontrados.servidor_nao_encontrado = "Campo obrigatório"
                validado = false;
            }
            validado = false;
            
        }
        else{
            if(erros_encontrados.servidor_nao_encontrado === "Servidor não encontrado"){
                validado = false;
            }
        }

        // Valida email
        if(estadoModal.email_modal !== ""){
            let regex_email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

            if(!regex_email.test(estadoModal.email_modal)){
                erros_encontrados.email_invalido = "Digite um email válido"
                validado = false;
            }
        }

        // Valida comissão
        if(estadoModal.comissoes_modal.length === 0){
            erros_encontrados.comissao_vazia = "Escolha pelo menos uma comissão"
            validado = false;
        }

        setErrosModal(erros_encontrados)
        return validado;
    }

    const handleOnSubmitModal = async() => {
        if(validaCampos()){
            if(estadoModal.uuid){
                let payload = {
                    dre: dadosDiretoria.uuid,
                    rf: estadoModal.registro_funcional_modal,
                    nome: estadoModal.nome_modal,
                    email: estadoModal.email_modal,
                    comissoes: estadoModal.comissoes_modal
                }

                try{
                    await patchMembroComissao(estadoModal.uuid, payload);
                    setLoadingMembrosComissao(true);
                    setShowModalEdicao(false);
                    await buscaMembrosComissao();
                    
                }
                catch (e){
                    if(e.response.data && e.response.data.detail){
                        setShowModalInfoNaoPodeGravar(true);
                        setMensagemModalInfoNaoPodeGravar(e.response.data.detail);
                    }
                    else{
                        console.log("ocorreu um erro ", e)
                    }
                }
            }
            else{
                let payload = {
                    dre: dadosDiretoria.uuid,
                    rf: estadoModal.registro_funcional_modal,
                    nome: estadoModal.nome_modal,
                    email: estadoModal.email_modal,
                    comissoes: estadoModal.comissoes_modal
                }
                
                try{
                    await postMembroComissao(payload);
                    setLoadingMembrosComissao(true);
                    setShowModalAdicao(false);
                    await buscaMembrosComissao();
                    
                }
                catch (e){
                    if(e.response.data && e.response.data.detail){
                        setShowModalInfoNaoPodeGravar(true);
                        setMensagemModalInfoNaoPodeGravar(e.response.data.detail);
                    }
                    else{
                        console.log("ocorreu um erro ", e)
                    }
                }
            }
        }
    }

    const handleDeleteMembro = async () => {
        try{
            await deleteMembroComissao(estadoModal.uuid);
            setLoadingMembrosComissao(true);
            setShowModalExclusao(false);
            setShowModalEdicao(false);
            await buscaMembrosComissao();
        }
        catch(e){
            console.log("ocorreu um erro ", e)
        }
    }

    const handleOnShowModalExclusao = () => {
        setShowModalExclusao(true);
    }

    const handleOnHideModalExclusao = () => {
        setShowModalExclusao(false);
    }

    const handleConfirmaExclusao = async() => {
        handleDeleteMembro();
    }

    const handleCloseInfoNaoPodeGravar = () => {
        setShowModalInfoNaoPodeGravar(false);
        setMensagemModalInfoNaoPodeGravar("");
      };

    return(
        <>
            {loading ? (
                    <div className="mt-5">
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    </div>
                ) :
                dadosDiretoria ? (
                <>
                    <div className="d-flex bd-highlight">
                        <div className="p-2 flex-grow-1 bd-highlight">
                            <h1 className="titulo-itens-painel mt-5">Comissões da Diretoria {dadosDiretoria.nome}</h1>
                        </div>
                    </div>

                    <div className="page-content-inner">
                        
                        <MenuInterno
                            caminhos_menu_interno={UrlsMenuInterno}
                        />

                        <TopoComBotoes
                            handleOnShowModalAdicao={handleOnShowModalAdicao}
                        />

                        <Filtros
                            listaComissoes={listaComissoes}
                            handleOnChangeFiltros={handleOnChangeFiltros}
                            estadoFiltros={estadoFiltros}
                            handleOnSubmitFiltros={handleOnSubmitFiltros}
                            handleOnLimparFiltros={handleOnLimparFiltros}
                        />

                        <ListaComissoes
                            membrosComissao={membrosComissao}
                            loadingMembrosComissao={loadingMembrosComissao}
                            handleOnShowModalEdicao={handleOnShowModalEdicao}
                        />

                        <ModalAdicionarMembroComissao
                            show={showModalAdicao}
                            onHide={handleOnHideModalAdicao}
                            titulo="Adicionar membro de comissão"
                            estadoModal={estadoModal}
                            handleOnChangeRegistroFuncional={handleOnChangeRegistroFuncional}
                            handleOnChangeModal={handleOnChangeModal}
                            handleOnBlurRegistroFuncional={handleOnBlurRegistroFuncional}
                            handleOnSubmitModal={handleOnSubmitModal}
                            handleOnChangeMultipleSelectModal={handleOnChangeMultipleSelectModal}
                            listaComissoes={listaComissoes}
                            errosModal={errosModal}
                        />

                        <ModalEditarMembroComissao
                            show={showModalEdicao}
                            onHide={handleOnHideModalEdicao}
                            titulo="Editar membro de comissão"
                            estadoModal={estadoModal}
                            handleOnChangeRegistroFuncional={handleOnChangeRegistroFuncional}
                            handleOnChangeModal={handleOnChangeModal}
                            handleOnBlurRegistroFuncional={handleOnBlurRegistroFuncional}
                            handleOnSubmitModal={handleOnSubmitModal}
                            handleOnChangeMultipleSelectModal={handleOnChangeMultipleSelectModal}
                            listaComissoes={listaComissoes}
                            errosModal={errosModal}
                            handleOnShowModalExclusao={handleOnShowModalExclusao}
                        />

                        <ModalConfirmaExclusaoMembroComissao
                            show={showModalExclusao}
                            onHide={handleOnHideModalExclusao}
                            titulo="Excluir membro de comissão"
                            handleConfirmaExclusao={handleConfirmaExclusao}
                        />


                        <ModalInfoNaoPodeGravar
                            show={showModalInfoNaoPodeGravar}
                            handleClose={handleCloseInfoNaoPodeGravar}
                            titulo="Atualização não permitida"
                            texto={mensagemModalInfoNaoPodeGravar}
                            primeiroBotaoTexto="Fechar"
                            primeiroBotaoCss="success"
                        />
        

                    </div>
                </>
                ) : null}
        </>
    );
};