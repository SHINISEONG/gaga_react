import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatBot.css';
//import { fetchGptResponse } from './gptapi';

function Chatbot() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isGptMode, setIsGptMode] = useState(false);
  const [toggleImage, setToggleImage] = useState('/assets/img/chatboticon/reverse.png');

  const chatMessagesRef = useRef(null);
  const messageEndRef = useRef(null);
  const secretKey = 'VGZDTVBiZXBBRXhBbWFsdnRManVkV3RVRlJQdmtLbFg=';

  const [exampleMessages, setExampleMessages] = useState([]);

  function toggleChatBot() {
    if (isVisible) {
      setIsVisible(false);
      setToggleImage('/assets/img/chatboticon/reverse.png');
    } else {
      setIsVisible(true);
      if (messages.length === 0) {
        handleOpenEvent().then((welcomeMessage) => {
          const botMessage = {
            type: 'bot',
            text: welcomeMessage,
            bubbles: welcomeMessage.bubbles,
          };
          setMessages([botMessage]);
          setToggleImage('/assets/img/chatboticon/whilechatting.png');
        }).catch((error) => {
          console.error('handleOpenEvent 오류:', error);
        });
      }
    }
  }
  
  const handleOpenEvent = async () => {
    console.log('메시지 출발합니다');
    //const apiUrl = 'http://192.168.0.37:8080/rest/chatbot';
    const apiUrl = 'http://localhost:8080/rest/chatbot';
    const requestBodyWelcome = {
      version: 'v2',
      userId: 'nuWelcomeUserUserSuperUser',
      timestamp: new Date().getTime(),
      bubbles: [],
      event: 'open',
    };
  
    const requestBodyStringWelcome = JSON.stringify(requestBodyWelcome);
    const signature = await makeSignature(requestBodyStringWelcome, secretKey);
  
    try {
      const response = await axios.post(apiUrl, requestBodyWelcome, {
        headers: { 'hmac': signature },
      });
  
      console.log(response, '리스');
      console.log(response.data, 'isthis UD?');
      const jsonData = JSON.stringify(response);
      console.log(jsonData, 'it is Json');
  
      const jsonObject = JSON.parse(jsonData);
      console.log(jsonObject, 'hi im json');
      console.log(jsonObject.data,'hi im json data');
      if (jsonData.error) {
        console.error('네이버 챗봇 서버 에러:', jsonData.error);
        throw new Error(jsonData.error);
      }
  
      let botMessage = jsonObject.data.bubbles[0].data.description;
      let botMessage2 = jsonObject.data.bubbles[1].data.contentTable;
      let botMessage3 = jsonObject.data.bubbles[1].data;
      let contentTable = jsonObject.data.bubbles[1].data.contentTable;
     
      contentTable.forEach((row, rowIndex) => {
        row.forEach((item, itemIndex) => {
        // 이제 각 아이템에 대한 데이터를 다룰 수 있습니다.
        console.log(item.data.title); // 아이템 제목 출력
        console.log(item.data.data.action.data.url); // 아이템 URL 출력
    });
});
      console.log(botMessage2, " 제발 부탁이야씨발")
      console.log(botMessage3, " 제발 부탁이라고씨발")
      if (jsonObject.data.bubbles.length > 1) {
        if (jsonObject.data.bubbles[1].type === 'MULTILINKS') {
          let links = jsonObject.data.bubbles[1].data.component.list;
          botMessage += '\n다음 옵션 중 하나를 선택해주세요:\n';
          links.forEach((link, index) => {
            botMessage += `${index + 1}. ${link.title}\n`;
          });
        }
      }
  
      console.log(botMessage, '@@@jsonObject.data.bubbles[0].data.description@@@');
  
      return botMessage;
    } catch (error) {
      console.error('handleOpenEvent 오류:', error);
      throw error;
    }
  };

//HELP버튼 >> 추후 모달창으로 수정? 
  const handleHelpClick = () => {
    console.log("메시지 출발합니다"); 
    const examples = [
        { type: 'bot', text: '안녕하세요, 어떻게 도와드릴까요?' },
        { type: 'bot', text: '날씨 정보를 제공해드릴 수 있습니다.' },
        { type: 'bot', text: '최신 뉴스를 알려드릴 수 있습니다.' },
        //... 필요내용 추가 해야하나? 
    ];

    setExampleMessages(examples);
};

