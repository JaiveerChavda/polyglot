import React, { useState } from 'react'
import spFlag from './assets/sp-flag.png';
import jpnFlag from './assets/jpn-flag.png'
import frFlag from './assets/fr-flag.png';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

function App() {
  const [sourceText, setSourceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [loading,setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const translate = async () => {

    setLoading(true);
    setSourceText('');
    const userMessage = {
      role: 'user',
      content: sourceText
    };

    // append user message
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('http://localhost:3000/translate', {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ sourceText, selectedLanguage })
      });

      if (!response.ok) {
        throw new Error('Failed to translate text');
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'system',
        content: data.translation
      }]);

    } catch(error){
      console.error(error);
    } 
    finally {
      setLoading(false);
    }
  }


  return (
    <>
      <main className='m-6 p-4 rounded-2xl outline-4 outline-slate-700'>
        <form
          className='flex flex-col max-w-md mx-auto space-y-6'
          style={{
            minHeight: '100%'
          }
          }
          onSubmit={(e) => {
            e.preventDefault();
              translate()
          }}
        >

          {/* Note */}
          <div className='border-dotted border-2 border-sky-800 rounded-lg font-medium text-gray-600 text-xl p-4 mb-6'>
            Select the language you 
            want to translate into, type your text and hit send!
          </div>

          {/* messages section*/}
          <div className='space-y-4'>
          {/* messages */}
            {messages.map(item => (

              <div className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`} 
                key={crypto.randomUUID()}
              >
                <div className={`w-fit font-poppins text-xl font-medium p-4 rounded-t-xl
                ${item.role === 'user' ? 'bg-green-400 rounded-l-xl' : 'bg-sky-800 rounded-r-xl  text-white'}
                `}
                >
                  {item.content}
                </div>
              </div>
            ))}
          </div>

          {/* show loading ai chat message  */}
          {loading && <div className='font-poppins text-xl font-medium p-4 bg-sky-800 rounded-r-xl rounded-bl-xl w-20'>
            <div className='flex items-center justify-center gap-2' aria-live='polite'>
             <span className='h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.3s]' />
                <span className='h-3 w-3 animate-bounce rounded-full bg-white [animation-delay:-0.15s]' />
                <span className='h-3 w-3 animate-bounce rounded-full bg-white' />
            </div>
          </div>}

          {/* user source text + send button */}
          <div className='space-y-5'>
            <div className='relative'>
              <textarea
                id='source-text'
                name='source-text'
                value={sourceText}
                onChange={(event) => setSourceText(event.target.value)}
                placeholder=''
                rows={3}
                className='block min-h-28 w-full resize-none rounded-2xl border-3 border-slate-500 bg-slate-50 p-4 pr-16 text-xl font-semibold text-slate-800 outline-none transition focus:border-sky-700 focus:ring-2 focus:ring-sky-200'
                aria-label='Text to translate'
                required
              />

              <button
                type='submit'
                disabled={loading || !sourceText.trim()}
                aria-label='Translate text'
                className='absolute bottom-5 right-5 rounded-lg p-1 text-green-500 transition hover:scale-110 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-40'
              >
                <PaperAirplaneIcon className='size-8 -rotate-45 stroke-2' />
              </button>
            </div>

            {/* language selection row */}
            <fieldset className='flex flex-wrap items-center justify-center gap-5 sm:gap-10'>
              <legend className='sr-only'>Choose a translation language</legend>

              <label className='cursor-pointer' title='French'>
                <input
                  type='radio'
                  name='language'
                  value='fr'
                  checked={selectedLanguage === 'fr'}
                  onChange={(event) => setSelectedLanguage(event.target.value)}
                  className='peer sr-only'
                />
                <img
                  src={frFlag}
                  alt='French'
                  className='w-20 rounded-sm border-2 border-slate-400 object-cover shadow-sm transition peer-checked:border-sky-700 peer-checked:ring-4 peer-checked:ring-sky-200 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-200'
                />
              </label>

              <label className='cursor-pointer' title='Spanish'>
                <input
                  type='radio'
                  name='language'
                  value='es'
                  checked={selectedLanguage === 'es'}
                  onChange={(event) => setSelectedLanguage(event.target.value)}
                  className='peer sr-only'
                />
                <img
                  src={spFlag}
                  alt='Spanish'
                  className='w-20 rounded-sm border-2 border-slate-400 object-cover shadow-sm transition peer-checked:border-sky-700 peer-checked:ring-4 peer-checked:ring-sky-200 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-200'
                />
              </label>

              <label className='cursor-pointer' title='japan'>
                <input
                  type='radio'
                  name='language'
                  value='ja'
                  checked={selectedLanguage === 'ja'}
                  onChange={(event) => setSelectedLanguage(event.target.value)}
                  className='peer sr-only'
                />
                <img
                  src={jpnFlag}
                  alt='Japanese'
                  className='w-20 rounded-sm border-2 border-slate-400 object-contain shadow-sm transition peer-checked:border-sky-700 peer-checked:ring-4 peer-checked:ring-sky-200 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-200'
                />
              </label>
            </fieldset>
          </div>
        </form>
      </main>
    </>
  )
}

export default App
