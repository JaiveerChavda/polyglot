import { useState } from 'react'
import spFlag from './assets/sp-flag.png';
import jpnFlag from './assets/jpn-flag.png'
import frFlag from './assets/fr-flag.png';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className='m-6 p-4 rounded-2xl outline-4 outline-slate-700'>
        <form className='space-y-6 max-w-md mx-auto'>

          {/* source text */}
          <label htmlFor="source-text" className='block font-bold text-xl text-sky-800 text-center'>Text to translate 👇</label>
          <textarea id='source-text' name='source-text' className='bg-gray-200 placeholder:text-nuetral-800 w-full rounded-lg placeholder:font-poppins font-semibold placeholder:text-xl p-5'
            rows={5}
            placeholder='How are you?'>
          </textarea>

          {/* select language */}
          <fieldset>
            <legend className='font-bold text-xl text-sky-800 text-center mb-6'>Select language</legend>
            <div className='space-y-1 font-bold text-xl'>
              <div className='flex'>
                <input type="radio" id="french" name="language" value="fr" checked/>
                  <label className='ml-2 flex items-center gap-3' htmlFor="french">French <img src={frFlag} alt='french flag'/> 
                  </label>
              </div>

              <div className='flex'>
                <input type="radio" id="spanish" name="language" value="es"/>
                  <label className='ml-2 flex items-center gap-3' htmlFor="spanish">Spanish <img src={spFlag} alt="spanish flag" /></label>
              </div>

              <div className='flex'>
                <input type="radio" id="japanese" name="language" value="ja"/>
                  <label className='ml-2 flex items-center gap-3' htmlFor="japanese">Japanese <img src={jpnFlag} alt="japanese flag" /></label>
              </div>
            </div>
          </fieldset>
          <button type='submit' className='font-bold text-xl bg-sky-800 text-white mx-auto block w-80 py-3 rounded-md'>Translate</button>
        </form>
      </main>
    </>
  )
}

export default App
