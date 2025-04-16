import React, {useEffect, useState} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import "../../../../../Globais/ModalBootstrap/modal-bootstrap.scss"
import Img404 from "../../../../../../assets/img/img-404.svg";
import Loading from "../../../../../../utils/Loading";
import {Filtros} from "./FormFiltros";
import {Button} from "antd";
import {MsgImgCentralizada} from  "../../../../../Globais/Mensagens/MsgImgCentralizada";
import {MsgImgLadoDireito} from "../../../../../Globais/Mensagens/MsgImgLadoDireito";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faPlus, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalDesvincularLote} from "./Modais";
import {Link, useParams} from 'react-router-dom';
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {getUnidadesPorAcao, getAcao, deleteAcoesAssociacoesEmLote, deleteAcaoAssociacao} from "../../../../../../services/sme/Parametrizacoes.service"
import {ModalConfirmDesvincularAcaoAssociacao} from "./ModalConfirmDesvincularAcaoAssociacao"
import { TabelaAssociacaoAcao } from "../TabelaAssociacaoAcao";
import { getTabelaAssociacoes } from "../../../../../../services/dres/Associacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";// Preparação para react-router-dom-v6
import {useNavigate} from "react-router-dom-v5-compat";
import {toastCustom} from "../../../../../Globais/ToastCustom";
import "./associacoes.scss";

