import { useState } from 'react'
import spFlag from './assets/sp-flag.png';
import jpnFlag from './assets/jpn-flag.png'
import frFlag from './assets/fr-flag.png';


function App() {
  const [isTranslated, setIsTranslated] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const translate = async () => {

    const nextIsTranslated = !isTranslated;

    setIsTranslated(nextIsTranslated);

    const response = await fetch('http://localhost:3000/translate', {
      headers: {
        "Content-Type": "application/json" // 2. Set the content type
      },
      method: "POST",
      body: JSON.stringify({ sourceText })
    });

    const data = await response.json();

    console.log(data);

    // you're logic here
    /**
     * translate the user supplied source to selected language using openAI client. 
     */
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
            translate()
          }}
        >

          {/* source text */}
          <label htmlFor="source-text" className='block font-bold text-xl text-sky-800 text-center'>{!isTranslated ? 'Text to translate 👇' : 'Original text'}</label>
          <textarea id='source-text' name='source-text' className='bg-gray-200 placeholder:text-nuetral-800 w-full rounded-lg placeholder:font-poppins font-semibold placeholder:text-xl p-5'
            rows={5}
            placeholder='How are you?'
            onChange={(e) => setSourceText(e.target.value)}
          >
          </textarea>

          {isTranslated && <h3 className='font-bold text-xl text-sky-800 text-center'>Your translation 👇</h3>}

          {/* select language */}
          {!isTranslated &&
            <fieldset>
              <legend className='font-bold text-xl text-sky-800 text-center mb-6'>Select language</legend>
              <div className='space-y-1 font-bold text-xl'>
                <div className='flex'>
                  <input type="radio" id="french" name="language" value="fr"
                    checked={selectedLanguage === 'fr'}
                    onChange={(event) => setSelectedLanguage(event.target.value)}
                  />
                  <label className='ml-2 flex items-center gap-3' htmlFor="french">French <img src={frFlag} alt='french flag' />
                  </label>
                </div>

                <div className='flex'>
                  <input type="radio" id="spanish" name="language" value="es"
                    checked={selectedLanguage === 'es'}
                    onChange={(event) => setSelectedLanguage(event.target.value)}
                  />
                  <label className='ml-2 flex items-center gap-3' htmlFor="spanish">Spanish <img src={spFlag} alt="spanish flag" /></label>
                </div>

                <div className='flex'>
                  <input type="radio" id="japanese" name="language" value="ja"
                    checked={selectedLanguage === 'ja'}
                    onChange={(event) => setSelectedLanguage(event.target.value)}
                  />
                  <label className='ml-2 flex items-center gap-3' htmlFor="japanese">Japanese <img src={jpnFlag} alt="japanese flag" /></label>
                </div>
              </div>
            </fieldset>
          }

          {isTranslated && <div id='translated_text' className='flex-1 bg-gray-200 p-5 text-xl font-semibold text-neutral-800 rounded-lg font-poppins'>
            Comment allez-vous?
          </div>
          }

          <button type='submit'
            className='font-bold text-xl bg-sky-800 text-white mx-auto block w-80 py-3 rounded-md cursor-pointer'
          >
            {isTranslated ? 'Start Over' : 'Translate'}
          </button>
        </form>
      </main>
    </>
  )
}

export default App
