import React, {useState, useEffect} from "react";
import "./tags.scss"

export const Tags = ({formikProps, index, rateio, verboHttp, disabled, despesasTabelas, bloqueiaRateioEstornado}) => {

    const [escolhaTags, setEscolhaTags] = useState({});

    useEffect(()=>{
        if ( (formikProps.values.rateios[index].tag || formikProps.values.rateios[index].escolha_tags === 'sim') && formikProps.values.rateios[index].escolha_tags !== 'nao'){
            setEscolhaTags(true)
        }else {
            setEscolhaTags(false)
        }
    }, [formikProps, index]);

    return (
        <div className="container-tags mt-4">
            <div className="form-row align-items-center box-escolha-tag">
                <div className="col-auto">
                    <p className='mb-0 mr-4 font-weight-normal'>Esse gasto possui vínculo com alguma atividade específica?</p>
                </div>
                <div className="col-auto">
                    <div className="form-check form-check-inline">
                        <input
                            data-qa={`cadastro-edicao-despesa-rateio-${index}-gasto-possui-vinculo-com-atividade-especifica`}
                            name={`rateios[${index}].escolha_tags`}
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                formikProps.setFieldValue(`rateios[${index}].escolha_tags`, "sim")
                            }}
                            className={`form-check-input`}
                            type="radio"
                            id={`tag_sim_${index}`}
                            value="sim"
                            disabled={disabled || bloqueiaRateioEstornado(rateio)}
                            checked={escolhaTags}
                        />
                        <label className="form-check-label" htmlFor={`tag_sim_${index}`}>Sim</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input
                            data-qa={`cadastro-edicao-despesa-rateio-${index}-gasto-nao-possui-vinculo-com-atividade-especifica`}
                            name={`rateios[${index}].escolha_tags`}
                            onChange={(e) => {
                                formikProps.handleChange(e);
                                formikProps.setFieldValue(`rateios[${index}].escolha_tags`, "nao")
                            }}
                            className={`form-check-input`}
                            type="radio"
                            id={`tag_nao_${index}`}
                            value="nao"
                            disabled={disabled || bloqueiaRateioEstornado(rateio)}
                            checked={!escolhaTags}
                        />
                        <label className="form-check-label" htmlFor={`tag_nao_${index}`}>Não</label>
                    </div>
                </div>

                {escolhaTags ?
                    <div className="col-auto">
                        <select
                            data-qa={`cadastro-edicao-despesa-rateio-${index}-atividade-vinculada`}
                            value={
                                rateio.tag !== null ? (
                                    typeof rateio.tag === "object" ? rateio.tag.uuid : rateio.tag
                                ) : ""
                            }
                            onChange={formikProps.handleChange}
                            name={`rateios[${index}].tag`}
                            id='tag'
                            className={`form-control`}
                            disabled={disabled || bloqueiaRateioEstornado(rateio)}
                        >
                            <option value="">Selecione uma atividade</option>
                            {despesasTabelas.tags && despesasTabelas.tags.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    : null
                }
            </div>
        </div>
    )
};