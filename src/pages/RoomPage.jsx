
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import { toast } from "react-toastify"

import CodeMirror from '@uiw/react-codemirror';
import { okaidia } from '@uiw/codemirror-theme-okaidia';
import { motion, AnimatePresence } from 'framer-motion';
import getLanguageExtension from '../components/rooms/getLanguageExtension';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';


const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 3.105a.75.75 0 01.814-.398l14.25 5.25a.75.75 0 010 1.388l-14.25 5.25a.75.75 0 01-.814-.398V3.105z" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876V5.25a1.125 1.125 0 00-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v3.375c0 .621.504 1.125 1.125 1.125h1.5a1.125 1.125 0 011.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 00-1.125 1.125v3.375m1.5-4.5" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;


function RoomPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useSelector(state => state.user);

    const [copied, setCopied] = useState(false); 
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [code, setCode] = useState(''); 
    const [language, setLanguage] = useState({ name: "javascript" });
    const [editorLanguageExtension, setEditorLanguageExtension] = useState(() => getLanguageExtension('javascript'));

    const socketRef = useRef(null);
    const editorRef = useRef(null);
    const chatMessagesEndRef = useRef(null);

    const [output, setOutput] = useState(null); // { stdout: string|null, stderr: string|null, time: string|null, status: string|null }
    const [isRunning, setIsRunning] = useState(false);
    const [isOutputPanelOpen, setIsOutputPanelOpen] = useState(false);


    useEffect(() => {
        chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const onCodeChange = useCallback((value, viewUpdate) => {
        setCode(value);
        if (socketRef.current && isConnected) {
             socketRef.current.emit('codeChange', { roomId, newCode: value });
        }
    }, [roomId, isConnected]);

    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
            return;
        }

        socketRef.current = io(SOCKET_SERVER_URL, { query: { token } });
        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
            socket.emit('joinRoom', { roomId, user });
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${reason}`);
            setIsConnected(false);
        });

        socket.on('error', (error) => {
            console.error('Socket connection error:', error);
            toast.error(error.message);
            setIsConnected(false);
            navigate("/rooms")
        });

        socket.on('roomData', ({ participantsList, currentCode, language }) => {
            console.log('Received initial room data:', participantsList, currentCode?.substring(0,10) + '...');
            setParticipants(participantsList || []);
            if (currentCode !== undefined && currentCode !== null) {
               setCode(currentCode);
            }
            setLanguage({name: language});
            setEditorLanguageExtension(getLanguageExtension(language));
        });


        socket.on('updateCode', (newCode) => {
             setCode(prevCode => {
                 if (prevCode !== newCode) {
                     return newCode;
                 }
                 return prevCode;
             });
        });


        socket.on('newMessage', (message) => {
            console.log('Received newMessage:', message);
            setMessages((prev) => [...prev, message]);
        });

        socket.on('userJoined', (newUser) => {
             console.log('User joined:', newUser);
             toast.success('User joined:' + newUser.username);
             setParticipants((prev) => [...prev, newUser]);
        });

        socket.on('userLeft', (userId) => {
            console.log('User left:', userId);
            setParticipants((prev) => prev.filter(p => p._id !== userId));
        });

        // Inside the main useEffect for socket listeners
        socket.on('codeOutput', (result) => { // result: { stdout, stderr, time, memory, status: {id, description}, compile_output }
            console.log('Received codeOutput:', result);
            setOutput(result);
            setIsRunning(false);
        });

        return () => {
            if (socketRef.current) {
                console.log(`Disconnecting socket: ${socketRef.current.id}`);
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
                setParticipants([]);
                setMessages([]);
                setCode('');
                setOutput(null);
                setIsRunning(false);
                setIsOutputPanelOpen(false);
            }
        };
    }, [roomId, user, token, navigate]);
 
    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageText = newMessage.trim();
        if (messageText && socketRef.current && isConnected) {
            socketRef.current.emit('sendMessage', { roomId, text: messageText });
            setNewMessage('');
        }
    };

    const handleCopyLink = () => {
        const roomUrl = window.location.href;
        navigator.clipboard.writeText(roomUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }).catch(err => {
          console.error('Failed to copy room link: ', err);
        });
    };

    const handleRunCode = () => {
        if (!code || !socketRef.current || !isConnected) return;
    
        console.log("Requesting code execution...");
        setIsRunning(true);
        setOutput(null);
        setIsOutputPanelOpen(true);
    
        const languageId = getJudge0LanguageId(language.name);
    
        if (!languageId) {
            console.error("Unsupported language for execution:", language.name);
            setOutput({ stderr: `Execution for language "${language.name}" is not supported yet.` });
            setIsRunning(false);
            return;
        }
    
        socketRef.current.emit('runCode', {
            roomId, // Needed? Maybe not if output is just for the user
            languageId, // Send the ID Judge0 understands
            code,
            // stdin: '...' // Optional standard input can be added here
        });
    };

    function getJudge0LanguageId(langName) {
        const langMap = {
            'ruby': 72,
            'sql': 82,
            'swift': 83,
            'java': 96,
            'typescript': 101,
            'javascript': 102,
            'c++': 105,
            'go': 107,
            'rust': 108,
            'python': 109,
            'c': 110,
            'kotlin': 111
        };
        return langMap[langName.toLowerCase()] > 0 ? langMap[langName.toLowerCase()] : null;
    }


    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">

            <div className="flex-grow lg:w-3/4 bg-gray-200 dark:bg-gray-900 p-1 lg:p-2 h-1/2 lg:h-full overflow-y-auto">
                <div className='flex items-center justify-between'>
                    <p>{language.name}</p>
                    <button onClick={handleRunCode} disabled={isRunning || !isConnected} className="my-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded shadow disabled:opacity-50">
                        {isRunning ? 'Running...' : 'Run Code'}
                    </button>
                </div>

                <CodeMirror
                    ref={editorRef}
                    value={code}
                    height="100%"
                    theme={document.documentElement.classList.contains('dark') ? okaidia : 'light'}
                    extensions={[editorLanguageExtension]}
                    onChange={onCodeChange}
                    className="h-full text-sm rounded shadow-inner" 
                    basicSetup={{ lineNumbers: true, foldGutter: true }}
                />

               
            </div>

            {/* Right Pane: Sidebar (Participants + Chat) */}
            <div className="lg:w-1/4 flex flex-col bg-gray-100 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 h-1/2 lg:h-full"> 

                <div className="p-3 border-b border-gray-300 dark:border-gray-700 flex-shrink-0">
                     <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                         Participants ({participants.length})
                         <span className={`ml-2 inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'}></span>
                     </h3>

                     <button
                        onClick={handleCopyLink}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors duration-150 ${
                            copied
                            ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                        title="Copy room invite link"
                     >
                       {copied ? <CheckIcon /> : <CopyIcon />}
                       <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                     </button>

                     <ul className="space-y-1 max-h-32 overflow-y-auto text-xs">
                          {participants.map(p => (
                              <li key={p._id} className="flex items-center space-x-1.5 text-gray-700 dark:text-gray-300">
                                  <img className="w-5 h-5 rounded-full object-cover" src={p.avatar || `https://ui-avatars.com/api/?name=${p.username}&size=20&background=random`} alt={p.username}/>
                                  <span>{p.username} {p._id === user?._id ? '(You)' : ''}</span>
                              </li>
                          ))}
                          {participants.length === 0 && <li className="text-gray-400 italic">Just you</li>}
                      </ul>
                </div>

                <div className="flex-grow p-3 flex flex-col overflow-hidden">
                    <div className="flex-grow overflow-y-auto mb-2 space-y-2 pr-1">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.user?._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-2 max-w-[80%] ${msg.user?._id === user?._id ? 'flex-row-reverse' : ''}`}>
                                     
                                    <img className="w-6 h-6 rounded-full object-cover mt-1 flex-shrink-0" src={msg.user?.avatar || `https://ui-avatars.com/api/?name=${msg.user?.username || '?'}&size=24&background=random`} alt={msg.user?.username} />
                                    <div className={`px-3 py-1.5 rounded-lg ${msg.user?._id === user?._id ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'}`}>
                                          {msg.user?._id !== user?._id && <p className="text-xs font-semibold mb-0.5 opacity-80">{msg.user?.username || 'Unknown'}</p>}
                                         <p className="text-sm break-words">{msg.text}</p>
                                         <p className="text-xs opacity-60 mt-1 text-right"> {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : ''} </p>
                                     </div>
                                 </div>
                            </div>
                        ))}
                         <div ref={chatMessagesEndRef} />
                         {messages.length === 0 && <p className="text-center text-sm text-gray-400 italic mt-4">No messages yet.</p>}
                    </div>

                    <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center space-x-2 pt-2 border-t border-gray-300 dark:border-gray-700">
                        <label htmlFor="chatInput" className="sr-only">Chat Message</label>
                        <input
                            type="text"
                            id="chatInput"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                            disabled={!newMessage.trim() || !isConnected}
                        >
                           <SendIcon/>
                           <span className="sr-only">Send</span>
                        </button>
                    </form>
                </div>

            </div>

            <AnimatePresence>
                {isOutputPanelOpen && (
                    <motion.div
                        key="output-panel"
                        className="absolute w-[73%] bottom-0 left-0 right-0 z-20 h-1/3 lg:h-1/4 border-t-2 border-gray-300 dark:border-gray-700 shadow-lg"
                        initial={{ y: "100%", opacity: 0 }} // Start below screen
                        animate={{ y: "0%", opacity: 1 }}   // Animate to original position
                        exit={{ y: "100%", opacity: 0 }}     // Animate down on exit
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }} // Smooth transition
                    >
                         {/* Panel Content */}
                         <div className="h-full bg-gray-900 text-white font-mono text-xs flex flex-col overflow-hidden">
                             {/* Panel Header */}
                             <div className="flex justify-between items-center p-2 border-b border-gray-700 flex-shrink-0 bg-gray-800">
                                 <h4 className="text-gray-300 text-sm font-sans font-semibold">Output</h4>
                                 <button
                                     onClick={() => setIsOutputPanelOpen(false)}
                                     className="p-1 text-gray-400 hover:text-white focus:outline-none"
                                     aria-label="Close Output Panel"
                                 >
                                    <CloseIcon />
                                 </button>
                             </div>

                            {/* Output Content Area */}
                             <div className="flex-grow p-3 overflow-y-auto">
                                 {isRunning && <p className="text-yellow-400 animate-pulse">Executing code...</p>}
                                 {output && (
                                     <div>
                                          {output.status && <p className="mb-1 text-gray-400">Status: <span className={`font-semibold ${output.status.id === 3 ? 'text-green-400' : 'text-red-400'}`}>{output.status.description}</span></p>}
                                          {output.time && <p className="mb-1 text-gray-400">Time: {output.time}s</p>}
                                          {output.memory && <p className="mb-2 text-gray-400">Memory: {output.memory} KB</p>}

                                          {output.stdout && ( <pre className="whitespace-pre-wrap break-words text-green-300">{output.stdout}</pre> )}
                                          {output.stderr && ( <pre className="whitespace-pre-wrap break-words text-red-400 mt-1">{output.stderr}</pre> )}
                                          {output.compile_output && ( <pre className="whitespace-pre-wrap break-words text-yellow-400 mt-1">Compiler Output: {output.compile_output}</pre> )}
                                     </div>
                                 )}
                                 {!isRunning && !output && <p className="text-gray-500 italic">Output will appear here.</p>}
                             </div>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default RoomPage;