/* eslint-disable react/jsx-props-no-spreading */
import React, { Dispatch, FC, SetStateAction } from 'react';
import { webchatProps } from '../../../WebChat/webchat.interface';

interface BotBoxProps {
  setConfirmation: Dispatch<SetStateAction<boolean>>;
}
export const Confirmation: FC<webchatProps & BotBoxProps> = function ({
  setConfirmation,
  svgBack,
}) {
  const handleClick = () => {
    setConfirmation(false);
  };

  return (
    <div className="confirmation__ewc-class">
      <div>
        <img src={svgBack.Warning} alt="busy agents" />
      </div>
      <h1>CONFIRMAR</h1>
      <span>
        Ya tienes una conversación iniciada anteriormente con un agente
      </span>
      <span>Estás seguro de que deseas enviar estos datos?</span>
      <button
        className="button-close-confirmation__ewc-class"
        type="button"
        onClick={handleClick}>
        OK
      </button>
    </div>
  );
};
