import React, {memo} from "react";

const SelectAnalisesDePcDevolvidas = ({uuidAnalisePcDevolvida, handleChangeSelectAnalisesDePcDevolvidas, analisesDePcDevolvidas}) => {
    return(
        <div className='row mt-5'>
            <div className='col-auto'>
                <p className='pb-0 mt-2'>Visualize as devoluções pelas datas:</p>
            </div>
            <div className='col'>
                <select
                    value={uuidAnalisePcDevolvida}
                    onChange={(e) => handleChangeSelectAnalisesDePcDevolvidas(e.target.value, e)}
                    name={`filtrar_por_tipo_de_ajuste`}
                    id={`filtrar_por_tipo_de_ajuste`}
                    className="form-control"
                >
                    {analisesDePcDevolvidas && analisesDePcDevolvidas.length > 0 && analisesDePcDevolvidas.map((item, index) => (
                        <option key={item.uuid} value={item.uuid} data-objeto={JSON.stringify({...item})}>{item.label_formatada}</option>
                    ))}
                </select>
            </div>

        </div>
    )
}
export default memo(SelectAnalisesDePcDevolvidas)

