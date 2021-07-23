import { useState, useEffect } from 'react';


export function useScreenSize() {
  const [useScreenSize, setSize] = useState<{innerWidth: number, innerHeight: number}>({innerWidth: 0, innerHeight: 0});

  useEffect(() => {
    window.addEventListener('resize', () => setSize({innerWidth: window.innerWidth, innerHeight: window.innerHeight}));
    return () => window.removeEventListener('resize', () => setSize({innerWidth: window.innerWidth, innerHeight: window.innerHeight}))
  })
  

  // function setSizes() {
  //   setSize({innerWidth: window.innerWidth, innerHeight: window.innerHeight})
  // }

  return useScreenSize;
}