//마우스 올라갔을때 X표
const handleMouseEnter = () => {
  if (isVisible) {
    setToggleImage('/assets/img/chatboticon/x.png');
  } else {
    setToggleImage('/assets/img/chatboticon/whilechatting.png');
  }
};
//다시 원래대로 이미지 출력
const handleMouseLeave = () => {
    if (isVisible) {
      setToggleImage('/assets/img/chatboticon/whilechatting.png');
    } else {
      setToggleImage('/assets/img/chatboticon/reverse.png');
    }
  };

  useEffect(() => {
	messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //입력용
  const handleInput = (event) => {
    setInputText(event.target.value);
    if (event.key === 'Enter') {
      setInputText('');
    }
  };
//메시지전송
  const sendMessage = async (event) => {
	event.preventDefault();
	const userMessage = { type: 'user', text: inputText };
	setMessages([...messages, userMessage]);

	const response = await handleSendMessage(inputText);
	const botMessage = { type: 'bot', text: response };
	setMessages([...messages, userMessage, botMessage]);

	setInputText('');
  };
//gpt토글버튼
const handleToggleGpt = () => {
    const chatContainer = document.querySelector('.chat-container');
    const toggleChatBotBtn = document.querySelector('.toggleChatBot');
    const normalImg = document.querySelector('.toggle-gpt-img.normal');
    const gptThemeImg = document.querySelector('.toggle-gpt-img.gpt-theme');
  
    if (chatContainer && toggleChatBotBtn && normalImg && gptThemeImg) {
      if (chatContainer.classList.contains('gpt-theme')) {
        setIsGptMode(false);
        chatContainer.classList.remove('gpt-theme');
        normalImg.classList.remove('hidden');
        gptThemeImg.classList.add('hidden');
        setToggleImage('/assets/img/chatboticon/reverse.png');
        toggleChatBotBtn.style.backgroundColor = '#009970';
      } else {
        setIsGptMode(true);
        chatContainer.classList.add('gpt-theme');
        normalImg.classList.add('hidden');
        gptThemeImg.classList.remove('hidden');
        setToggleImage('/assets/img/chatboticon/gpt4.png');
        toggleChatBotBtn.style.backgroundColor = '#000000';
      }
  
      const gptStatusMessage = {
        type: 'bot',
        text: !isGptMode
          ? 'GPT 모드가 활성화되었습니다.'
          : 'GPT 모드가 비활성화되었습니다.',
      };
      setMessages([...messages, gptStatusMessage]);
    }
  };
  

const handleSendMessage = async (text) => {
  document.querySelector('.toggleChatBot').addEventListener('click', async function () {
    this.classList.toggle('active');
    
  });
  
  if (isGptMode) {
    const gptResponse = await fetchGptResponse(text);
    return gptResponse;
  } else {
    //const apiUrl = 'http://192.168.0.37:8080/rest/chatbot';
    const apiUrl = 'http://localhost:8080/rest/chatbot';
    const requestBody = {
      version: 'v2',
      userId: 'UserUserSuperUser',
      timestamp: new Date().getTime(),
      inputText: text,
      bubbles: [
        {
          type: 'text',
          data: {
            description: text,
          },
        },
      ],
      event: 'send',
      isGptMode: isGptMode,
    };    

    const requestBodyString = JSON.stringify(requestBody);
    const signature = await makeSignature(requestBodyString, secretKey);

    return axios
      .post(apiUrl, requestBodyString, {
        headers: {
          'Content-Type': 'application/json;UTF-8',
          'X-NCP-CHATBOT_SIGNATURE': signature,
        },
      })
      .then((response) => {
        let jsonData = response.data;
        let bubbleArray = jsonData.bubbles;
        let botMessage = bubbleArray[0].data.description;
        if (bubbleArray[0].data.url && bubbleArray[0].data.urlAlias) {
          botMessage = `${botMessage}\n\n[URL](${bubbleArray[0].data.urlAlias})`;
        }
        return botMessage;
      })
      .catch((error) => {
        console.error(error);
      });
  }
};

//시그니쳐로 서버전송
const makeSignature = async (message, secretKey) => {
    const secretKeyBytes = new TextEncoder().encode(secretKey);
    const hmac = await crypto.subtle.importKey('raw', secretKeyBytes, { name: 'HMAC', hash: 'SHA-256' }, true, ['sign']);
  
    const signature = await crypto.subtle.sign('HMAC', hmac, new TextEncoder().encode(message));
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  };

  return (
	<div>
        <button className="toggleChatBot"
        onClick={toggleChatBot}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
            {/*<img src={toggleImage} alt="Toggle chatbot" />*/}
        <img className="toggle-gpt-img normal" src="/assets/img/chatboticon/reverse.png" />
        <img className="toggle-gpt-img gpt-theme hidden" src="/assets/img/chatboticon/gpt4.png" />
        </button>       

        <div className={`chat-container ${isVisible ? '' : 'hidden'}`}>
                <div className="chat-header">
                    {/* 챗봇 창 상단에 HELP 버튼 추가 */}
                    <button className="help-button" onClick={handleHelpClick}>HELP</button>
                    <h3>GAGABOT</h3>
                </div>
                <div className="chat-messages" id="chatMessages">
  {messages.map((message, index) => (
    <div key={index} className={`chat-message ${message.type}`}>
      <h4>{message.type === "user" ? "당신" : "Gagabot"}</h4>
      <p>{message.text}</p>
      {message.type === "bot" && message.bubbles && (
        <div>
          {message.bubbles.map((bubble, bubbleIndex) => {
            if (bubbleIndex === 0) {
              // 첫 번째 버블: 웰컴 메시지
              return <p key={bubbleIndex}>{bubble.data.description}</p>
            } else if (bubbleIndex === 1 && bubble.component.data.contentTable) {
              // 두 번째 버블: 멀티링크
              return bubble.component.data.contentTable.map((contentRow, rowIndex) =>
                contentRow.map((contentItem, itemIndex) => 
                  <a key={`${bubbleIndex}-${rowIndex}-${itemIndex}`} href={contentItem.data.data.action.data.url}>{contentItem.data.title}</a>
                )
              );
            } else {
              // 그 외 기타 버블 (필요한 경우 추가)
              return null;
            }
          })}
        </div>
      )}
    </div>
  ))}
  <div ref={messageEndRef} />
</div>
	<div className="chat-input">
        <button className="toggle-gpt" onClick={handleToggleGpt}>
            GPT
        </button>
        <form onSubmit={sendMessage}>
            <input
            type="text"
            id="messageInput"
            value={inputText}
            onChange={handleInput}
            placeholder="채팅을 입력해주세요~"
            />
            <button type="submit" id="sendButton">
            전송
            </button>
        </form>
        </div>
	</div>
  </div>
); 
}
export default Chatbot; 