import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { CircleThing } from './components/circle'

function App() {
  const [instructions, setInstructions] = useState<boolean>(false);
  useEffect(() => {
    if (!localStorage.getItem('instructions')) {
      setInstructions(true);
      localStorage.setItem('instructions', 'done');
    }
  }, [])

  return (
    <div >
      <CircleThing />
      <div className='absolute bottom-0 w-full flex flex-row justify-around items-end mb-3 text-sm'>
        <p className='hover:underline text-j cursor-pointer' onClick={() => setInstructions(true)}>Instructions</p>
        <a className='hover:underline text-s' href='https://jackstanley.stanley5.com' target='_blank'>My Website</a>
      </div>
      {instructions &&
      <div className='absolute w-screen top-0 h-screen bg-black opacity-100 flex justify-center items-center'>
        <div className='w-96 p-8 pl-12 flex flex-col items-center'>
          <h2 className='text-l font-bold text-center text-2xl mb-7'>Instructions</h2>
          <ul className='text-white font-semibold list-disc'>
            <li className='mb-2'>Click a starting letter from the graph at the top</li>
            <li className='mb-2'>Click on slices within the loaded circle to the unique graph for that series of letters</li>
            <li className='mb-2'>Click a finished word to see its definition</li>
            <li className='mb-2'>Use the "Load Words" button to load a custom list of words from a text file separated by new lines or commas</li>
            <li className='mb-2'>Remember to check out <a className='underline' href='https://jackstanley.stanley5.com' target='_blank'>my website</a> to see more of my work!</li>
          </ul>
          <button onClick={() => setInstructions(false)} className='bg-gradient-to-r from-k to-n rounded-lg my-8 py-1 px-3 font-semibold hover:opacity-50 transition-opacity duration-300'>Let's Go!</button>
        </div>
        </div>
      }
    </div>
  );
}

export default App;
