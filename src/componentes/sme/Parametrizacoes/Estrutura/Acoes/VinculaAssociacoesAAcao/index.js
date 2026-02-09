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
import {faArrowLeft, faPlusCircle} from "@fortawesome/free-solid-svg-icons";
import {ModalVincularLote} from "./Modais";
import "./associacoes.scss";
import {Link, useParams} from 'react-router-dom';
import {PaginasContainer} from "../../../../../../paginas/PaginasContainer";
import {getAssociacoesNaoVinculadasAAcao, getAcao, postAddAcaoAssociacao, addAcoesAssociacoesEmLote} from "../../../../../../services/sme/Parametrizacoes.service"
import {ModalConfirmVincularAcaoAssociacao} from "./ModalConfirmVincularAcaoAssociacao"
import { TabelaAssociacaoAcaoNaoVinculadas } from "./TabelaAssociacaoAcaoNaoVinculadas";
import { getTabelaAssociacoes } from "../../../../../../services/dres/Associacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";// Preparação para react-router-dom-v6
import {toastCustom} from "../../../../../Globais/ToastCustom";

export const VinculaAssociacoesAAcao = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const rowsPerPage = 10;
    let {acao_uuid} = useParams();

    const estadoInicialFiltros = {
        filtrar_por_nome: "",
        filtro_informacoes: []
    };

    const [loading, setLoading] = useState(true);
    const [acao, setAcao] = useState(null);
    const [associacaoUuid, setAssociacaoUuid] = useState(null);
    const [unidades, setUnidades] = useState([]);
    const [estadoFiltros, setEstadoFiltros] = useState(estadoInicialFiltros);
    const [buscaUtilizandoFiltros, setBuscaUtilizandoFiltros] = useState(false);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(0);
    const [showModalVincular, setShowModalVincular] = useState(false);
    const [showConfirmaVinculo, setShowConfirmaVinculo] = useState(false);
    const [tabelaAssociacoes, setTabelaAssociacoes] = useState({});

    useEffect(() => {
        buscaUnidadesNaoVinculadasAAcao(acao_uuid).then(() => setLoading(false));
    }, []);

    const buscaUnidadesNaoVinculadasAAcao = async (acaoUuid) => {
        if (acaoUuid){
            let acao = await getAcao(acaoUuid)
            setAcao(acao);

            let _tabelaAssociacoes = await getTabelaAssociacoes();
            setTabelaAssociacoes(_tabelaAssociacoes);

            let associacoes = await getAssociacoesNaoVinculadasAAcao(acaoUuid);
            setUnidades(associacoes);

            setQuantidadeSelecionada(0);
        }
    }


    const mudancasFiltros = (name, value) => {
        setEstadoFiltros({
            ...estadoFiltros,
            [name]: value
        });
    };

    const aplicaFiltrosUnidades = async (event)=>{
        setLoading(true);
        setBuscaUtilizandoFiltros(true);
        if (event) {
            event.preventDefault();
        }

        let resultado_filtros = await getAssociacoesNaoVinculadasAAcao(acao_uuid, estadoFiltros.filtrar_por_nome, estadoFiltros.filtro_informacoes);

        let unis = resultado_filtros.map(obj => {
            return {
                ...obj,
                selecionado: false
            }
        });
        setUnidades(unis);
        setLoading(false)
    };

    const limparFiltros = async () => {
        setLoading(true);
        setEstadoFiltros(estadoInicialFiltros);
        await buscaUnidadesNaoVinculadasAAcao(acao_uuid);
        setLoading(false)
    };

    const atualizaListaUnidades = async () => {
        setLoading(true);
        if (buscaUtilizandoFiltros) {
            await aplicaFiltrosUnidades()
        }
        else {
            await buscaUnidadesNaoVinculadasAAcao(acao_uuid)
        }
        setLoading(false);
    };

    const selecionarTodos = (event) => {
        event.preventDefault();
        let result = unidades.reduce((acc, o) => {

            let obj = Object.assign(o, { selecionado: true }) ;

            acc.push(obj);

            return acc;

        }, []);
        setUnidades(result);
        setQuantidadeSelecionada(unidades.length);
    }

    const desmarcarTodos = (event) => {
        event.preventDefault();
        let result = unidades.reduce((acc, o) => {

            let obj = Object.assign(o, { selecionado: false }) ;

            acc.push(obj);

            return acc;

        }, []);
        setUnidades(result);
        setQuantidadeSelecionada(0);
    };


    const selecionarTemplate = (rowData) => {
        return (
            <div className="align-middle text-center">
                <input
                    checked={unidades.filter(u => u.uuid === rowData.uuid)[0].selecionado}
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
        let result2 = unidades.reduce((acc, o) => {

            let obj = unidadeUuid === o.uuid ? Object.assign(o, { selecionado: e.target.checked }) : o;

            acc.push(obj);

            return acc;

        }, []);
        setUnidades(result2);
    }

    const mensagemQuantidadeExibida = () => {
        return (
            <div className="row">
                <div className="col-12" style={{padding:"15px 0px", margin:"0px 15px", flex:"100%"}}>
                    Exibindo <span style={{color: "var(--color-primary-darker)", fontWeight:"bold"}}>{unidades.length}</span> unidades
                </div>
            </div>
        )
    }

    const montagemVincularLote = () => {
        const disabled = !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES;
        return (
            <div className="row">
                <div className="col-12" style={{background: "var(--color-primary-darker)", color: 'white', padding:"15px", margin:"0px 15px", flex:"100%"}}>
                    <div className="row">
                        <div className="col-5">
                            {quantidadeSelecionada} {quantidadeSelecionada === 1 ? "unidade selecionada" : "unidades selecionadas"}  / {unidades.length} totais
                        </div>
                        <div className="col-7">
                            <div className="d-flex align-items-center justify-content-end">
                                <Button 
                                    type='link'
                                    style={{textDecoration:"underline", color: disabled ? "grey" : "white"}}
                                    onClick={() => handleValidaAssociacoesEmLote()}
                                    icon={
                                        <FontAwesomeIcon
                                            style={{
                                                fontSize: '15px', 
                                                marginRight: 2, 
                                                color: disabled ? "grey" : "white"
                                            }}
                                            icon={faPlusCircle}
                                        />
                                    }
                                    disabled={disabled} 
                                >
                                    <strong>Vincular à ação</strong>            
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

    const modalVincular = () => {
        setShowModalVincular(true);
    }

    const onHide = () => {
        setShowModalVincular(false);

    }

    const acoesTemplate = (rowData) => {
        const disabled = rowData.encerrada || !TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES;
        return (
            <div>
                <Button 
                    type="text" 
                    className={`${disabled? '': 'link-green'}`}
                    onClick={() => disabled? null : handleVinculaUE(rowData['uuid'])}
                    icon={
                        <FontAwesomeIcon
                            style={{
                                fontSize: '20px', 
                                marginRight: 3, 
                                color: disabled? "grey" : ""
                            }}
                            icon={faPlusCircle}
                        />
                    }
                    disabled={disabled} 
                >
                    Vincular                
                </Button>                
            </div>
        )
    };

    const handleVinculaUE = (acaoAssociacaoUuid) => {
        setAssociacaoUuid(acaoAssociacaoUuid)
        setShowConfirmaVinculo(true);
    };

    const handleCloseVinculaAssociacao = () => {
        setShowConfirmaVinculo(false)
    };

    const onVinculaAssociacaoTrue = async () => {
        const payload = {
            associacao: associacaoUuid,
            acao: acao_uuid,
            status: 'ATIVA',
        };
        setShowConfirmaVinculo(false);
        try {
            await postAddAcaoAssociacao(payload)
            toastCustom.ToastCustomSuccess('Associação vinculada com sucesso')
            await atualizaListaUnidades()
        } catch (e) {
            toastCustom.ToastCustomError('Erro ao vincular associação')
        }
        setAssociacaoUuid(null);
    };

    const handleValidaAssociacoesEmLote = () => {
        let associacoesEncerradasSelecionadas = unidades.filter(u => u.selecionado === true && u.encerrada);
        if(associacoesEncerradasSelecionadas.length > 0) {
            toastCustom.ToastCustomError('Ação não permitida', 'Existem uma ou mais associações encerradas selecionadas.')
        } else {
            modalVincular();
        }
    };

    const vincularAssociacoesEmLote = async () => {
        setShowModalVincular(false);
        setLoading(true);
        let payLoad = {
            acao_uuid: acao_uuid,
            associacoes_uuids: []
        };

        let uuids = unidades.filter(u => u.selecionado === true).map(item => {return item.uuid});

        payLoad.associacoes_uuids = uuids;

        try {
            const response = await addAcoesAssociacoesEmLote(payLoad);
            toastCustom.ToastCustomSuccess('Associações vinculadas com sucesso!', response.mensagem ? response.mensagem : '')
        } catch(e) {
            toastCustom.ToastCustomError('Erro ao tentar vincular associações', e.response && e.response.mensagem ? e.response.mensagem : '');
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

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Vincula associações à ação {acao ? acao.nome : ""}</h1>
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
                    ) :

                    (
                        <>
                            <div className="p-2 bd-highlight pt-3 justify-content-end d-flex">
                                <Link
                                    to={`/associacoes-da-acao/${acao_uuid}`}
                                    className="btn btn-success ml-2"
                                >
                                    <FontAwesomeIcon
                                        style={{marginRight: "5px", color: '#fff'}}
                                        icon={faArrowLeft}
                                    />
                                    Voltar para lista de UE's vinculadas
                                </Link>
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
                                <ModalVincularLote
                                    show={showModalVincular}
                                    onHide={onHide}
                                    titulo="Vincular unidades à ação"
                                    quantidadeSelecionada={quantidadeSelecionada}
                                    primeiroBotaoOnclick={vincularAssociacoesEmLote}
                                    primeiroBotaoTexto="OK"
                                />

                                {quantidadeSelecionada > 0 ?
                                    (montagemVincularLote()) :
                                    (mensagemQuantidadeExibida())
                                }
                                <div className="row">
                                    <div className="col-12">
                                        {unidades.length > 0 ? (
                                            <TabelaAssociacaoAcaoNaoVinculadas
                                                unidades={unidades}
                                                rowsPerPage={rowsPerPage}
                                                autoLayout={true}
                                                selecionarHeader={selecionarHeader}
                                                selecionarTemplate={selecionarTemplate}
                                                acoesTemplate={acoesTemplate}
                                                caminhoUnidade="unidade"
                                            />                                             
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
                    <ModalConfirmVincularAcaoAssociacao
                        show={showConfirmaVinculo}
                        handleClose={handleCloseVinculaAssociacao}
                        onDeleteAcaoTrue={onVinculaAssociacaoTrue}
                        titulo="Vincular unidade à ação"
                        texto="<p>Deseja realmente vincular essa unidade à ação?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Vincular"
                    />
                </section>
            </div>
        </PaginasContainer>

    )
}
