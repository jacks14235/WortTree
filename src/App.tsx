import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { CircleThing } from './components/circle'

function App() {
  const [instructions, setInstructions] = useState<boolean>(false);
  const [links, setLinks] = useState<boolean>(false);
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
        <p className='hover:underline text-c cursor-pointer' onClick={() => setLinks(true)}>Links</p>
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

      {links &&
        <div className='absolute w-screen top-0 h-screen bg-black opacity-100 flex justify-center items-center'>
          <div className='w-96 p-8 pl-12 flex flex-col items-center'>
            <h2 className='text-l font-bold text-center text-2xl mb-7'>Links</h2>
            <ul className='text-blue-500 font-semibold list-disc'>
              <li className='mb-2 hover:underline'>
                <a href='https://www.oakton.edu/user/3/gherrera/Greek%20and%20Latin%20Roots%20in%20English/greek_and_latin_roots.pdf' target='_blank'>
                  List of Latin and Greek roots
                </a>
              </li>
              <li className='mb-2 hover:underline'>
                <a href='https://github.com/first20hours/google-10000-english' target='_blank'>
                  Google's list of 10,000 most common english words (default)
                </a>
              </li>
              <p className='text-white text-lg mb-1 mt-4'>More words</p>
              <li className='mb-2 hover:underline'>
                <a href='https://gist.github.com/deekayen/4148741https://gist.github.com/deekayen/4148741' target='_blank'>
                  1,000 most common english words
                </a>
              </li>
              <li className='mb-2 hover:underline'>
                <a href='https://www.mit.edu/~ecprice/wordlist.10000' target='_blank'>
                  MIT's list of 10,000 words
                </a>
              </li>
              <li className='mb-2 hover:underline'>
                <a href='http://www.mieliestronk.com/wordlist.html' target='_blank'>
                  Corncob list of more than 58,000 words
                </a>
              </li>
              <li className='mb-2 hover:underline'>
                <a href='https://github.com/dwyl/english-words/blob/master/words_alpha.txt' target='_blank'>
                  List of more than 370,000 words (lag warning)
                </a>
              </li>

            </ul>
            <button onClick={() => setLinks(false)} className='bg-gradient-to-r from-k to-n rounded-lg my-8 py-1 px-3 font-semibold hover:opacity-50 transition-opacity duration-300'>Done</button>
          </div>
        </div>
      }
    </div>
  );
}

export default App;
