import React, { useRef, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import languages from '../data/languages.json';

function App() {
  const [sourceText, setSourceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [loading,setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error,setError] = useState(null);
  const languageRowRef = useRef(null);

  const scrollLanguages = (direction) => {
    languageRowRef.current?.scrollBy({
      left: direction * 220,
      behavior: 'smooth',
    });
  };

  const translate = async () => {

    setLoading(true);
    setError(null);
    setSourceText('');
    const userMessage = {
      role: 'user',
      content: sourceText
    };

    // append user message
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = await fetch('/api/translate', {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ sourceText, selectedLanguage })
      });

      if (!response.ok) {
        let errorMessage = 'The translation request failed.';

        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // The server may be down or may have returned a non-JSON error page.
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'system',
        content: data.translation
      }]);

    } catch(error){
      console.error(error);
      setError(
        error instanceof TypeError
          ? 'Unable to reach the translation server. Please try again.'
          : error.message || 'Something went wrong while translating.'
      );
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
          style={{minHeight: '100%'}}
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

          {error && <div className='border-dotted border-2 border-red-500 rounded-lg text-red-500 p-4 mb-6'>
              {error}
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
            <div className='relative mt-6 flex items-center gap-1'>
              <button
                type='button'
                onClick={() => scrollLanguages(-1)}
                aria-label='Scroll languages left'
                className='shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200'
              >
                <ChevronLeftIcon className='size-5' />
              </button>

              <div ref={languageRowRef} className='min-w-0 flex-1 overflow-x-auto scroll-smooth'>
                <fieldset className='flex w-max min-w-full items-center justify-start gap-5 px-2 py-4 sm:gap-10'>
                  <legend className='sr-only'>Choose a translation language</legend>

                  {Object.entries(languages).map(([code,name]) => (
                    <label key={code} className='shrink-0 cursor-pointer rounded-lg border-2 px-3 py-1 border-slate-400 shadow-sm transition peer-checked:border-sky-700 peer-checked:ring-4 peer-checked:ring-sky-200 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-200' title={name}>
                      <input
                        type='radio'
                        name='language'
                        value={code}
                        checked={selectedLanguage === code}
                        onChange={(event) => setSelectedLanguage(event.target.value)}
                        className='peer sr-only'
                      />
                      <span className=''>
                        {name}
                      </span>
                    </label>
                  ))}

                  {/* <label className='cursor-pointer' title='Spanish'>
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
                  </label> */}
                </fieldset>
              </div>

              <button
                type='button'
                onClick={() => scrollLanguages(1)}
                aria-label='Scroll languages right'
                className='shrink-0 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-200'
              >
                <ChevronRightIcon className='size-5' />
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  )
}

export default App
