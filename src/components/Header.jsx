import React from 'react'
import parrot from '../assets/parrot.png';
import headerBackground from "../assets/worldmap.png";

function Header() {
    return (
        <header className="min-h-48 bg-cover bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${headerBackground})` }}
        >
            <div className='flex justify-center items-center h-full gap-4'>
                <img src={parrot} className='size-24' alt="parrot" />
                <div className='space-y-2'>
                    <h1 className='text-green-400 font-display font-extrabold text-5xl'>PollyGlot</h1>
                    <p className='text-white text-sm font-semibold font-poppins'>Perfect Translation Every Time</p>
                </div>
            </div>
        </header>
    )
}

export default Header