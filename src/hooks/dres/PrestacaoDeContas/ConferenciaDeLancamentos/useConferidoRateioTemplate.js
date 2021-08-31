import React from "react";

function useConferidoRateioTemplate (){

    function retornaConferidoRateioTemplate (rateio) {
        return (
            <div>
                <input
                    defaultValue={rateio.conferido}
                    defaultChecked={rateio.conferido}
                    type="checkbox"
                    name="checkConferido"
                    id="checkConferido"
                    disabled={true}
                />
            </div>
        )
    }

    return retornaConferidoRateioTemplate

}
export default useConferidoRateioTemplate