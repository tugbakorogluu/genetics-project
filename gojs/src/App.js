import React, { useEffect } from 'react';
import Genogram from './components/Genogram.js';
import Explain from './components/Explain.js';
import './App.css';

  const genoData = [
    //Merkez Kişi
    {"key": 0, "n": "Ayşe", "s": "F", "m": -1, "f": -2, "vir": 1, "a": []},

    //Ebeveynler
    {"key": -1, "n": "Fatma", "s": "F", "m": -21, "f": -22, "ux": -2, "a": []},
    {"key": -2, "n": "Ali", "s": "M", "m": -23, "f": -24, "ux": -1, "a": ["H"]},

   //Büyükanne/Büyükbabalar
    {"key": -21, "n": "Zehra", "s": "F", "vir": -22, "a": ["C"]},
    {"key": -22, "n": "Ahmet", "s": "M", "ux": -21, "a": ["M"]},
    {"key": -23, "n": "Hatice", "s": "F", "vir": -24, "a": []},
    {"key": -24, "n": "Mehmet", "s": "M", "ux": -23, "a": ["S"]},

    // Teyzeler/Amcalar
    {"key": -3, "n": "Aysel", "s": "F", "m": -21, "f": -22, "ux": 1000, "a": ["C"]},
    {"key": 1000, "n": "Hasan", "s": "M", "vir": -3, "a": []},
    {"key": -5, "n": "Mustafa", "s": "M", "m": -23, "f": -24, "ux": 2000, "a": ["H"]},
    {"key": 2000, "n": "Fatma", "s": "F", "vir": -5, "a": []},

    // Kardeşler
    {"key": 2, "n": "Zeynep", "s": "F", "m": -1, "f": -2, "a": ["I"]},
    {"key": 3, "n": "Murat", "s": "M", "m": -1, "f": -2, "ux": 3000, "a": []},
    {"key": 4, "n": "Mesut", "s": "M", "m": -1, "f": -2, "a": []},
    {"key": 3000, "n": "Merve", "s": "F", "vir": 3, "a": []},

    // Yeğenler
    {"key": 5, "n": "Sude", "s": "F", "vir": 4000, "m": 2, "f": 4000, "a": []},
    {"key": 4000, "n": "Mehmet", "s": "M", "ux": 2, "a": []},
    {"key": 6, "n": "Aslı", "s": "F", "m": -5, "f": 2000, "a": []},
    {"key": 7, "n": "Ali", "s": "M", "m": -3, "f": 1000, "a": []},

    // Çocuklar
    {"key": 8, "n": "Elif", "s": "F", "m": 0, "f": 1, "a": []},
    {"key": 9, "n": "Düşük", "s": "N", "m": 0, "f": 1, "a": []}
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
