import React from "react";
import {ModalBootstrapFormConcluirAnalise} from "../../Globais/ModalBootstrap";
import { MultiSelect } from 'primereact/multiselect';

export const ModalConcluirAnalise = (props) => {
    const selectedItemsLabel = (motivos) => {
        if(motivos.length === 1){
            return "1 selecionado"
        }
        else{
            return `${motivos.length} selecionados`
        }
    }

    const bodyTextarea = () => {
        return (
            <form>
                <div className='row'>
                    <div className="col-12">
                        <label htmlFor="status">Como você deseja concluir a análise?</label>
                        <select
                            value={props.stateConcluirAnalise.status}
                            onChange={(e) => props.handleChangeConcluirAnalise(e.target.name, e.target.value)}
                            name="status"
                            id="status"
                            className="form-control"
                        >
                            <option value="">Selecione a sua conclusão</option>
                            {props.tabelaPrestacoes.status && props.tabelaPrestacoes.status.length > 0 && props.tabelaPrestacoes.status.filter(element => element.id !== 'NAO_APRESENTADA' && element.id !== 'NAO_RECEBIDA' && element.id !== 'RECEBIDA' && element.id !== 'EM_ANALISE' && element.id !== 'DEVOLVIDA' && element.id !== 'DEVOLVIDA_RETORNADA' && element.id !== 'DEVOLVIDA_RECEBIDA').map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    {props.stateConcluirAnalise.status === 'APROVADA_RESSALVA' &&
                    <>
                        <div className="col-12 mt-2">
                            <label htmlFor="resalvas">Motivo(s)</label>
                            <br/>
                            <div className="multiselect-demo">
                                <div className="">
                                    <MultiSelect
                                        value={props.motivos}
                                        options={props.motivosAprovadoComRessalva} 
                                        onChange={(e) => {
                                            props.setMotivos(e.value);
                                        }}
                                        optionLabel="motivo" 
                                        placeholder="Selecione o(s) motivo(s)" 
                                        maxSelectedLabels={0}
                                        selectedItemsLabel={selectedItemsLabel(props.motivos)}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-2 ml-2">
                                {props.motivos && props.motivos.map((motivo, index) => (
                                    <strong key={motivo.uuid}><p className="lista-motivos mb-0">{index+1}. {motivo.motivo}</p></strong>
                                ))}
                            </div>    

                            <div className="form-check mt-3 pl-0">
                                <input
                                    name="check_box_outros_motivos"
                                    id="check_box_outros_motivos"
                                    type="checkbox"
                                    checked={props.checkBoxOutrosMotivos}
                                    onChange={(e)=>props.handleChangeCheckBoxOutrosMotivos(e)}
                                />
                                <label className="form-check-label ml-2" htmlFor="check_box_outros_motivos">
                                    Outros motivos
                                </label>
                            </div>
                            {props.checkBoxOutrosMotivos &&
                                <>
                                    <br/>
                                    <label htmlFor="outros_motivos_aprovacao_ressalva">Outro motivo:</label>
                                    <textarea
                                        name='outros_motivos_aprovacao_ressalva'
                                        value={props.txtOutrosMotivos}
                                        onChange={(e) => props.handleChangeTxtOutrosMotivos(e)}
                                        className="form-control"
                                    />
                                </>
                            }

                                <>
                                    <br/>
                                    <label htmlFor="recomendacoes">Recomendações:</label>
                                    <textarea
                                        name='recomendacoes'
                                        value={props.txtRecomendacoes}
                                        onChange={(e) => props.handleChangeTxtRecomendacoes(e)}
                                        className="form-control"
                                        placeholder="informe as recomendações"
                                        rows="3"
                                    />
                                </>
                        </div>
                        </>
                    }
                    {props.stateConcluirAnalise.status === 'REPROVADA' &&
                        <div className="col-12 mt-2">
                            <label htmlFor="motivos_reprovacao">Motivos:</label>
                            <select
                                name="motivos"
                                multiple={true}
                                onChange={
                                    (e)=>{
                                        props.handleChangeSelectMultipleMotivosReprovacao(e);
                                    }
                                }
                                value={props.selectMotivosReprovacao}
                                className="form-control"
                            >
                                {props.motivosReprovacao && props.motivosReprovacao.length > 0 && props.motivosReprovacao.map((motivo)=>(
                                    <option key={motivo.uuid} value={motivo.uuid}>{motivo.motivo}</option>
                                ))}
                            </select>

                            <div className="form-check mt-3 pl-0">
                                <input
                                    name="check_box_outros_motivos"
                                    id="check_box_outros_motivos"
                                    type="checkbox"
                                    checked={props.checkBoxOutrosMotivosReprovacao}
                                    onChange={(e)=>props.handleChangeCheckBoxOutrosMotivosReprovacao(e)}
                                />
                                <label className="form-check-label ml-2" htmlFor="check_box_outros_motivos">
                                    Outros motivos
                                </label>
                            </div>
                            {props.checkBoxOutrosMotivosReprovacao &&
                                <textarea
                                    name='outros_motivos_reprovacao'
                                    value={props.txtOutrosMotivosReprovacao}
                                    onChange={(e) => props.handleChangeTxtOutrosMotivosReprovacao(e)}
                                    className="form-control"
                                />
                            }

                        </div>
                    }

                    <div className='col-12'>
                        <div className="d-flex  justify-content-end pb-3 mt-3">
                            <button onClick={props.handleClose} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                            <button
                                onClick={props.onConcluirAnalise}
                                type="button"
                                className="btn btn-success mt-2"
                                disabled={!props.stateConcluirAnalise.status || (props.stateConcluirAnalise.status === 'APROVADA_RESSALVA' && props.motivos.length <= 0 && !props.txtOutrosMotivos) || (props.stateConcluirAnalise.status === 'APROVADA_RESSALVA' && !props.txtRecomendacoes) || (props.stateConcluirAnalise.status === 'REPROVADA' && props.selectMotivosReprovacao.length <= 0 && !props.txtOutrosMotivosReprovacao)}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        )
    };
    return (
        <>
            <ModalBootstrapFormConcluirAnalise
                show={props.show}
                onHide={props.handleClose}
                titulo={props.titulo}
                bodyText={bodyTextarea()}
                primeiroBotaoOnclick={props.handleClose}
                primeiroBotaoTexto={props.primeiroBotaoTexto}
                primeiroBotaoCss={props.primeiroBotaoCss}
                segundoBotaoOnclick={props.onConcluirAnalise}
                segundoBotaoCss={props.segundoBotaoCss}
                segundoBotaoTexto={props.segundoBotaoTexto}
            />
        </>
    );
};