const itens = [
    { label: 'Vigente', className: 'seg-vigente' },
    { label: 'Encerrado', className: 'seg-encerrado' },
    { label: 'Vago', className: 'seg-vago' }   
]

export const IndicadorLegenda = () => {
    return (
        <div className="d-flex flex-wrap mb-2 legenda-timeline IndicadorLegenda">
            {itens.map( item => (
                <span className="d-flex align-items-center mr-3" key={item.label}>
                    <i className={`quadrado-legenda ${item.className}`} /> {item.label}
                </span>
            ))}
        </div>
    );
};