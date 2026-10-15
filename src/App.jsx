import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section className=''>
        <div>
          <h1 className='text-2xl'>Get started</h1>
          <p className='text-red-500'>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
    </>
  )
}

export default App
