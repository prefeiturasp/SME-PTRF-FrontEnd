import './scss/TagPeriodoConciliacao.scss';

export default function TagPeriodoConciliacao({periodo, index, classExtra}) {
    return(
        <div data-testid={`td-periodo-conciliacao-${index}`} className={classExtra}>
            <small className="tag-periodo-conciliacao">
                Período: {periodo}
            </small>                                                    
        </div>    
    )
}