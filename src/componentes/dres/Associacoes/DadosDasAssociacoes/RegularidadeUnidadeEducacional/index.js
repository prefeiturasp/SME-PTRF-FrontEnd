import React, {useState, useEffect, useCallback} from "react";
import {Accordion, Card, Button, Form} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronUp, faChevronDown, faExclamationTriangle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {verificacaoRegularidade, salvarItensRegularidade} from "../../../../../services/dres/RegularidadeUnidadeEducaional.service";
import {ModalConfirmaSalvar} from "../../../../../utils/Modais";
import {visoesService} from "../../../../../services/visoes.service";
import MotivoNaoRegularidade from "./MotivoNaoRegularidade";
import {ModalConfirmaApagarMotivoNaoRegularidade,} from "./ModalConfirmarApagarMotivoNaoRegularidade";

export const RegularidadeUnidadeEducacional = ({dadosDaAssociacao}) => {

    const [dadosRegularidade, setDadosRegularidade] = useState({});
    const [checklists, setChecklists] = useState({});
    const [statusChecklist, setStatusChecklists] = useState({});
    const [dicionarioDeItens, setDicionarioDeItens] = useState({});
    const [expandir, setExpandir] = useState({});
    const [showSalvar, setShowSalvar] = useState(false);
    const [showModalConfirmaApagarMotivoNaoRegularidade, setShowModalConfirmaApagarMotivoNaoRegularidade] = useState(false);
    const [arrayStatus, setArrayStatus] = useState([]);
    const [exibeCampoMotivoNaoRegularidade, setExibeCampoMotivoNaoRegularidade] = useState(false);
    const [campoMotivoNaoRegularidade, setCampoMotivoNaoRegularidade] = useState('');
    const [objSalvarItemVerificacao, setObjSalvarItemVerificacao] = useState({})


    const checaSeExibeMotivoNaoRegularidade = useCallback(() => {
        let exibeMotivo;
        if (arrayStatus && arrayStatus.length > 0) {
            exibeMotivo = arrayStatus.find(element => element === 'Pendente')
        }else {
            exibeMotivo = false
        }
        setExibeCampoMotivoNaoRegularidade(exibeMotivo)
        return exibeMotivo
    }, [arrayStatus])

    useEffect(() => {
        checaSeExibeMotivoNaoRegularidade()
    }, [checaSeExibeMotivoNaoRegularidade])


    const buscaDadosRegularidade = useCallback(async () => {
        try {
            let dados = await verificacaoRegularidade(dadosDaAssociacao.dados_da_associacao.uuid)
            setDadosRegularidade(dados);
            setCampoMotivoNaoRegularidade(dados.motivo_nao_regularidade)
            let dicionarioItensListaVerificacao = {}
            let dicionarioItens = {}
            let status = {}
            let expande = {}
            dados.verificacao_regularidade.grupos_verificacao.map(grupo => {
                grupo.listas_verificacao.map(itemLista => {
                    dicionarioItensListaVerificacao[itemLista.uuid] = itemLista.itens_verificacao
                    status[itemLista.uuid] = itemLista.status_lista_verificacao
                    expande[itemLista.uuid] = false
                    itemLista.itens_verificacao.map(item => {
                        dicionarioItens[item.uuid] = item
                    })
                })
            })
            setChecklists(dicionarioItensListaVerificacao);
            setDicionarioDeItens(dicionarioItens);
            setArrayStatus(Object.values(status))
            setStatusChecklists(status);
        }catch (e) {
            console.log('Erro ao buscar verificacao regularidade ', e.response)
        }

    }, [dadosDaAssociacao]) ;

    useEffect(() => {
            buscaDadosRegularidade();
        },
        [buscaDadosRegularidade]);

    const montaGrupo = (grupo, index) => {
        return (
            <div className="mt-3" key={index}>
                <div style={{margin: "2px 0px 20px 0px", fontWeight: 'bold'}}>
                    {grupo.titulo}
                </div>
                <Accordion>
                    {montaListaVerificacao(grupo.listas_verificacao)}
                </Accordion>
            </div>
        )
    }

    const selecionarTodos = (lista_verificacao, e) => {
        let itensGrupo = checklists

        var d = {...dicionarioDeItens}
        var itens = itensGrupo[lista_verificacao.uuid].map(item => {
            var i = {...item}
            i.regular = e.target.checked === true ? true : false
            d[item.uuid] = i
            return i
        })

        let status = {...statusChecklist}
        status[lista_verificacao.uuid] = e.target.checked === true ? 'Regular' : 'Pendente';
        itensGrupo[lista_verificacao.uuid] = itens
        setChecklists(itensGrupo);
        setDicionarioDeItens(d);
        setArrayStatus(Object.values(status))
        setStatusChecklists(status);
    }

    const selecionarItem = (lista_verificacao, item) => {
        let itensGrupo = checklists

        let itens = itensGrupo[lista_verificacao.uuid].map(i => {
            if (i.uuid === item.uuid) {
                i.regular = !i.regular
            }
            return i
        })
        itensGrupo[lista_verificacao.uuid] = itens

        setChecklists(itensGrupo);

        var d = {...dicionarioDeItens}
        d[item.uuid] = item
        setDicionarioDeItens(d);

        const estaRegular = itens.every((item, index, array) => {
            return item.regular
        });
        let status = {...statusChecklist}
        status[lista_verificacao.uuid] = estaRegular === true ? 'Regular' : 'Pendente';
        setArrayStatus(Object.values(status))
        setStatusChecklists(status);
    }

    const salvarItemVerificacao = useCallback(async (lista_verificacao) => {
        setShowModalConfirmaApagarMotivoNaoRegularidade(false)
        var itens = checklists[lista_verificacao.uuid].map(item => {
            return {uuid: item.uuid, regular: item.regular}
        })
        const payload = {
            itens: itens,
            motivo_nao_regularidade: campoMotivoNaoRegularidade
        }
        try {
            await salvarItensRegularidade(dadosDaAssociacao.dados_da_associacao.uuid, payload)
            console.log("OK, Salvo com sucesso");
            setShowSalvar(true);
            await buscaDadosRegularidade()
        }catch (e) {
            console.log("Erro ao salvar item verificação ", e.response);
        }

    }, [dadosDaAssociacao, checklists, campoMotivoNaoRegularidade, buscaDadosRegularidade])

    const onClickCancelModalApagarCampoRegularidade = async () =>{
        setShowModalConfirmaApagarMotivoNaoRegularidade(false)
        await buscaDadosRegularidade()
    }

    const onClickSalvarSalvarItemVerificacaoTrue = async () =>{
        await salvarItemVerificacao(objSalvarItemVerificacao)
    }

    const checaSeExibeModalApagarCampoRegularidade = useCallback(async (obj)=>{
        setObjSalvarItemVerificacao(obj)
        if (!checaSeExibeMotivoNaoRegularidade() && campoMotivoNaoRegularidade){
            setShowModalConfirmaApagarMotivoNaoRegularidade(true)
        }else {
            setShowModalConfirmaApagarMotivoNaoRegularidade(false)
            await salvarItemVerificacao(obj)
        }
    }, [campoMotivoNaoRegularidade, checaSeExibeMotivoNaoRegularidade, salvarItemVerificacao])


    const montaListaVerificacao = (listaVerificacao) => {
        const podeSalvar = [['change_regularidade']].some(visoesService.getPermissoes)

        return (
            listaVerificacao.map((obj, index) => (
                <Card key={index}>
                    <Accordion.Toggle as={Card.Header} variant="link" eventKey={index} onClick={e => handleExpandir(obj.uuid)}>
                        <div className="row">
                            <div className="col-9">
                                <span style={{fontSize: '17px', color: '#00585e'}}>{obj.titulo}</span>
                            </div>
                            <div className="col-2">
                                <FontAwesomeIcon
                                    style={{
                                        fontSize: '17px',
                                        marginRight: "0",
                                        paddingRight: "4px",
                                        color: statusChecklist[obj.uuid] === 'Pendente' ? '#cc5104' : 'green'
                                    }}
                                    icon={statusChecklist[obj.uuid] === 'Pendente' ? faExclamationTriangle : faCheckCircle}
                                />
                                <span style={{marginRight: "0", fontSize: '17px'}}>{statusChecklist[obj.uuid]}</span>
                            </div>
                            <div className="col-1" style={{paddingLeft: "0px"}}>
                                <span style={{
                                    backgroundColor: "#c7c9c8",
                                    borderRadius: '67px',
                                    border: 'solid 1px #c7c9c8',
                                    padding: '4px 7px'
                                }}>
                                <FontAwesomeIcon
                                    style={{marginRight: "0", color: 'black'}}
                                    icon={expandir[obj.uuid] === true ? faChevronUp : faChevronDown}
                                />
                                </span>
                            </div>
                        </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={index}>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="formBasicCheckbox">
                                    <div className="row">
                                        <div className="col-10">
                                            <Form.Check
                                                type="checkbox"
                                                label="Selecionar todos"
                                                key={index} onChange={e => selecionarTodos(obj, e)}
                                                disabled={!podeSalvar}
                                            />
                                        </div>
                                        <div
                                            className="col-2"
                                            style={
                                                {visibility: podeSalvar ? "visible" : "hidden"}
                                            }
                                        >
                                            <Button
                                                variant="success"
                                                className="btn btn-sucess"
                                                onClick={e => checaSeExibeModalApagarCampoRegularidade(obj)}
                                            >
                                                Salvar
                                            </Button>
                                            <ModalConfirmaApagarMotivoNaoRegularidade
                                                show={showModalConfirmaApagarMotivoNaoRegularidade}
                                                handleClose={() => setShowModalConfirmaApagarMotivoNaoRegularidade(false)}
                                                titulo="Tornar Regular"
                                                texto='Ao tornar "Regular" a Associação, o campo "Motivo de não regularidade da Associação" será apagado. Você confirma a regularidade da Associação?'
                                                primeiroBotaoTexto='Cancelar'
                                                primeiroBotaoCss="outline-success"
                                                primeiroBotaoOnclick={onClickCancelModalApagarCampoRegularidade}
                                                segundoBotaoOnclick={() => {
                                                    setObjSalvarItemVerificacao(obj)
                                                    onClickSalvarSalvarItemVerificacaoTrue()
                                                }}
                                                segundoBotaoCss='success'
                                                segundoBotaoTexto='Confirmar'
                                            />
                                        </div>
                                    </div>

                                    {montaItens(obj, podeSalvar)}
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            ))
        )
    }

    const montaItens = (ListaVerificacao, podeSalvar) => {
        return (
            checklists[ListaVerificacao.uuid] !== undefined
                ? checklists[ListaVerificacao.uuid].map((obj, index) => (
                    <Form.Check
                        type="checkbox"
                        checked={dicionarioDeItens[obj.uuid] !== undefined ? dicionarioDeItens[obj.uuid].regular : false}
                        label={obj.descricao}
                        key={index}
                        onChange={e => selecionarItem(ListaVerificacao, obj)}
                        disabled={!podeSalvar}
                    />
                )) : null
        )
    }

    const handleExpandir = (uuid) => {
        let expand = {...expandir};
        for (var prop in expand) {
            if (uuid !== prop) {
                expand[prop] = false
            }
        }

        expand[uuid] = !expand[uuid];
        setExpandir(expand);
    }

    return (
        <>
            <div className="row">
                <div className="d-flex bd-highlight">
                    <div className="flex-grow-1 bd-highlight">
                        <p className="mb-1 ml-2 titulo-explicativo-dre-detalhes">Regularidade da associação</p>
                    </div>

                </div>
            </div>

            {dadosRegularidade !== {} && dadosRegularidade.verificacao_regularidade !== undefined ? (
                dadosRegularidade.verificacao_regularidade.grupos_verificacao.map((grupo, index) => (
                    montaGrupo(grupo, index)
                ))
            ) : null}

            <MotivoNaoRegularidade
                exibeCampoMotivoNaoRegularidade={exibeCampoMotivoNaoRegularidade}
                campoMotivoNaoRegularidade={campoMotivoNaoRegularidade}
                setCampoMotivoNaoRegularidade={setCampoMotivoNaoRegularidade}
            />
            <ModalConfirmaSalvar
                show={showSalvar}
                handleClose={() => setShowSalvar(false)}
                titulo="Itens salvos!"
                texto="Os dados foram salvos com sucesso."
                primeiroBotaoCss="success"
            />
        </>
    );
};