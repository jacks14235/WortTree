import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { TreeNode } from '../logic/tree';
import { useScreenSize } from '../logic/screensize';
import { useWidth, useHeight } from '../logic/utility-hooks';
import BackIcon from '../images/arrow_back_black_24dp.svg';
import { roots } from '../logic/roots';

type stop = [number, number, string, string]
// const colors = { a: '#ff0000', b: '#ff1000', c: '#ff2100', d: '#ff3100', e: '#ff4100', f: '#ff5200', g: '#ff6200', h: '#ff7200', i: '#ff8300', j: '#ff9300', k: '#ffa300', l: '#ffb400', m: '#ffc400', n: '#ffd400', o: '#ffe500', p: '#fff500', q: '#f8ff00', r: '#e8ff00', s: '#d8ff00', t: '#c7ff00', u: '#b7ff00', v: '#a7ff00', w: '#96ff00', x: '#86ff00', y: '#76ff00', z: '#65ff00' }
const colors = new Map([['a', '#ff0000'], ['b', '#ff3b00'], ['c', '#ff7600'], ['d', '#ffb100'], ['e', '#ffeb00'], ['f', '#d8ff00'], ['g', '#9dff00'], ['h', '#62ff00'], ['i', '#27ff00'], ['j', '#00ff14'], ['k', '#00ff4e'], ['l', '#00ff89'], ['m', '#00ffc4'], ['n', '#00ffff'], ['o', '#00c4ff'], ['p', '#0089ff'], ['q', '#004eff'], ['r', '#0014ff'], ['s', '#2700ff'], ['t', '#6200ff'], ['u', '#9d00ff'], ['v', '#d800ff'], ['w', '#ff00eb'], ['x', '#ff00b1'], ['y', '#ff0076'], ['z', '#ff003b']])

function HoverThing(props: { node?: TreeNode }) {
  const [mousePosition, setMousePosition] = useState<number[]>([0, 0]);
  useLayoutEffect(() => {
    window.addEventListener('mousemove', (e) => setMousePosition([e.pageX, e.pageY]))
  }, [])

  return (
    props.node ?
      (
        <div className='absolute pointer-events-none h-14 text-j rounded-md bg-gray-800 border-2 border-f z-40 flex flex-col items-center px-2' style={{ left: mousePosition[0] + 17, top: mousePosition[1] - 50 }}>
          <p>{props.node?.fullString()}</p>
          <p>{props.node?.count + (props.node.count == 1 ? ' child' : ' children')}</p>
        </div>
      ) : (
        <div />
      )
  )
}

function RootModal(props: {root: string, data: [string, string], close: () => void}) {
  return (
    <div className='absolute flex justify-center items-center top-0 z-10 w-screen h-screen' style={{backgroundColor: '#FFFFFF77'}}>
      <div className='w-72 bg-o rounded-xl text-center pt-2 pb-4 px-4 relative'>
        <button onClick={props.close} className='absolute text-gray-700 hover:bg-gray-200 flex items-center justify-center top-1 font-bold text-lg rounded-full w-6 h-6 bg-gray-300 right-3'>x</button>
        <h3 className='font-bold text-2xl mb-1.5'>
          {props.root}
        </h3>
        <p className='text-xs leading-3'>{props.data[1]}</p>
        <p className='text-base'>{props.data[0]}</p>
      </div>
    </div>
  )
}


