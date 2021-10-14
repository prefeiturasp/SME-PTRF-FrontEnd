import React, {memo} from "react";

const MotivoNaoRegularidade = ({exibeCampoMotivoNaoRegularidade, campoMotivoNaoRegularidade,setCampoMotivoNaoRegularidade}) => {
    return(
        <>
            {exibeCampoMotivoNaoRegularidade &&
                <div className="form-group mt-3">
                    <label htmlFor="motivo-nao-regularidade"><strong>Motivo da não regularidade</strong></label>
                    <textarea
                        value={campoMotivoNaoRegularidade}
                        onChange={(e)=>setCampoMotivoNaoRegularidade(e.target.value)}
                        className="form-control mt-2"
                        name='motivo-nao-regularidade'
                        id='motivo-nao-regularidade'
                        placeholder='Se necessário, adicione o motivo da não regularidade...'
                        maxLength='299'
                    />
                </div>
            }

        </>
    )
}

export default memo(MotivoNaoRegularidade)