import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ReactSVG } from 'react-svg';
import { MdAssignmentReturn } from 'react-icons/md';
import { SpinnerRoundFilled } from 'spinners-react';
import { GrFormClose } from 'react-icons/gr';
import {
  ContentTypes,
  DERIVATIONS,
  FormProps,
  FormTypes,
  Message,
  MessageFrom,
  SuggestionsProps,
} from '../../shared';
import { suggestionsObjNew } from '../../extra';
import { webchatProps } from '../../WebChat/webchat.interface';
import { Forms } from '../Forms/Forms';

interface BotBoxProps {
  setToggleBotWithAgent: Dispatch<SetStateAction<boolean>>;
  automatedMessages: Message[];
  setAutomatedMessages: Dispatch<SetStateAction<Message[]>>;
}

export const BotBox: FC<webchatProps & BotBoxProps> = function ({
  setToggleBotWithAgent,
  automatedMessages,
  setAutomatedMessages,
  base64Avatar,
}) {
  const dialogueBoxRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [lastTime, setLastTime] = useState('');
  const [suggestions, setSuggestions] = useState(suggestionsObjNew);
  const [isFormActive, setIsFormActive] = useState(true);
  const [formFields, setFormFields] = useState<FormProps[]>([
    {
      name: 'Nombre',
      type: FormTypes.TEXT,
      placeholder: 'Ingresar nombre',
    },
    {
      name: 'Expediente',
      type: FormTypes.TEXT,
      placeholder: 'Ingresar núm. de expediente',
    },
  ]);

  const [formFieldsValuesObj, setFormFieldsValuesObj] = useState<{
    [key: string]: string;
  }>({});

  console.log('[FORM FIELDS]', formFields);

  const scrollToBottom = useCallback(() => {
    dialogueBoxRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogueBoxRef]);

  const handleDerivation = (derivation: DERIVATIONS, suggestion?: any) => {
    setAutomatedMessages([
      ...automatedMessages,
      {
        contentType: ContentTypes.TEXT,
        from: MessageFrom.BOT,
        content: 'Derivación a agente',
      },
    ]);
    setTimeout(() => {
      setLoadingMessage(false);
      scrollToBottom();
      if (derivation === DERIVATIONS.AGENT) {
        setToggleBotWithAgent(true);
      }
    }, 3000);
  };
  const handleAutomatedMessages = (suggestion: any) => {
    const currentTime = new Date();
    localStorage.setItem('lastTime', JSON.stringify(currentTime.getTime()));

    const newSuggestions = suggestion.subItems?.filter((item: any) => item);
    if (newSuggestions) {
      setSuggestions(newSuggestions);
    } else {
      setSuggestions(
        suggestions.filter((item: any) => item.name !== suggestion.name),
      );
    }

    if (suggestion.derivation) {
      if (suggestion.derivation === DERIVATIONS.AGENT) {
        setLoadingMessage(true);
        handleDerivation(suggestion.derivation);
      }
      if (suggestion.derivation === DERIVATIONS.FORM) {
        setFormFields(suggestion.derivationForm);
        setIsFormActive(true);
      }
      return;
    }

    if (suggestion.question) {
      setLoadingMessage(true);
      setTimeout(() => {
        setAutomatedMessages([
          ...automatedMessages,
          {
            contentType: ContentTypes.TEXT,
            from: MessageFrom.USER,
            content: suggestion.name || '',
          },
          {
            contentType: ContentTypes.TEXT,
            from: MessageFrom.BOT,
            content: suggestion.question || '',
          },
        ]);
        setLoadingMessage(false);
        scrollToBottom();
      }, 2000);
    } else {
      setAutomatedMessages([
        ...automatedMessages,
        {
          contentType: ContentTypes.TEXT,
          from: MessageFrom.USER,
          content: suggestion.name || '',
        },
      ]);
    }

    if (!suggestion.subItems) {
      setLoadingMessage(true);
      setTimeout(() => {
        setAutomatedMessages([
          ...automatedMessages,
          {
            contentType: ContentTypes.TEXT,
            from: MessageFrom.USER,
            content: suggestion.name || '',
            icon: suggestion.icon || '',
          },
          ...suggestion.options.map((option: any) => ({
            contentType: ContentTypes.TEXT,
            from: MessageFrom.BOT,
            content: option.text || '',
            icon: option.icon || '',
            link: option.link || '',
          })),
        ]);
        setLoadingMessage(false);
        scrollToBottom();
      }, 2000);
      setLastTime(localStorage.getItem('lastTime'));
    }
  };

  useEffect(scrollToBottom, [
    scrollToBottom,
    automatedMessages,
    setSuggestions,
  ]);

  return (
    <div className="chat-box__bot-ewc-class">
      <div className="dialogues-box__bot-ewc-class">
        {/* MAPEO LO QUE CONTESTA EL BOT AL ELEGIR UNA OPCION */}
        {automatedMessages &&
          automatedMessages.map((message, index) =>
            message.from === MessageFrom.BOT ? (
              <>
                {/* SOLO CONTESTACIONES DEL BOT DEL LADO IZQUIERDO */}
                <div key={index.toString()}>
                  <div className="bot-dialogue__bot-ewc-class">
                    <div className="bot-image-container__bot-ewc-class">
                      {/* SI HAY UN ICONO DENTRO DE LA OPCION, SE PONE EL ICONO Y SINO EL AVATAR X DEFECTO */}
                      {message.icon ? (
                        <ReactSVG
                          className="bot-svg-and-icon__bot-ewc-class"
                          src={message.icon}
                        />
                      ) : (
                        <img
                          src={`data:image/svg+xml;base64,${base64Avatar}`}
                          className="avatar-chat__ewc-class"
                          alt="avatar"
                        />
                      )}
                    </div>

                    <div
                      className={
                        message.contentType === ContentTypes.ATTACHMENT
                          ? 'bot-text-container__bot-ewc-class clickable-bot__bot-ewc-class'
                          : 'bot-text-container__bot-ewc-class'
                      }>
                      <span className="bot-text__bot-ewc-class">
                        {/* SI EL BOTON INCLUYE UN LINK, VA A SER CLICKEABLE EL DIALOGO DEL BOT Y ME VA A REDIRECCIONAR */}
                        {message.contentType === ContentTypes.TEXT &&
                        message.link ? (
                          <a
                            href={message.link}
                            target="_blank"
                            rel="noreferrer">
                            {message.content}
                          </a>
                        ) : (
                          message.content
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ELECCIONES DEL USUARIO DEL LADO DERECHO */}
                <div key={index.toString()}>
                  <div className="user-dialogue__bot-ewc-class">
                    <div
                      className={
                        message.contentType === ContentTypes.ATTACHMENT
                          ? 'user-dialogue-container__bot-ewc-class clickable-user__bot-ewc-class'
                          : 'user-dialogue-container__bot-ewc-class'
                      }>
                      {message.contentType === ContentTypes.TEXT &&
                        message.content}
                    </div>
                  </div>
                </div>
              </>
            ),
          )}

        {/* HORA DE LA ULTIMA INTERACCION REALIZADA POR EL USUARIO */}
        {lastTime && !loadingMessage && (
          <div className="auto-time__bot-ewc-class">
            {'Última interacción '}
            {new Date(
              JSON.parse(localStorage.getItem('lastTime')),
            ).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
            })}
          </div>
        )}

        {/* BOTONES CON LAS OPCIONES QUE ME DA EL BOT */}
        {!loadingMessage ? (
          <div className="automatized-text-container__bot-ewc-class">
            {suggestions.map((sugg, index) => (
              <button
                className="automatized-text__bot-ewc-class"
                key={index.toString()}
                type="button"
                onClick={() => {
                  handleAutomatedMessages(sugg as SuggestionsProps);
                }}>
                {/* {sugg.icon && (
                  <ReactSVG classNmae="svg-logo_ewc-class" src={sugg.icon} />
                )} */}
                {sugg.name}
              </button>
            ))}
            {isFormActive && (
              <div className="form-modal__bot-ewc-class">
                <div>
                  <div className="form-text-before__bot-ewc-class">
                    Completar formulario
                    <button
                      type="button"
                      onClick={() => setIsFormActive(false)}>
                      <GrFormClose />
                    </button>
                  </div>
                  <div className="form-cont__bot-ewc-class">
                    <Forms formFields={formFields} />
                    <button
                      type="button"
                      className="form-button__bot-ewc-class"
                      onClick={() => console.log('enviar')}>
                      Contactarme con un agente
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BOTON DE MENU PRINCIPAL AL FINAL DE LAS OPCIONES */}
            {JSON.stringify(suggestions) !==
              JSON.stringify(suggestionsObjNew) && (
              <button
                className="automatized-text-back__bot-ewc-class"
                key="xxx"
                type="button"
                onClick={() =>
                  handleAutomatedMessages({
                    name: 'Menú Principal',
                    subItems: suggestionsObjNew,
                  })
                }>
                <MdAssignmentReturn />
                Menú Principal
              </button>
            )}
          </div>
        ) : (
          <>
            {/* LOADING DE MENSAJE */}
            <div className="spinner-before-suggestions__bot-ewc-class">
              <SpinnerRoundFilled
                size={25}
                thickness={120}
                speed={180}
                color={processEnv.mainColor}
              />
            </div>
          </>
        )}
        <div
          ref={dialogueBoxRef}
          style={{
            marginTop: '20px',
          }}
        />
      </div>
    </div>
  );
};
