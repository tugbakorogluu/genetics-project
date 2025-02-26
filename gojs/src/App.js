import React, { useEffect } from 'react';
import Genogram from './components/Genogram.js';
import Explain from './components/Explain.js';
import './App.css';

  const genoData = [
    {
        "familyTree": [
          {"key": 0, "n": "Ayşe", "s": "F", "a": [], "m": -1, "f": -2, "vir": 1},
          {"key": 1, "n": "Ahmet", "s": "M", "a": [],  "ux": 0},
          {"key": -1, "n": "Fatma", "s": "F", "a": [], "m": -21, "f": -22, "ux": -2},
          {"key": -2, "n": "Ali", "s": "M", "a": ["H", "S"], "m": -23, "f": -24, "ux": -1},
          {"key": -21, "n": "Zehra", "s": "F", "a": ["C", "S"],  "vir": -22},
          {"key": -22, "n": "Ahmet", "s": "M", "a": ["M", "S"],  "ux": -21},
          {"key": -23, "n": "Hatice", "s": "F", "a": [],   "vir": -24},
          {"key": -24, "n": "Mehmet", "s": "M", "a": ["S"], "ux": -23},
          {"key": 2, "n": "Zeynep", "s": "F", "a": ["I"], "m": -1, "f": -2, "vir": 11},
          {"key": 3, "n": "Murat", "s": "M", "a": [], "m": -1, "f": -2, "ux": 12, "t": "d"},
          {"key": 4, "n": "Mesut", "s": "M", "a": [], "m": -1, "f": -2,  "t": "d"},
          {"key": 5, "n": "Elif", "s": "F", "a": [], "m": 0, "f": 1},
          {"key": 11, "n": "Mehmet", "s": "M", "a": [],   "ux": 2},
          {"key": 12, "n": "Merve", "s": "F", "a": ["H", "S"],   "vir": 3},
          {"key": 13, "n": "Sude", "s": "F", "a": [], "m": 2, "f": 11},
          {"key": 14, "n": "Ahmet", "s": "M", "a": [], "m": 12, "f": 3},
          {"key": -3, "n": "Aysel", "s": "F", "a": ["C"], "m": -21, "f": -22, },
          {"key": -5, "n": "Mustafa", "s": "M", "a": ["H"], "m": -23, "f": -24, },
          {"key": 15, "n": "Ali", "s": "M", "a": [], "m": -3, },
          {"key": 16, "n": "Aslı", "s": "F", "a": [], "m": -5, }
        ]
        }
    
]



const App = () => {
 
    return (
        <div className="App" style={{marginTop: '-70px'}}>
            <Explain />
            <Genogram Genogram={genoData} />
        </div>
    )
}

export default App;
