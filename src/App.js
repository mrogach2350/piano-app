import React, { useEffect, useState } from 'react';
import Tone from 'tone'
import './App.css';

const keyLocationMap = {
  'a': 0,
  's': 1,
  'd': 2,
  'f': 3,
  'g': 4,
  'h': 5,
  'j': 6,
  'k': 7,
  'l': 8,
  ';': 9,
  "'": 10,
}

const buildKeyboard = () => {
  let final = {}
  let letters = ['C' , 'D', 'E', 'F', 'G', 'A', 'B']
  let count = 0
  for (let i = 1; i < 9 ; i ++) {
    letters.forEach(letter => {
      final[count] = `${letter}${i}`
      count++
    })
  }
  return final
}

function App() {
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress, false)
    window.addEventListener('keyup', handleKeyUp, false)
   
    return function cleanup() {
      window.removeEventListener('keydown')
    }
  }, [])

  const [modifier, setModifier] = useState(0)

  // Tone.Synth is a basic synthesizer with a single oscillator
  const synth = new Tone.Synth();
  // Set the tone to sine
  synth.oscillator.type = "sine";
  // connect it to the master output (your speakers)
  synth.toMaster();
  const notes = buildKeyboard()
  const middleCIndex = parseInt(Object.keys(notes).find(i => notes[i] === 'C4'))
  const homeStart = (middleCIndex - 4) + modifier
  const homeEnd = (middleCIndex + 7) + modifier
  const homerow = Object.values(notes).slice(homeStart, homeEnd)
  
  const handleKeyPress = (event) => {
    const { key, code } = event
    const SHIFT_LEFT = 'ShiftLeft'
    const SHIFT_RIGHT = 'ShiftRight'
    if (Object.keys(keyLocationMap).includes(key)) {
      const note = homerow[keyLocationMap[key]]
      synth.triggerAttack(note);
    }
    
    if (code === SHIFT_LEFT) {
      setModifier(modifier - 11)
    } else if (code === SHIFT_RIGHT) {
      setModifier(modifier + 11)
    }
  }

  const handleKeyUp = (event) => {
    const { key } = event
    if (Object.keys(keyLocationMap).includes(key)) {
      synth.triggerRelease();
    }
  }
  
  return (
    <div className="App">
      <ul id="piano">
        {homerow.map((note, idx) => (
          <li 
            className={"key"} 
            key={note} 
            value={{ note, idx }}
          >
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