export const AssociacoesDaAcao = () => {
    const navigate = useNavigate();

    const rowsPerPage = 10;
    let {acao_uuid} = useParams();

    const estadoInicialFiltros = {
        filtrar_por_nome: "",
        filtro_informacoes: []
    };
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const [loading, setLoading] = useState(true);
    const [acao, setAcao] = useState(null);
    const [acaoAssociacaoUuid, setAcaoAssociacaoUuid] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [estadoFiltros, setEstadoFiltros] = useState(estadoInicialFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [showModalDesvincular, setShowModalDesvincular] = useState(false);
    const [showConfirmaDesvinculo, setShowConfirmaDesvinculo] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [firstPage, setFirstPage] = useState(1);

    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});

    useEffect(() => {
        buscaUnidadesDaAcao(acao_uuid).then(() => setLoading(false));
    }, []);

    const buscaUnidadesDaAcao = async (acaoUuid, pagina = 1) => {
        if (acaoUuid){
            let acao = await getAcao(acaoUuid)
            setAcao(acao);

            let _tabelaAssociacoes = await getTabelaAssociacoes();
            setTabelaAssociacoes(_tabelaAssociacoes);

            let acoesAssociacoes = await getUnidadesPorAcao(acaoUuid, pagina);
            setUnidades(acoesAssociacoes);

            console.log(acoesAssociacoes)

            setQuantidadeSelecionada(0);
        }
    }

    const onPageChange = async (event) => {
        setLoading(true)
        setCurrentPage(event.page + 1)
        setFirstPage(event.first)

        let resultado_filtros = await getUnidadesPorAcao(acao_uuid, event.page + 1, estadoFiltros.filtrar_por_nome, estadoFiltros.filtro_informacoes);
    
        let unis = resultado_filtros.results.map(obj => {
            return {
                ...obj,
                selecionado: false
            }
        });

        setUnidades({
            results: unis,
            count: resultado_filtros.count,
            next: resultado_filtros.next,
            previous: resultado_filtros.previous
        })
        setLoading(false)
    };

    const mudancasFiltros = (name, value) => {
        setEstadoFiltros({
            ...estadoFiltros,
            [name]: value
        });
    };

    const aplicaFiltrosUnidades = async (event, pagina = 1)=>{
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        if (event) {
            event.preventDefault();
        }
        let resultado_filtros = await getUnidadesPorAcao(acao_uuid, pagina, estadoFiltros.filtrar_por_nome, estadoFiltros.filtro_informacoes);
    
        let unis = resultado_filtros.results.map(obj => {
            return {
                ...obj,
                selecionado: false
            }
        });

        setUnidades({
            results: unis,
            count: resultado_filtros.count,
            next: resultado_filtros.next,
            previous: resultado_filtros.previous
        })
        setLoading(false)
    };

    const limparFiltros = async () => {
        setLoading(true);
        setEstadoFiltros(estadoInicialFiltros);
        await buscaUnidadesDaAcao(acao_uuid);
        setLoading(false);
    };

    const atualizaListaUnidades = async () => {
        setLoading(true);
        if (buscaUtilizandoFiltros) {
            await aplicaFiltrosUnidades()
        }
        else {
            await buscaUnidadesDaAcao(acao_uuid)
        }
        setLoading(false);
    };

    const selecionarTodos = (event) => {
        event.preventDefault();
        let result = unidades.results.reduce((acc, o) => {

            let obj = Object.assign(o, { selecionado: true }) ;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setUnidades((prevUnidades) => ({
            ...prevUnidades,
            results: result,
        }));
        setQuantidadeSelecionada(unidades.results.length);
    }

    const desmarcarTodos = (event) => {
        event.preventDefault();
        let result = unidades.results.reduce((acc, o) => {

            let obj = Object.assign(o, { selecionado: false }) ;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setUnidades((prevUnidades) => ({
            ...prevUnidades,
            results: result,
        }));
        setQuantidadeSelecionada(0);
    };


    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={unidades.results.filter(u => u.uuid === rowData.uuid)[0].selecionado}
                    type="checkbox"
                    value=""
                    onChange={(e) => tratarSelecionado(e, rowData.uuid)}
                    name="checkAtribuido"
                    id="checkAtribuido"
                />
            </div>
        )
    }

    const selecionarHeader = () => {
        return (
            <div className="align-middle text-center">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
              <input
                    checked={false}
                    type="checkbox"
                    value=""
                    onChange={(e) => e.stopPropagation(e)}
                    name="checkHeader"
                    id="checkHeader"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={(e) => selecionarTodos(e)}>Selecionar todos</Dropdown.Item>
                <Dropdown.Item onClick={(e) => desmarcarTodos(e)}>Desmarcar todos</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            </div>
        )
    }

    const tratarSelecionado = (e, unidadeUuid) => {
        let cont = quantidadeSelecionada;
        if (e.target.checked) {
            cont = cont + 1
        } else {
            cont = cont - 1
        }
        setQuantidadeSelecionada(cont);
        let result2 = unidades.results.reduce((acc, o) => {

            let obj = unidadeUuid === o.uuid ? Object.assign(o, { selecionado: e.target.checked }) : o;
        
            acc.push(obj);
        
            return acc;
        
        }, []);
        setUnidades((prevUnidades) => ({
            ...prevUnidades,
            results: result2,
        }));
    }

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding:"15px 0px", margin:"0px 15px", flex:"100%"}}>
                    Exibindo <span style={{color: "#00585E", fontWeight:"bold"}}>{unidades.count}</span> unidades
                </div>
            </div>
        )
    }

    const montagemDesvincularLote = () => {
        const disabled = !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES;

        return (
            <div className="row">
                <div className="col-12" style={{background: "#00585E", color: 'white', padding:"15px", margin:"0px 15px", flex:"100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "unidade selecionada" : "unidades selecionadas"}  / {unidades.results.length} totais
                        </div>
                        <div className="col-7">
                            <div className="d-flex align-items-center justify-content-end">
                                <Button 
                                    type='link'
                                    style={{textDecoration:"underline", color: disabled ? "grey" : "white"}}
                                    onClick={() => handleDesvincularAssociacoesEmLote()}
                                    icon={
                                        <FontAwesomeIcon
                                            style={{
                                                fontSize: '15px', 
                                                marginRight: 2, 
                                                color: disabled ? "grey" : "white"
                                            }}
                                            icon={faTimesCircle}
                                        />
                                    }
                                    disabled={disabled} 
                                >
                                    <strong>Desvincular da ação</strong>            
                                </Button>
                                <div className="float-right">|</div>
                                <Button 
                                    type='link'
                                    color="secondary"
                                    style={{textDecoration:"underline", color:"#fff"}}
                                    onClick={(e) => desmarcarTodos(e)}
                                >
                                    <strong>Cancelar</strong>            
                                </Button>                                    
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const modalDesvincular = () => {
        setShowModalDesvincular(true);
    }

    const onHide = () => {
        setShowModalDesvincular(false);

    }
    const acoesTemplate = (rowData) => {
        const disabled = rowData.associacao.encerrada || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES
        return (
            <div>
                <Button 
                    type="text" 
                    className={`${disabled ? '': 'link-red'}`}
                    onClick={() => disabled ? null : handleDesvinculaUE(rowData['uuid'])}
                    icon={
                        <FontAwesomeIcon
                            style={{
                                fontSize: '20px', 
                                marginRight: 3, 
                                color: disabled ? "grey" : "#B40C02"
                            }}
                            icon={faTimesCircle}
                        />
                    }
                    disabled={disabled} 
                >
                    Desvincular                
                </Button>
            </div>
        )
    };

    const handleDesvinculaUE = (acaoAssociacaoUuid) => {
        setAcaoAssociacaoUuid(acaoAssociacaoUuid)
        setShowConfirmaDesvinculo(true);
    };

    const handleCloseDesvinculaAssociacao = () => {
        setShowConfirmaDesvinculo(false)
    };

    const onDesvinculaAssociacaoTrue = async () => {
        setShowConfirmaDesvinculo(false);
        try {
            await deleteAcaoAssociacao(acaoAssociacaoUuid);
            toastCustom.ToastCustomSuccess("Associação desvinculada com sucesso!");
            await atualizaListaUnidades();
        } catch (e) {
            toastCustom.ToastCustomError('Erro ao desvincular associação.', e.response && e.response.data && e.response.data.mensagem ? e.response.data.mensagem : '');
        }
        setAcaoAssociacaoUuid(null);
    };

    const handleDesvincularAssociacoesEmLote = () => {
        let associacoesEncerradasSelecionadas = unidades.results.filter(u => u.selecionado === true && u.associacao.encerrada);
        if(associacoesEncerradasSelecionadas.length > 0) {
            toastCustom.ToastCustomError('Ação não permitida', 'Existem uma ou mais associações encerradas selecionadas.')
        } else {
            modalDesvincular();
        }
    };

    const desvincularAssociacoesEmLote = async () => {
        setShowModalDesvincular(false);
        setLoading(true);
        let payLoad = {
            lista_uuids: []
        };

        let uuids = unidades.results.filter(u => u.selecionado === true).map(item => {return item.uuid});

        payLoad.lista_uuids = uuids;

        try {
            const response = await deleteAcoesAssociacoesEmLote(payLoad);
            toastCustom.ToastCustomSuccess("Associações desvinculadas com sucesso!", response.mensagem ? response.mensagem : '')
        } catch(e) {
            toastCustom.ToastCustomError('Erro ao tentar desvincular associações', e.response && e.response.mensagem ? e.response.mensagem : '')
        }

        await atualizaListaUnidades();
        setLoading(false);
        setQuantidadeSelecionada(0);
    };

    const handleOnChangeMultipleSelectStatus =  async (value) => {
        let name = "filtro_informacoes"

        setEstadoFiltros({
            ...estadoFiltros,
            [name]: value
        });
    };

    const goTo = (url) => {
        navigate(url);
    };

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Unidades vinculadas à ação {acao ? acao.nome : ""}</h1>
            <div className="page-content-inner">
                {loading ? (
                        <div className="mt-5">
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="d-flex  justify-content-end mt-n2">
                                <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                                    <Link
                                        to='/parametro-acoes'
                                        className="btn btn-outline-success ml-2"
                                    >
                                        <FontAwesomeIcon
                                            style={{marginRight: "5px"}}
                                            icon={faArrowLeft}
                                        />
                                        Voltar para lista de Ações
                                    </Link>
                                </div>
                                <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                                    <button 
                                        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                                        onClick={() => goTo(`/vincula-associacoes-a-acao/${acao_uuid}`)}
                                        type="button" 
                                        className="btn btn-success ml-2"
                                    >
                                        <FontAwesomeIcon
                                            style={{marginRight: "5px", color: '#fff'}}
                                            icon={faPlus}
                                        />
                                        Vincular Associações
                                    </button>                                     
                                </div>
                            </div>
                            <div className="page-content-inner">
                                <Filtros
                                    estadoFiltros={estadoFiltros}
                                    tabelaAssociacoes={tabelaAssociacoes}
                                    mudancasFiltros={mudancasFiltros}
                                    enviarFiltrosAssociacao={aplicaFiltrosUnidades}
                                    limparFiltros={limparFiltros}
                                    handleOnChangeMultipleSelectStatus={handleOnChangeMultipleSelectStatus}
                                />
                                <ModalDesvincularLote
                                    show={showModalDesvincular}
                                    onHide={onHide}
                                    titulo="Desvincular unidades da ação"
                                    quantidadeSelecionada={quantidadeSelecionada}
                                    primeiroBotaoOnclick={desvincularAssociacoesEmLote}
                                    primeiroBotaoTexto="OK"
                                />

                                {quantidadeSelecionada > 0 ?
                                    (montagemDesvincularLote()) :
                                    (mensagemQuantidadeExibida())
                                }
                                <div className="row">
                                    <div className="col-12">
                                        {unidades.results.length > 0 ? (
                                            <>
                                            <TabelaAssociacaoAcao
                                                unidades={unidades}
                                                rowsPerPage={rowsPerPage}
                                                selecionarHeader={selecionarHeader}
                                                selecionarTemplate={selecionarTemplate}
                                                acoesTemplate={acoesTemplate}
                                                caminhoUnidade="associacao.unidade"
                                                onPageChange={onPageChange}
                                                firstPage={firstPage}
                                            />                                            
                                            </>
                                        ) : buscaUtilizandoFiltros ?
                                            <MsgImgCentralizada
                                                texto='Não encontramos unidades que atendam aos filtros informados.'
                                                img={Img404}
                                            />
                                            :
                                            <MsgImgLadoDireito
                                                texto='Não há nenhuma unidade vinculada a essa ação'
                                                img={Img404}
                                            />}
                                    </div>
                                </div>
                            </div>
                        </>)
                }
                <section>
                    <ModalConfirmDesvincularAcaoAssociacao
                        show={showConfirmaDesvinculo}
                        handleClose={handleCloseDesvinculaAssociacao}
                        onDeleteAcaoTrue={onDesvinculaAssociacaoTrue}
                        titulo="Desvincular associação da ação"
                        texto="<p>Deseja realmente desvincular essa associação da ação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Desvincular"
                    />
                </section>              
            </div>
        </PaginasContainer>

    )
}
