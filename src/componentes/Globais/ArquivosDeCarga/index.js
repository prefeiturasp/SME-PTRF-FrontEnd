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
    deleteArquivoDeCarga,
    getDownloadArquivoDeCarga,
    postProcessarArquivoDeCarga,
    getDownloadModeloArquivoDeCarga,
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
    const [clickProcessar, setClickProcessar] = useState(false);

    useEffect(() => {
        if (arquivos && arquivos.length > 0 && arquivos.filter(arquivo=> arquivo.status === 'PROCESSANDO' ).length > 0){
            const timer = setInterval(() => {
                carregaArquivosPeloTipoDeCarga();
            }, 5000);
            // clearing interval
            return () => clearInterval(timer);
        }
    });


    const carregaTabelaArquivos = useCallback(async () => {
        if (dadosDeOrigem.acesso_permitido) {
            let tabela = await getTabelaArquivosDeCarga();
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

    const conteudoTemplate = (rowData) => {
        return (
            <div className='quebra-palavra'>
                {rowData.conteudo.split('/').pop()}
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
        valida_conteudo: true,
        nome_arquivo: '',
        uuid: "",
        id: "",
        log: "",
        operacao: 'create',
    };
    const [showModalForm, setShowModalForm] = useState(false);
    const [stateFormModal, setStateFormModal] = useState(initialStateFormModal);
    const [showModalInfoArquivosDeCarga, setShowModalInfoArquivosDeCarga] = useState(false);
    const [showModalConfirmDeleteArquivosDeCarga, setShowModalConfirmDeleteArquivosDeCarga] = useState(false);
    const [infoModalArquivosDeCarga, setInfoModalArquivosDeCarga] = useState('');

    const handleClickEditarArquivos = useCallback(async (rowData) => {
        setShowModalForm(true);
        setStateFormModal({
            ...stateFormModal,
            identificador: rowData.identificador,
            tipo_carga: rowData.tipo_carga,
            tipo_delimitador: rowData.tipo_delimitador,
            ultima_execucao: rowData.ultima_execucao ? moment(rowData.ultima_execucao).format('DD/MM/YYYY') : '-',
            status: rowData.status,
            conteudo: '',
            valida_conteudo: false,
            nome_arquivo: rowData.conteudo,
            uuid: rowData.uuid,
            id: rowData.id,
            log: rowData.log,
            operacao: 'edit',
            }
        )
    }, [stateFormModal]);

    const handleClickDeleteArquivoDeCarga = useCallback((uuid_arquivo_de_carga)=>{
        setStateFormModal({
            ...stateFormModal,
            uuid: uuid_arquivo_de_carga,
        });
        setShowModalConfirmDeleteArquivosDeCarga(true);
    }, [stateFormModal]);

    const handleClickDownloadArquivoDeCarga = useCallback(async (rowData)=>{
        let nome_do_arquivo_com_extensao = conteudoTemplate(rowData).props.children;
        try {
            await getDownloadArquivoDeCarga(rowData.uuid, nome_do_arquivo_com_extensao);
            console.log("Download efetuado com sucesso");
        }catch (e) {
            console.log("Erro ao efetuar o download ", e.response);
        }
    }, []);

    const handleClickProcessarArquivoDeCarga = useCallback(async (rowData)=>{
        try {
            await postProcessarArquivoDeCarga(rowData.uuid);
            console.log("Arquivo de Carga processado com sucesso");
            setClickProcessar(true);
            await carregaArquivosPeloTipoDeCarga()
        }catch (e) {
            console.log("Erro ao processar o Arquivo de Carga  ", e.response);
        }
        await carregaArquivosPeloTipoDeCarga()
    }, [carregaArquivosPeloTipoDeCarga]);

    const handleClickDownloadModeloArquivoDeCarga = useCallback(async ()=>{
        try {
            await getDownloadModeloArquivoDeCarga(url_params.tipo_de_carga);
            console.log("Download do modelo efetuado com sucesso");
        }catch (e) {
            console.log("Erro ao fazer o download do modelo ", e.response);
        }
    }, [url_params.tipo_de_carga]);

    const acoesTemplate = useCallback((rowData) => {
        return (
            <div className="dropdown">
                <span id="linkDropdownAcoes" role="button" data-toggle="dropdown" aria-haspopup="true"
                   aria-expanded="false">
                    <button className="btn-acoes"><span className="btn-acoes-dots">...</span></button>
                </span>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <button onClick={()=>handleClickProcessarArquivoDeCarga(rowData)} className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                            icon={faCogs}
                        />
                        <strong>Processar</strong>
                    </button>
                    <button onClick={() => handleClickEditarArquivos(rowData)} className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                            icon={faEdit}
                        />
                        <strong>Editar</strong>
                    </button>
                    <button onClick={()=>handleClickDownloadArquivoDeCarga(rowData)} className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#00585E"}}
                            icon={faDownload}
                        />
                        <strong>Baixar</strong>
                    </button>
                    <button onClick={()=>handleClickDeleteArquivoDeCarga(rowData.uuid)} className="btn btn-link dropdown-item fonte-14" type="button">
                        <FontAwesomeIcon
                            style={{fontSize: '15px', marginRight: "5px", color: "#B40C02"}}
                            icon={faTrashAlt}
                        />
                        <strong>Excluir</strong>
                    </button>
                </div>
            </div>
        )
    }, [handleClickDeleteArquivoDeCarga, handleClickDownloadArquivoDeCarga, handleClickEditarArquivos, handleClickProcessarArquivoDeCarga]);

    const handleSubmitModalForm = useCallback(async (values) => {
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
            let payload;
            if (values.conteudo){
                payload = {
                    'identificador': values.identificador,
                    'tipo_delimitador': values.tipo_delimitador,
                    'conteudo': values.conteudo
                };
            }else {
                payload = {
                    'identificador': values.identificador,
                    'tipo_delimitador': values.tipo_delimitador,
                };
            }
            try {
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
    }, [carregaArquivosPeloTipoDeCarga, url_params]);

    const onDeleteArquivoDeCargaTrue = async ()=>{
        try {
            await deleteArquivoDeCarga(stateFormModal.uuid);
            console.log("Arquivo de Carga excluído com sucesso");
            setShowModalConfirmDeleteArquivosDeCarga(false);
            setShowModalForm(false);
            setInfoModalArquivosDeCarga('Arquivo de Carga excluído com sucesso');
            setShowModalInfoArquivosDeCarga(true);
            await carregaArquivosPeloTipoDeCarga();
        }catch (e) {
            console.log("Erro ao excluir Arquivo de carga ", e.response.data);
            setInfoModalArquivosDeCarga('Erro ao excluir Arquivo de carga');
            setShowModalInfoArquivosDeCarga(true);
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
                                handleClickDownloadModeloArquivoDeCarga={handleClickDownloadModeloArquivoDeCarga}
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

