import React, {memo, useCallback, useEffect, useState, useMemo} from "react";
import { FormikForm } from "./FormikForm";
import { ModalEditarDeletarComentario } from "./ModalEditarDeletarComentario";
import { ModalDeleteComentarioSme } from "./ModalDeletarComentario";
import { ModalNotificarComentarios } from "./ModalNotificarComentario";
import { ModalNotificacaoNaoEntregue } from "./ModalNotificacaoNaoEntregue";
import { 
    getComentariosDeAnaliseConsolidadoDre, 
    getReordenarComentariosConsolidadoDre,
    editarComentarioDeAnaliseConsolidadoDre,
    deleteComentarioDeAnalise,
    criarComentarioDeAnalise,
    postNotificarComentariosDre
} from "../../../../../services/sme/DashboardSme.service";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from "@fortawesome/free-solid-svg-icons";

import {
    DndContext,
    closestCenter,
    KeyboardSensor, 
    MouseSensor, 
    useSensor, 
    useSensors
  } from "@dnd-kit/core";
  import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable
  } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Comentarios = ({relatorioConsolidado, setHabilitaVerResumoComentariosNotificados}) => {
    // Comentários que NÃO foram notificados ainda e que podem ser alterados ou excluídos
    const [comentarios, setComentarios] = useState([]);
    // Comentários que JÁ foram notificados e que NÃO podem ser alterados ou excluídos
    const [comentariosNotificados, setComentariosNotificados] = useState([]);
    const [toggleExibeBtnAddComentario, setToggleExibeBtnAddComentario] = useState(true);
    const [showModalComentario, setShowModalComentario] = useState(false);
    const [showModalDeleteComentario, setShowModalDeleteComentario] = useState(false);
    const [showModalNotificarComentarios, setShowModalNotificarComentarios] = useState(false);
    const [comentarioEdicao, setComentarioEdicao] = useState(false);
    const [disabledBtnAddComentario, setDisabledBtnAddComentario] = useState(true);
    const [comentarioChecked, setComentarioChecked] = useState([]); // notificar comentários
    const [comentariosReadOnly, setComentariosReadOnly] = useState(true);
    const [showModalNotificacaoNaoEntregue, setShowModalNotificacaoNaoEntregue] = useState(false);

    const carregaComentarios = useCallback(async () => {
        if(relatorioConsolidado && relatorioConsolidado.uuid){
            let comentarios = await getComentariosDeAnaliseConsolidadoDre(relatorioConsolidado.uuid);
            // Comentários que NÃO foram notificados ainda e que podem ser alterados ou excluídos
            setComentarios(comentarios.comentarios_nao_notificados);
            // Comentários que JÁ foram notificados e que NÃO podem ser alterados ou excluídos
            setComentariosNotificados(comentarios.comentarios_notificados) 
        }

        
    }, [relatorioConsolidado]);

    useEffect(() => {
        carregaComentarios();
    }, [carregaComentarios]);

    useEffect(() => {
        if(relatorioConsolidado.status_sme === "ANALISADO"){
            setComentariosReadOnly(true);
        }
        else{
            setComentariosReadOnly(false);
        }
    }, [relatorioConsolidado]);

    useEffect(() => {
        if(comentariosNotificados.length > 0){
            setHabilitaVerResumoComentariosNotificados(true);
        }
    }, [comentariosNotificados, setHabilitaVerResumoComentariosNotificados]);

    const onSubmit = async (values) => {
        const payload = {
            consolidado_dre: relatorioConsolidado.uuid,
            ordem: comentarios.length + 1,
            comentario: values.comentarios[0].comentario,
            uuid: values.comentarios[0].uuid
        };

        await criarComentarioDeAnalise(payload);
        setToggleExibeBtnAddComentario(true);
        await carregaComentarios();
    };

    const onHandleClose = () => {
        setShowModalComentario(false);
        setComentarioEdicao(false);
        setShowModalNotificarComentarios(false);
    };

    const onHandleCloseDeletarComentario = () => {
        setShowModalDeleteComentario(false);
    };

    const onHandleCloseNotificacaoNaoEntregue = () => {
        setShowModalNotificacaoNaoEntregue(false);
    }

    const onDeleteComentarioTrue = () => {
        setShowModalDeleteComentario(false);
        onDeletarComentario();
    };

    const setComentarioParaEdicao = (comentario)=>{
        setComentarioEdicao(comentario);
        setShowModalComentario(true);
    };

    const onChangeComentario = (comentario, objComentario) =>{
        setComentarioEdicao({
            ...comentarioEdicao,
            consolidado_dre: relatorioConsolidado.uuid,
            comentario: comentario,
            ordem: objComentario.ordem,
            uuid: objComentario.uuid
        });
    };

    const onEditarComentario = async () => {
        setShowModalComentario(false);
        await editarComentarioDeAnaliseConsolidadoDre(comentarioEdicao.uuid, comentarioEdicao);
        setToggleExibeBtnAddComentario(true);
        await carregaComentarios();
    };

    const onDeletarComentario = async () => {
        setShowModalComentario(false);
        setShowModalDeleteComentario(false);
        await deleteComentarioDeAnalise(comentarioEdicao.uuid);
        setToggleExibeBtnAddComentario(true);
        setComentarioChecked([]);
        await carregaComentarios()
    };

    const validaConteudoComentario = (conteudoComentario) =>{
        if (conteudoComentario) {
            setDisabledBtnAddComentario(false)
        }else {
            setDisabledBtnAddComentario(true)
        }
    };

    const verificaSeChecado = (comentario_uuid) =>{
        if (comentarioChecked && comentarioChecked.length > 0){
            return comentarioChecked.find(element=> element === comentario_uuid)
        }
    };

    const handleChangeCheckboxNotificarComentarios = (event, comentario_uuid) =>{
        const comentarioClicado = comentarioChecked.indexOf(comentario_uuid);
        const all = [...comentarioChecked];
        if (comentarioClicado === -1) {
            all.push(comentario_uuid);
        } else {
            all.splice(comentarioClicado, 1);
        }
        setComentarioChecked(all);
    };

    const notificarComentarios = async () =>{
        const payload = {
            dre: relatorioConsolidado.dre.uuid,
            periodo: relatorioConsolidado.periodo.uuid,
            comentarios: comentarioChecked
        };
        try {
            let notificar = await postNotificarComentariosDre(payload);
            if(!notificar.enviada) {
                setShowModalNotificacaoNaoEntregue(true)
            }
        }catch (e) {
            console.log("Erro ao enviar notificações ", e)
        }
        setShowModalNotificarComentarios(false);
        setComentarioChecked([])
        await carregaComentarios()
    };
    
    //************ Novo sortable com dnd-kit
    function handleDragEnd(event) {
        const {active, over} = event;
    
        if (active.id !== over.id) {
            setComentarios((items) => {
                const activeIndex = items.findIndex(item => item.uuid === active.id);
                const overIndex = items.findIndex(item => item.uuid === over.id);
    
                const newItems = arrayMove(items, activeIndex, overIndex);
    
                const payload = {
                    comentarios_de_analise: newItems.map((comentario, index) => ({
                        consolidado_dre: relatorioConsolidado.uuid,
                        ordem: index + 1,
                        comentario: comentario.comentario,
                        uuid: comentario.uuid,
                    }))
                };
    
                getReordenarComentariosConsolidadoDre(payload)
                    .then(() => {
                        return carregaComentarios();
                    })
                    .catch(error => {
                        console.error("Error updating comments order:", error);
                        return items;
                    });
                    
                return newItems;
            });
        }
    }
    
    const SortableItem = (props) => {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition
        } = useSortable({id: props.id});
    
        const style = {
            transform: CSS.Transform.toString(transform),
            transition
        }
    
        return (
            <div >
                <li className="d-flex bd-highlight border mt-2" ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    <div data-qa={`comentario-${props.comentario.index}`} className="p-2 flex-grow-1 bd-highlight container-item-comentario">
                        <input
                            data-qa={`checkbox-comentario-${props.comentario.index}`}
                            type='checkbox'
                            onChange={(event)=>handleChangeCheckboxNotificarComentarios(event, props.comentario.uuid)}
                            checked={verificaSeChecado(props.comentario.uuid)}
                            className="checkbox-comentario-de-analise"
                            disabled={comentariosReadOnly}
                        />
                        {props.comentario.comentario}
                    </div>
                    <div className="p-2 bd-highlight">
                        <button onClick={()=>{setComentarioParaEdicao(props.comentario)}} type="button" className={`btn-cancelar-comentario ml-2 ${comentariosReadOnly ? 'btn-cancelar-comentario-disabled': ''}`} disabled={comentariosReadOnly}>
                            <FontAwesomeIcon
                                style={{fontSize: '18px', marginRight: "5px", color: "#00585E"}}
                                icon={faEdit}
                            />
                        </button>
                    </div>
                </li>
            </div>
        )
    }

    const SortableList = ({comentarios}) => {
        const comentariosIds = useMemo(() => {
            if (comentarios) {
                return comentarios.map((comentario) => comentario.uuid);
            }
            return [];
            }, [comentarios]);

        const mouseSensor = useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
        const keyboardSensor = useSensor(KeyboardSensor)

        const sensors = useSensors(mouseSensor, keyboardSensor)

        if(comentarios && comentarios.length === 0) {
            return <></>;
        }

        return (
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={comentariosIds}
                    strategy={verticalListSortingStrategy}
                >
                    {comentarios && comentarios.length && comentarios.map(comentario => <SortableItem key={comentario.uuid} id={comentario.uuid} comentario={comentario} disabled={comentariosReadOnly}/>)}
                </SortableContext>
            </DndContext>
            );
    }
    //************ Fim novo sortable com dnd-kit
        

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4 className='mb-2'>Comentários</h4>
            <p>Crie os comentários e arraste as caixas para cima ou para baixo para reorganizar.</p>

            <>
                <FormikForm
                    comentarios={comentarios}
                    comentariosNotificados={comentariosNotificados}
                    comentarioChecked={comentarioChecked}
                    SortableList={SortableList}
                    validaConteudoComentario={validaConteudoComentario}
                    setToggleExibeBtnAddComentario={setToggleExibeBtnAddComentario}
                    toggleExibeBtnAddComentario={toggleExibeBtnAddComentario}
                    setDisabledBtnAddComentario={setDisabledBtnAddComentario}
                    disabledBtnAddComentario={disabledBtnAddComentario}
                    setShowModalNotificarComentarios={setShowModalNotificarComentarios}
                    onSubmit={onSubmit}
                    comentariosReadOnly={comentariosReadOnly}
                />

                <section>
                    <ModalEditarDeletarComentario
                        show={showModalComentario}
                        handleClose={onHandleClose}
                        onEditarComentario={onEditarComentario}
                        setShowModalDeleteComentario={setShowModalDeleteComentario}
                        comentario={comentarioEdicao}
                        onChangeComentario={onChangeComentario}
                        titulo="Edição de comentário"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>

                <section>
                    <ModalDeleteComentarioSme
                        show={showModalDeleteComentario}
                        handleClose={onHandleCloseDeletarComentario}
                        onDeleteComentarioTrue={onDeleteComentarioTrue}
                        titulo="Excluir Comentário"
                        texto="<p>Deseja realmente excluir este comentário?</p>"
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="danger"
                        segundoBotaoTexto="Excluir"
                    />
                </section>

                <section>
                    <ModalNotificarComentarios
                        show={showModalNotificarComentarios}
                        handleClose={onHandleClose}
                        notificarComentarios={notificarComentarios}
                        titulo="Notificar comentários"
                        texto="<p>Deseja enviar os comentários selecionados como notificações para a DRE?</p>"
                        primeiroBotaoTexto="Sim"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Não"
                    />
                </section>

                <section>
                    <ModalNotificacaoNaoEntregue
                        show={showModalNotificacaoNaoEntregue}
                        handleClose={onHandleCloseNotificacaoNaoEntregue}
                        titulo="Não é possível notificar a DRE."
                        texto="<p>Não é possível notificar a DRE pois esta não tem usuários cadastrados na Comissão de Prestação de Contas.</p>"
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
            </>
        </>
    )
};

export default memo(Comentarios)