import React, {memo, useMemo, useCallback, useEffect, useState} from "react";
import "./arquivos-de-carga.scss"
import "../../dres/Associacoes/associacoes.scss"
import {Redirect, useParams} from 'react-router-dom'
import {BotoesTopo} from "./BotoesTopo";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {
    getTabelaArquivosDeCarga,
    getArquivosDeCargaFiltros,
    postCreateArquivoDeCarga,
    patchAlterarArquivoDeCarga,
    deleteTag
} from "../../../services/sme/Parametrizacoes.service";
import moment from "moment";
import TabelaArquivosDeCarga from "./TabelaArquivosDeCarga";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faCogs, faDownload, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {Filtros} from "./Filtros";
import {MenuInterno} from "../MenuInterno";
import ModalFormArquivosDeCarga from "./ModalFormArquivosDeCarga";
import {ModalInfoArquivoDeCargas} from "./ModalInfoArquivoDeCargas";
import {ModalConfirmDeleteArquivoDeCarga} from "./ModalConfirmDeleteArquivoDeCarga";

const ArquivosDeCarga = () => {

    const url_params = useParams();
    const dadosDeOrigem = useMemo(() => {
        let obj = {
            titulo: '',
            acesso_permitido: false,
            url: "",
            origem:''
        };

        if (url_params.tipo_de_carga === 'CARGA_ASSOCIACOES') {
            obj = {
                titulo: 'Associações',
                acesso_permitido: true,
                UrlsMenuInterno:[
                    {label: "Dados das associações", url: "parametro-associacoes"},
                    {label: "Cargas de arquivo", url: 'parametro-arquivos-de-carga', origem:'CARGA_ASSOCIACOES'},
                ],
            }
        }
        return obj
    }, [url_params]);


    const [tabelaArquivos, setTabelaArquivos] = useState([]);
    const [arquivos, setArquivos] = useState([]);

    const carregaTabelaArquivos = useCallback(async () => {
        if (dadosDeOrigem.acesso_permitido) {
            let tabela = await getTabelaArquivosDeCarga();
            console.log("TABELA ", tabela);
            setTabelaArquivos(tabela)
        }
    }, [dadosDeOrigem.acesso_permitido]);

    useEffect(() => {
        carregaTabelaArquivos();
    }, [carregaTabelaArquivos]);

    const carregaArquivosPeloTipoDeCarga = useCallback(async () => {
        if (dadosDeOrigem.acesso_permitido) {
            try {
                let arquivos = await getArquivosDeCargaFiltros(url_params.tipo_de_carga);
                console.log("Arquivos ", arquivos);
                setArquivos(arquivos)
            } catch (e) {
                console.log("Erro ao carregar arquivos")
            }
        }

    }, [url_params, dadosDeOrigem.acesso_permitido]);

    useEffect(() => {
        carregaArquivosPeloTipoDeCarga()
    }, [carregaArquivosPeloTipoDeCarga]);

    // Quando a state de todasAsAcoes sofrer alteração
    const totalDeArquivos = useMemo(() => arquivos.length, [arquivos]);

    // Filtros
    const initialStateFiltros = {
        filtrar_por_identificador: "",
        filtrar_por_status: "",
        filtrar_por_data_de_execucao: "",
    };
    const [stateFiltros, setStateFiltros] = useState(initialStateFiltros);

    const handleChangeFiltros = useCallback((name, value) => {
        setStateFiltros({
            ...stateFiltros,
            [name]: value
        });
    }, [stateFiltros]);

    const handleSubmitFiltros = async () => {
        let arquivos_filtrados = await getArquivosDeCargaFiltros(url_params.tipo_de_carga, stateFiltros.filtrar_por_identificador, stateFiltros.filtrar_por_status, stateFiltros.filtrar_por_data_de_execucao ? moment(stateFiltros.filtrar_por_data_de_execucao).format('YYYY-MM-DD') : '');
        setArquivos(arquivos_filtrados);
    };

    const limpaFiltros = async () => {
        setStateFiltros(initialStateFiltros);
        await carregaArquivosPeloTipoDeCarga();
    };

    //Para a Tabela
    const rowsPerPage = 10;

    const conteudoTemplate = (rowData, column) => {
        return (
            <div className='quebra-palavra'>
                {rowData[column.field].split('/').pop()}
            </div>
        )
    };

    const statusTemplate = useCallback((rowData='', status_estatico='') => {
        if (tabelaArquivos && tabelaArquivos.status && tabelaArquivos.status.length > 0) {
            let status_retornar;
            if (rowData){
                status_retornar = tabelaArquivos.status.filter(item => item.id === rowData.status);
            }else if(status_estatico){
                status_retornar = tabelaArquivos.status.filter(item => item.id === status_estatico);
            }else {
                return ''
            }
            return status_retornar[0].nome
        }
    }, [tabelaArquivos]);

    const dataTemplate = (rowData, column) => {
        return (
            <div>
                {rowData[column.field] ? moment(rowData[column.field]).format('DD/MM/YYYY') : '-'}
            </div>
        )
    };

    const dataHoraTemplate = (rowData, column) => {
        return rowData[column.field] ? moment(rowData[column.field]).format("DD/MM/YYYY [às] HH[h]mm") : '-'
    };

    // Modais
    const initialStateFormModal = {
        identificador: '',
        tipo_carga: url_params.tipo_de_carga,
        tipo_delimitador: '',
        ultima_execucao: '',
        status: '',
        conteudo: '',
        uuid: "",
        log: "",
        operacao: 'create',
    };

    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalInfoArquivosDeCarga, setShowModalInfoArquivosDeCarga] = useState(false);
    const [showModalConfirmDeleteArquivosDeCarga, setShowModalConfirmDeleteArquivosDeCarga] = useState(false);
    const [infoModalArquivosDeCarga, setInfoModalArquivosDeCarga] = useState('');

    const handleEditarArquivos = useCallback(async (rowData) => {
        setShowModalForm(true);
        setStateFormModal({
            ...stateFormModal,
            identificador: rowData.identificador,
            tipo_carga: rowData.tipo_carga,
            tipo_delimitador: rowData.tipo_delimitador,
            ultima_execucao: rowData.ultima_execucao ? moment(rowData.ultima_execucao).format('DD/MM/YYYY') : '-',
            status: rowData.status,
            conteudo: rowData.conteudo,
            uuid: rowData.uuid,
            log: rowData.log,
            operacao: 'edit',
            }
        )
    }, [stateFormModal]);

    const acoesTemplate = useCallback((rowData) => {
        return (

            <div className="dropdown">
                <span id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false">
                    <button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>
                </span>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <button className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                            icon={faCogs}
                        />
                        <strong>Processar</strong>
                    </button>
                    <button onClick={() => handleEditarArquivos(rowData)} className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                            icon={faEdit}
                        />
                        <strong>Editar</strong>
                    </button>
                    <button className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                            icon={faDownload}
                        />
                        <strong>Baixar</strong>
                    </button>
                    <button onClick={()=>setShowModalConfirmDeleteArquivosDeCarga(true)} className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#B40C02"}}
                            icon={faTrashAlt}
                        />
                        <strong>Excluir</strong>
                    </button>
                </div>
            </div>
        )
    }, [handleEditarArquivos]);

    const handleSubmitModalForm = async (values) => {
        console.log("handleSubmitModalFormAssociacoes ", values);
        if (values.operacao === 'create'){
            try {
                let payload = {
                    'identificador': values.identificador,
                    'tipo_carga': url_params.tipo_de_carga,
                    'tipo_delimitador': values.tipo_delimitador,
                    'status': 'PENDENTE',
                    'conteudo': values.conteudo
                };
                await postCreateArquivoDeCarga(payload);
                console.log("Arquivo de carga criado com sucesso");
                setShowModalForm(false);
                setInfoModalArquivosDeCarga('Arquivo de carga criado com sucesso');
                setShowModalInfoArquivosDeCarga(true);
                await carregaArquivosPeloTipoDeCarga();
            }catch (e) {
                console.log("Erro ao criar Arquivo de carga ", e.response.data);
                setInfoModalArquivosDeCarga('Erro ao criar Arquivo de carga');
                setShowModalInfoArquivosDeCarga(true);
                if (e.response.data.identificador[0]){
                    setInfoModalArquivosDeCarga(e.response.data.identificador[0]);
                    setShowModalInfoArquivosDeCarga(true);
                }
            }
        }else if (values.operacao === 'edit'){
            try {
                let payload = {
                    'identificador': values.identificador,
                    'tipo_delimitador': values.tipo_delimitador,
                    'conteudo': values.conteudo
                };
                await patchAlterarArquivoDeCarga(values.uuid, payload);
                console.log("Arquivo de carga alterado com sucesso");
                setShowModalForm(false);
                setInfoModalArquivosDeCarga('Arquivo de carga alterado com sucesso');
                await carregaArquivosPeloTipoDeCarga();
                setShowModalInfoArquivosDeCarga(true);
            }catch (e) {
                console.log("Erro ao alterar Arquivo de carga ", e.response.data);
                setInfoModalArquivosDeCarga('Erro ao criar Arquivo de carga');
                setShowModalInfoArquivosDeCarga(true);
                if (e.response.data.identificador[0]){
                    setInfoModalArquivosDeCarga(e.response.data.identificador[0]);
                    setShowModalInfoArquivosDeCarga(true);
                }
            }
        }
    };

    const onDeleteArquivoDeCargaTrue = async ()=>{
        try {
            await deleteTag(stateFormModal.uuid);
            console.log("Arquivo de Carga excluído com sucesso");
            setShowModalConfirmDeleteArquivosDeCarga(false);
            setShowModalForm(false);
            await carregaArquivosPeloTipoDeCarga();
        }catch (e) {
            console.log("Erro ao excluir Arquivo de carga ", e.response.data);
            setInfoModalArquivosDeCarga('Erro ao excluir Arquivo de carga');
            setShowModalInfoArquivosDeCarga(true);
            if (e.response.data.identificador[0]){
                setInfoModalArquivosDeCarga(e.response.data.identificador[0]);
                setShowModalInfoArquivosDeCarga(true);
            }
        }
    };

    const handleCloseFormModal = () => {
        setShowModalForm(false)
    };

    const handleCloseModalInfoArquivosDeCarga = useCallback(() => {
        setShowModalInfoArquivosDeCarga(false);
    }, []);

    const handleCloseConfirmDeleteArquivoDeCarga = useCallback(()=>{
        setShowModalConfirmDeleteArquivosDeCarga(false)
    }, []);


    return (
        <PaginasContainer>
            <>
                {!dadosDeOrigem.acesso_permitido ? (
                        <Redirect
                            to={{
                                pathname: '/painel-parametrizacoes',
                            }}
                        />
                    ) :
                    <>
                        <h1 className="titulo-itens-painel mt-5">{dadosDeOrigem.titulo}</h1>
                        <div className="page-content-inner">
                            <MenuInterno
                                caminhos_menu_interno={dadosDeOrigem.UrlsMenuInterno}
                            />
                            <BotoesTopo
                                setShowModalForm={setShowModalForm}
                                setStateFormModal={setStateFormModal}
                                initialStateFormModal={initialStateFormModal}
                            />
                            <Filtros
                                stateFiltros={stateFiltros}
                                handleChangeFiltros={handleChangeFiltros}
                                handleSubmitFiltros={handleSubmitFiltros}
                                limpaFiltros={limpaFiltros}
                                tabelaArquivos={tabelaArquivos}
                            />
                            <p>Exibindo <span className='total-acoes'>{totalDeArquivos}</span> cargas de arquivo</p>
                            <TabelaArquivosDeCarga
                                arquivos={arquivos}
                                rowsPerPage={rowsPerPage}
                                conteudoTemplate={conteudoTemplate}
                                dataTemplate={dataTemplate}
                                dataHoraTemplate={dataHoraTemplate}
                                statusTemplate={statusTemplate}
                                acoesTemplate={acoesTemplate}
                            />
                        </div>
                    </>
                }
                <section>
                    <ModalFormArquivosDeCarga
                        show={showModalForm}
                        stateFormModal={stateFormModal}
                        tabelaArquivos={tabelaArquivos}
                        statusTemplate={statusTemplate}
                        handleClose={handleCloseFormModal}
                        handleSubmitModalForm={handleSubmitModalForm}
                    />
                </section>
                <section>
                    <ModalInfoArquivoDeCargas
                        show={showModalInfoArquivosDeCarga}
                        handleClose={handleCloseModalInfoArquivosDeCarga}
                        titulo='Arquivos de Carga'
                        texto={`<p class="mb-0"> ${infoModalArquivosDeCarga}</p>`}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
                <section>
                    <ModalConfirmDeleteArquivoDeCarga
                        show={showModalConfirmDeleteArquivosDeCarga}
                        handleClose={handleCloseConfirmDeleteArquivoDeCarga}
                        onDeleteArquivoDeCargaTrue={onDeleteArquivoDeCargaTrue}
                        titulo="Excluir Arquivo de Carga"
                        texto="<p>Deseja realmente excluir este Arquivo de Carga?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
                    />
                </section>
            </>
        </PaginasContainer>
    );
};

export default memo(ArquivosDeCarga)

