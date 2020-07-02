import React, {useEffect, useState} from "react";
import {UrlsMenuInterno} from "../UrlsMenuInterno";
import Loading from "../../../utils/Loading";
import {MenuInterno} from "../../MenuInterno";
import {getContas} from "../../../services/Associacao.service";

export const DadosDasContas = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const buscaContas = async ()=>{
            let contas = await getContas();
            console.log("contas ", contas)
        };
        buscaContas();
    }, []);

    useEffect(()=>{
        setLoading(false)
    }, []);

    return (
        <>
            {loading ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) :
                <div className="row">
                    <div className="col-12">
                        <MenuInterno
                            caminhos_menu_interno = {UrlsMenuInterno}
                        />
                        <form>
                            <div className="row">
                                <div className='col-12 col-md-3'>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                    </div>
                                </div>
                                <div className='col-12 col-md-3'>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                    </div>
                                </div>
                                <div className='col-12 col-md-3'>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                    </div>
                                </div>
                                <div className='col-12 col-md-3'>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Email address</label>
                                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex  justify-content-end pb-3 mt-3">
                                <button type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                                <button type="button" className="btn btn-success mt-2">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
};