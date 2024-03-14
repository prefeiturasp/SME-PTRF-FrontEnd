import React from 'react';
import watermarkRascunho from '../../../assets/img/watermark-visualizacao-previa.svg'
import watermarkVisualizacao from '../../../assets/img/watermark-visualizacao.svg'


const WatermarkPrevia = ({alturaDocumento, icon}) => {

  const watermarkIcon = () => {
    if(icon === 'rascunho') {
      return watermarkRascunho;
    }
    return watermarkVisualizacao;
  }

  return (
    <div className='mt-4 postion-relative'>
      {Array.from({ length: Math.ceil(alturaDocumento / 500) }).map((_, index) => (
        <img
          id="watermark-previa"
          className='watermark-previa'
          alt="Rascunho"
          key={index}
          src={watermarkIcon()}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top:`${(index * 500) + 50}px`,
            zIndex: '999'
          }}
        />
      ))}
    </div>
  );
};

export default WatermarkPrevia;