interface RingProps {
  tree: TreeNode,
  onClick: (tree: TreeNode) => void,
  onMouseEnter: (tree: TreeNode) => void,
  onMouseLeave: () => void,
  innerR: number,
  outerR: number,
  giantR: number,
  start: number,
  end: number,
  color: number[],
  letter: string
}
function Ring(props: RingProps) {
  const startIn = [props.innerR * Math.cos(props.start), props.innerR * Math.sin(props.start)]
  const endIn = [props.innerR * Math.cos(props.end), props.innerR * Math.sin(props.end)]
  const startOut = [props.outerR * Math.cos(props.start), props.outerR * Math.sin(props.start)]
  const endOut = [props.outerR * Math.cos(props.end), props.outerR * Math.sin(props.end)]
  const color = colors.get(props.letter) || '#000000';//rgbToHex(props.color)
  return (
    <g className='scale-on-hover cursor-pointer'>
      <path
        onClick={() => props.onClick(props.tree)}
        onMouseEnter={() => props.onMouseEnter(props.tree)}
        onMouseLeave={props.onMouseLeave}
        fill={color}
        stroke={color}
        d={`M ${1 * props.giantR + startIn[0]},${1 * props.giantR + startIn[1]}
A ${props.innerR} ${props.innerR} 0 ${props.end - props.start > Math.PI ? '1' : '0'} 1 ${1 * props.giantR + endIn[0]},${1 * props.giantR + endIn[1]}
L ${1 * props.giantR + endOut[0]},${1 * props.giantR + endOut[1]}
A ${props.outerR} ${props.outerR} 0 ${props.end - props.start > Math.PI ? '1' : '0'} 0 ${1 * props.giantR + startOut[0]},${1 * props.giantR + startOut[1]}
`} />
      {props.end - props.start > .05 &&
        <text
          fontSize='10'
          fontWeight='bold'
          className='pointer-events-none '
          fill={'#000000'}
          x={1 * props.giantR + Math.cos(props.start + (props.end - props.start) / 2) * (props.innerR + (props.outerR - props.innerR) / 2)}
          y={1 * props.giantR + Math.sin(props.start + (props.end - props.start) / 2) * (props.innerR + (props.outerR - props.innerR) / 2)}
          dominant-baseline="middle"
          text-anchor="middle"
        >{props.letter}</text>
      }
    </g>
  )
}

