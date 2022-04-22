/* eslint-disable react/jsx-props-no-spreading */
import React, { FC } from 'react';
import { webchatProps } from '../../../WebChat/webchat.interface';

export const BusyAgents: FC<webchatProps> = function ({
  setBusyAgents,
  svgBack,
}) {
  const handleClick = () => {
    setBusyAgents(false);
  };

  return (
    <div className="busy-agents__ewc-class">
      <div>
        <img src={svgBack.Warning} alt="busy agents" />
      </div>
      <h1>AGENTES OCUPADOS</h1>
      <span>
        Todos nuestros agentes se encuentran ocupados en este momento. Por favor
        aguarde un instante e intente nuevamente.
      </span>
      <span>Muchas gracias.</span>
      <button
        className="button-close-busy-agents__ewc-class"
        type="button"
        onClick={handleClick}>
        OK
      </button>
    </div>
  );
};
