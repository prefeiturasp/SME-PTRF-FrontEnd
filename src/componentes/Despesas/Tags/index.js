import React from "react";
import "./tags.scss"

export const Tags = () => {
    return (
        <div className="container-tags mt-3">
            <div className="form-row align-items-center box-escolha-tag">
                <div className="col-auto">
                    <p className='mb-0 mr-4 font-weight-normal'>Esse gasto possui vínculo a alguma etiqueta?</p>
                </div>
                <div className="col-auto">
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="tags" id="tag_sim" value="sim"/>
                        <label className="form-check-label" htmlFor="tag_sim">Sim</label>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="tags" id="tag_nao" value="nao"/>
                        <label className="form-check-label" htmlFor="tag_nao">Não</label>
                    </div>
                </div>
            </div>
        </div>
    )
};