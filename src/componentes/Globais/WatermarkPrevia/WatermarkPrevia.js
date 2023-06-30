import React from 'react';
import watermark from '../../../assets/img/watermark-visualizacao-previa.svg'

const WatermarkPrevia = ({alturaDocumento}) => {
  return (
    <div className='mt-4 postion-relative'>
      {Array.from({ length: Math.ceil(alturaDocumento / 500) }).map((_, index) => (
        <img
          id="watermark-previa"
          className='watermark-previa'
          alt="Rascunho"
          key={index}
          src={watermark}
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