import React, { FC, useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios, { AxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from 'react-icons/io';
import { VscListSelection } from 'react-icons/vsc';
import { Message } from '../shared';
import { OutOfHourWarningComponent } from '../molecules/InformationMessages/OutOfHourWarning/OutOfHourWarning';
import { Assistant } from '../molecules/Assistant/Assistant';
import { ChatBox } from '../molecules/ChatBox/ChatBox';
import { InputsBox } from '../molecules/InputsBox/InputsBox';
import { ChatBoxForm } from '../molecules/ChatBox/ChatBoxForm';
import { TriggerButton } from '../molecules/TriggerButton/TriggerButton';
import { FinishedConversation } from '../molecules/InformationMessages/FinishedConversation/FinishedConversation';
import { BusyAgents } from '../molecules/InformationMessages/BusyAgents/BusyAgents';
import { BotBox } from '../molecules/BotBox/BotBox';
import { initialMessage } from '../extra';
import { webchatProps } from './webchat.interface';

export const WebChat: FC<webchatProps> = function () {
  const [socket, setSocket] = useState(null);
  const [setingNameAndEmail, setSetingNameAndEmail] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [chatInputDialogue, setChatInputDialogue] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messages, setMessages] = useState([] as Message[]);
  const [uploadActive, setUploadActive] = useState(false);
  const [outOfHourWarning, setOutOfHourWarning] = useState(false);
  const [agentName, setAgentName] = useState(
    sessionStorage.getItem('webchat_elipse_agent_name') || '',
  );
  const [conversationFinished, setConversationFinished] = useState(false);
  const [busyAgents, setBusyAgents] = useState(false);
  const [svgI, setSvgI] = useState('');
  const [svgBack, setSvgBack] = useState({});
  const [loading, setLoading] = useState(false);
  const [toggleBotWithAgent, setToggleBotWithAgent] = useState(false);
  const [automatedMessages, setAutomatedMessages] = useState<Message[]>(
    !sessionStorage.getItem('chatId') && initialMessage,
  );

  const getAvatar = useCallback(async () => {
    const { data } = await axios.get(processEnv.avatar);
    setSvgI(data);
  }, []);

  const getAllImages = useCallback(async () => {
    setLoading(true);
    try {
      const axiosConfig: AxiosRequestConfig = {
        url: `${processEnv.restUrl}/webchat/webchatFiles/icons`,
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios(axiosConfig);
      setSvgBack(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getMessages = useCallback(
    async (idChat) => {
      try {
        const axiosConfig: AxiosRequestConfig = {
          url: `${processEnv.restUrl}/webchat/getConversation/${idChat}`,
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
          },
        };
        const response = await axios(axiosConfig);
        if (response.data.success) {
          setMessages(response.data.result);
        } else {
          Swal.fire({
            title:
              'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
            confirmButtonText: 'OK',
            confirmButtonColor: processEnv.mainColor,
            customClass: {
              popup: 'animated animate__fadeInDown',
            },
          });
        }
      } catch (error) {
        Swal.fire({
          title:
            'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
          confirmButtonText: 'OK',
          confirmButtonColor: processEnv.mainColor,
          customClass: {
            popup: 'animated animate__fadeInDown',
          },
        });
      }
    },
    [setMessages],
  );

  const handleCollapse = (): void => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSendMessage = useCallback(
    async (botInteractedMessages?: Message[]) => {
      if (socket.connected) {
        setChatInputDialogue('');
        // Objeto para el valor del input
        const bodyObject: Message = {
          content: chatInputDialogue,
          infoUser: `${sessionStorage?.getItem(
            'webchat_elipse_name',
          )} - ${sessionStorage?.getItem('webchat_elipse_email')}`,
        };
        // Objeto para el contenido de la interacción con el bot
        const bodyObjectArray = {
          content: botInteractedMessages || '',
          infoUser: `${sessionStorage?.getItem(
            'webchat_elipse_name',
          )} - ${sessionStorage?.getItem('webchat_elipse_email')}`,
        };
        try {
          setSendingMessage(true);
          const axiosConfig: AxiosRequestConfig = {
            url: `${processEnv.restUrl}/webchat/sendMessageToAgent`,
            method: 'post',
            data: sessionStorage.getItem('chatId')
              ? bodyObject
              : bodyObjectArray,
            headers: {
              'Content-Type': 'application/json',
            },
            params: {
              chatId: sessionStorage.getItem('chatId'),
              companyId: processEnv.companyId,
            },
          };

          const response = await axios(axiosConfig);
          if (response.data.success) {
            if (response?.data?.result?._id) {
              sessionStorage.setItem('chatId', response.data.result._id);
              socket.emit(
                'joinWebchatUser',
                response.data.result.client.clientId,
              );
              setMessages(response.data.result.messages);
            } else {
              setMessages(response.data.result);
            }
          } else if (response?.data.errorMessage) {
            const errorMess = response.data.errorMessage;

            if (errorMess === 'Agents not available') {
              setMessages(response.data.chat.result.messages);
              setBusyAgents(true);
            }

            if (errorMess === 'Out of time') {
              setOutOfHourWarning(true);
            }
          } else {
            Swal.fire({
              title:
                'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
              confirmButtonText: 'OK',
              confirmButtonColor: processEnv.mainColor,
              customClass: {
                popup: 'animated animate__fadeInDown',
              },
            });
          }
          setSendingMessage(false);
        } catch (error) {
          console.log('entra', error);
          Swal.fire({
            title:
              'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
            confirmButtonText: 'OK',
            confirmButtonColor: processEnv.mainColor,
            customClass: {
              popup: 'animated animate__fadeInDown',
            },
          });
          setSendingMessage(false);
        }
      } else {
        Swal.fire({
          title:
            'Estamos experimentando inconvenientes técnicos. Por favor, disculpe las molestias ocasionadas y vuelva a intentarlo más tarde. Muchas Gracias.',
          confirmButtonText: 'OK',
          confirmButtonColor: processEnv.mainColor,
          customClass: {
            popup: 'animated animate__fadeInDown',
          },
        });
      }
    },
    [
      chatInputDialogue,
      socket,
      setMessages,
      setChatInputDialogue,
      setSendingMessage,
      setBusyAgents,
    ],
  );

  useEffect(() => {
    if (sessionStorage.getItem('chatId')) {
      const idChat = sessionStorage.getItem('chatId');
      getMessages(idChat);
    }
  }, [getMessages]);

  useEffect(() => {
    const socketConnection = io(processEnv.socketUrl);
    setSocket(socketConnection);
  }, [setSocket]);

  useEffect(() => {
    getAvatar();
    getAllImages();
  }, []);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('connected');
    });

    socket?.on('newMessageToWebchatUser', (arg: Message[]) => {
      setMessages(arg);
    });

    socket?.on('finishConversationForWebchat', () => {
      setMessages([]);
      sessionStorage.removeItem('chatId');
      sessionStorage.removeItem('webchat_elipse_agent_name');
      setConversationFinished(true);
      setAgentName('');
    });

    socket?.on('agentData', (data: { name: string; id: string }) => {
      sessionStorage.setItem('webchat_elipse_agent_name', data.name);
      setAgentName(data.name);
    });

    if (sessionStorage.getItem('webchat_elipse_email')) {
      socket?.emit(
        'joinWebchatUser',
        sessionStorage.getItem('webchat_elipse_email'),
      );
    }
  }, [socket, setingNameAndEmail, messages]);

  return (
    <>
      {!loading && (
        <div className={isCollapsed ? 'chat-container__ewc-class' : 'hidden'}>
          {outOfHourWarning && (
            <OutOfHourWarningComponent
              setOutOfHourWarning={setOutOfHourWarning}
              svgBack={svgBack}
            />
          )}
          {conversationFinished && (
            <FinishedConversation
              setConversationFinished={setConversationFinished}
              handleCollapse={handleCollapse}
              svgBack={svgBack}
            />
          )}
          {busyAgents && (
            <BusyAgents setBusyAgents={setBusyAgents} svgBack={svgBack} />
          )}

          <Assistant
            handleCollapse={handleCollapse}
            agentName={agentName}
            base64Avatar={svgI}
            svgBack={svgBack}
          />
          {toggleBotWithAgent && (
            <div className="without-header-back-container__ewc-class">
              <button
                type="button"
                className="back-button__ewc-class"
                onClick={() => setToggleBotWithAgent(false)}>
                <IoIosArrowBack />

                <div>
                  {' '}
                  <VscListSelection />{' '}
                </div>
                <span />
              </button>
            </div>
          )}
          {sessionStorage.getItem('webchat_elipse_name') &&
            sessionStorage.getItem('webchat_elipse_email') &&
            toggleBotWithAgent && (
              <>
                <ChatBox
                  messages={messages}
                  agentName={agentName}
                  base64Avatar={svgI}
                  svgBack={svgBack}
                />
                <InputsBox
                  messages={messages}
                  uploadActive={uploadActive}
                  sendingMessage={sendingMessage}
                  chatInputDialogue={chatInputDialogue}
                  outOfHourWarning={outOfHourWarning}
                  setOutOfHourWarning={setOutOfHourWarning}
                  setUploadActive={setUploadActive}
                  setSendingMessage={setSendingMessage}
                  setChatInputDialogue={setChatInputDialogue}
                  setMessages={setMessages}
                  setBusyAgents={setBusyAgents}
                  socket={socket}
                  svgBack={svgBack}
                  handleSendMessage={handleSendMessage}
                />
              </>
            )}

          {!toggleBotWithAgent && (
            <BotBox
              handleSendMessage={handleSendMessage}
              // toggleBotWithAgent={toggleBotWithAgent}
              setToggleBotWithAgent={setToggleBotWithAgent}
              automatedMessages={automatedMessages}
              setAutomatedMessages={setAutomatedMessages}
              base64Avatar={svgI}
            />
          )}

          {(!sessionStorage.getItem('webchat_elipse_name') ||
            !sessionStorage.getItem('webchat_elipse_email')) &&
            toggleBotWithAgent && (
              <ChatBoxForm
                email={email}
                setEmail={setEmail}
                name={name}
                setName={setName}
                setSetingNameAndEmail={setSetingNameAndEmail}
                setMessages={setMessages}
                automatedMessages={automatedMessages}
                handleSendMessage={handleSendMessage}
                setOutOfHourWarning={setOutOfHourWarning}
                svgBack={svgBack}
                // setToggleBotWithAgent={setToggleBotWithAgent}
                // toggleBotWithAgent={toggleBotWithAgent}
              />
            )}

          <div className="footer__ewc-class">
            <a
              href="https://elipse.ai/elipse-chat/#preciosyplanes"
              target="_blank"
              className="footer-button"
              rel="noreferrer">
              Powered by Elipse
            </a>
          </div>
        </div>
      )}
      {!loading && (
        <TriggerButton
          base64Avatar={svgI}
          handleCollapse={handleCollapse}
          isCollapsed={isCollapsed}
          agentName={agentName}
          svgBack={svgBack}
        />
      )}
    </>
  );
};