export function CircleThing() {
  const width = useWidth();
  const height = useHeight();
  const [radius, setRadius] = useState(0);
  const [rings, setRings] = useState<RingProps[]>([]);
  const [trees, setTrees] = useState<Map<string, TreeNode>>(TreeNode.default());
  const [tree, setTree] = useState<TreeNode>();
  const [hintTree, setHintTree] = useState<TreeNode>();
  const [centerData, setCenterData] = useState<{ s: string, r0: number }>({ s: '', r0: 0 });
  const [rootModal, setRootModal] = useState<{root: string, data: [string, string]} | undefined>();
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(width, height)
    if (document.fullscreenElement) {
      setRadius(Math.min(width, height) / 2);
    } else {
      setRadius(Math.min((height - 216) / 2, width / 2))
    }
  }, [width, height]);

  useEffect(() => {
    if (tree) {
      makeStops(tree);
    }
  }, [tree, radius])

  function toggleFullScreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (svgRef.current) {
        svgRef.current.requestFullscreen();
      }
    }
  }


  function ringStops(tree: TreeNode, r0: number, depth: number, rings: RingProps[], start: number, end: number) {
    const l = (end - start) / tree.children.length;
    let s = start;
    tree.children.forEach((child) => {
      if (child.letter !== '0') {
        ringStops(child, r0, depth + 1, rings, s, s + l);
      }
      s += l;
    })
    const color = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    rings.push({ tree, onClick: () => setTree(tree), onMouseEnter: () => { }, onMouseLeave: () => { }, innerR: Math.sqrt(depth - 1) * r0, outerR: Math.sqrt(depth) * r0, giantR: radius, start, end, color, letter: tree.letter });
  }

  function makeStops(tree: TreeNode) {
    const newRings: RingProps[] = [];
    const max = tree.maxLength();
    const r0 = radius / Math.sqrt(max);

    const childCount = tree.children.length;
    let start = 0;
    const inc = Math.PI * 2 / childCount
    tree.children.forEach((child) => {
      if (child.letter !== '0') {
        ringStops(child, r0, 2, newRings, start, start + inc);
      }
      start += inc;
    })
    setRings(newRings)
    setCenterData({ s: tree.fullString(), r0 })
  }

  function testRead() {
    TreeNode.fromFile(receivedTrees);
  }

  function receivedTrees(trees: Map<string, TreeNode>) {
    setTrees(trees);
  }

  const max = Array.from(trees?.values() || []).map(t => t.count).reduce((max, i) => i > max ? i : max, 0);

  return (
    <div className='w-full flex flex-col items-center'>
      <HoverThing node={hintTree} />
      {rootModal && <RootModal root={rootModal.root} data={rootModal.data} close={() => setRootModal(undefined)} />}
      <p className='text-green-300 mt-4'>{`${Array.from(trees?.values() || []).reduce((sum, tree) => sum + tree.count, 0)} words loaded`}</p>
      <button className='mt-2 bg-gradient-to-r from-m to-o rounded-lg h-8 px-3 transform hover:scale-110 hover:bg-purple-700 transition-all' onClick={testRead}>Load words</button>
      <div className='flex flex-row w-full mt-4 items-center'>
        {Array.from(trees?.keys() || []).map((k) =>
          <button
            onClick={() => setTree(trees?.get(k) || tree)}
            onMouseEnter={() => setHintTree(trees?.get(k))}
            onMouseLeave={() => setHintTree(undefined)}
            style={{ backgroundColor: colors.get(k), height: Math.max(100 * ((trees?.get(k)?.count || 0) / max), 30) + 'px' }}
            className='transform hover:scale-y-125 hover:bg-purple-700 transition-all flex-grow text-black font-bold'>{k}</button>
        )}
      </div>
      <div ref={svgRef} className='relative flex justify-center'>
        <svg style={{ width: radius * 2 + "px", height: radius * 2 + "px" }}>
          <circle cx={radius} cy={radius} r={centerData?.r0} />
          <text
            className={tree?.children.map((child) => child.letter).includes('0') ? 'cursor-pointer hover:underline' : 'cursor-auto'}
            fontSize={radius > 250 ? 30 : 24}
            fill='white'
            textAnchor='center'
            x={radius}
            y={radius}
            dominant-baseline="middle"
            text-anchor="middle"
            onClick={tree?.children.map((child) => child.letter).includes('0') ? () => window.open('https://www.merriam-webster.com/dictionary/' + tree?.fullString(), '_blank')?.focus() : () => { }}
          >
            {centerData.s}
          </text>
          {rings.map((p) => <Ring
            tree={p.tree}
            onClick={(tree) => { setTree(tree); setHintTree(undefined) }}
            onMouseEnter={setHintTree}
            onMouseLeave={() => setHintTree(undefined)}
            innerR={p.innerR}
            outerR={p.outerR - 5}
            giantR={p.giantR}
            start={p.start + .01}
            end={p.end - .01}
            color={p.color}
            letter={p.letter} />)}
        </svg>
        {
          roots.has(tree?.fullString() || '') && <button
          onClick={() => setRootModal({root: tree?.fullString() || 'Error', data: roots.get(tree?.fullString() || '' ) || ['No root selected', '']})}
          className='absolute rounded-full bg-gradient-to-r from-x to-z hover:opacity-80 text-xs px-2 py-1'
          style={{bottom: radius + 25 + 'px'}}
          >
            root
          </button>
        }
        {tree?.parent &&
          <button onClick={() => setTree(tree.parent || tree)}
            className={`bg-gradient-to-r from-b to-d hover:opacity-80 transition-opacity duration-300 rounded-lg px-1 absolute flex justify-center items-center ${radius > 250 ? 'w-8 h-8 mt-4' : 'w-6 h-6 mt-2'}`}
            style={{ top: radius + 10 + 'px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className='m-auto' height={radius > 250 ? "24px" : "16px"} viewBox="0 0 24 24" width={radius > 250 ? "24px" : "16px"} fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
          </button>
        }
        {tree &&
          <button className='absolute top-4 right-4 rounded-full bg-gray-500 hover:bg-gray-300 transition-color duration-300' onClick={toggleFullScreen} >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
          </button>
        }
      </div>
    </div>
  )
}


function rgbToHex(rgb: number[]) {
  return ('#' + pad(rgb[0].toString(16)) + pad(rgb[1].toString(16)) + pad(rgb[2].toString(16)));
}

function invertRGB(rgb: number[]) {
  return (rgb.map((c) => 255 - c));
}

function pad(s: string) {
  if (s.length === 1) {
    return ('0' + s);
  }
  return s;
}