import { useState } from 'react'
import spFlag from './assets/sp-flag.png';
import jpnFlag from './assets/jpn-flag.png'
import frFlag from './assets/fr-flag.png';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

function App() {
  const [isTranslated, setIsTranslated] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [translation, setTranslation] = useState('...');
  const [loading,setLoading] = useState(false);

  const translate = async () => {

    setLoading(true);

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
      setTranslation(data.translation);
      setIsTranslated(true);
    } catch(error){
      console.error(error);
    } 
    finally {
      setLoading(false);
    }
  }

  const startOver = () => {
    setIsTranslated(false);
    setSourceText('');
    setTranslation('');
    setSelectedLanguage('fr');
  }

  return (
    <>
      <main className='m-6 p-4 rounded-2xl outline-4 outline-slate-700'>
        <form
          className='flex flex-col space-y-6 max-w-md mx-auto'
          style={{
            minHeight: '100%'
          }
          }
          onSubmit={(e) => {
            e.preventDefault();
            if(isTranslated){
              startOver()
            }else{
              translate()
            }
          }}
        >

          {/* Note */}
 
          <div className='bg-sky-800 rounded-lg font-medium text-xl text-white p-4'>
            Select the language you 
            me to translate into, type your text and hit send!
          </div>

          {/* {user role} */}
          <div className='font-poppins text-xl font-medium p-4 bg-green-400 rounded-r-xl rounded-bl-xl'>
            How are you?
          </div>

          {/* system */}
          <div className='font-poppins text-xl font-medium text-white p-4 bg-sky-800 rounded-l-xl rounded-br-xl'>
            Comment allez-vous?
          </div>

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
              />

              <button
                type='submit'
                disabled={loading || !sourceText.trim()}
                aria-label={isTranslated ? 'Start over' : 'Translate text'}
                className='absolute bottom-5 right-5 rounded-lg p-1 text-green-500 transition hover:scale-110 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-40'
              >
                <PaperAirplaneIcon className='size-8 -rotate-45 stroke-2' />
              </button>
            </div>

            <fieldset className='flex flex-wrap items-center justify-center gap-5 sm:gap-10'>
              <legend className='sr-only'>Choose a translation language</legend>

              <label className='cursor-pointer'>
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
                  className='w-20 rounded-sm border-2 border-slate-400 object-cover shadow-sm transition peer-checked:border-sky-700 peer-checked:ring-4 peer-checked:ring-sky-200 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-200 sm:w-24'
                />
              </label>

              <label className='cursor-pointer'>
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
                  className='w-20 rounded-sm border-2 border-slate-400 object-cover shadow-sm transition peer-checked:border-sky-700 peer-checked:ring-4 peer-checked:ring-sky-200 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-200 sm:w-24'
                />
              </label>

              <label className='cursor-pointer'>
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
                  className='w-20 rounded-sm border-2 border-slate-400 object-contain shadow-sm transition peer-checked:border-sky-700 peer-checked:ring-4 peer-checked:ring-sky-200 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-200 sm:w-24'
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
