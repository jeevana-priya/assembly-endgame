import {useState } from 'react';
import './App.css';
import { word } from './word';
import { languages } from './languages';
import { getFarewellText } from './util';




function App() {

  const getrandWord = () => word[Math.floor(Math.random() * word.length)]
  const [words, setWords] = useState(() => getrandWord());
  const [dashedLines, setdashedLines] = useState('_ '.repeat(words.length))
  const [gussedLetters, setGussedLetters] = useState([])
  const [isgamewon, setIsGamewon] = useState(false)
  const[gameOver, setgameOver]= useState(false)
 
  const [failedGuess, setFailedGuess]=useState([]);
  const [farewellMessage, setFarewellMessage]= useState('')
   
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const isNewgame = () => {
    const newWord = getrandWord();
    setWords(newWord);
    setdashedLines('_ '.repeat(newWord.length));
    setGussedLetters([]);
    setIsGamewon(false)
    setFailedGuess([]);
    setgameOver(false);
    setFarewellMessage('');

  }
 
  const handleGussedLetter = (letter) => {
    if (gussedLetters.includes(letter)) return;
    setGussedLetters((prevLetters) => [...prevLetters, letter]);
    if (words.includes(letter)) {
      const updatedLines = dashedLines.split(' ').map((dash, idx) =>
        words[idx] === letter ? letter : dash
      )
      const newDashedLines = updatedLines.join(' ')
      setdashedLines(newDashedLines)

      if (newDashedLines.replace(/ /g, '') === words) {
        setIsGamewon(true);
      }
    } else {
       setFailedGuess((prevFailed) => {
        const remainingLanguages = languages.filter(language => !prevFailed.includes(language.name));
        if (remainingLanguages.length > 0) {
          const struckLanguage =remainingLanguages[0].name;
          setFarewellMessage(getFarewellText(struckLanguage))
          return [...prevFailed, struckLanguage]
        }
        setgameOver(true);
        setdashedLines(words); 
        return prevFailed;
      });
    }
 
  };

  const getButtonClass = (letter) => {
    if (gussedLetters.includes(letter)) {
      return words.includes(letter) ? 'correct' : 'incorrect';
    }
    return '';
  };
    
  return (
    <>
      <div className='app'>
        <header className='header'>
          <h1>Assembly: Endgame</h1>
          <p>Guess the word in under 8 attempts to keep the</p>
          <p>programming word safe from Assembly!
          </p>
        </header>
        <main>
          
          {isgamewon && <div className='gamewon'>
            <h2>You Win!</h2>
            <h3>Well done!🎉</h3>
          </div>
          }
            {farewellMessage && !gameOver && <div className="farewell-message">{farewellMessage}</div>}
          { gameOver && <div className="farewell-message">
            <h2>Game over!</h2>
          <p>you lose! Better start learning Assembly 😭</p></div>}
          {languages.map((language) => (
          <button 
            key={language.name}
            style={{
              position:'relative',
              color: failedGuess.includes(language.name) ? '#888' : language.color,
              backgroundColor: language.backgroundColor,
              
              padding: '10px 20px',
            }}
            disabled = {failedGuess.includes(language.name)}
          >
  
            {language.name}
            {failedGuess.includes(language.name)&&(<span className='skull'>💀</span>)}
          </button>
        ))}
          <p>{dashedLines}</p>
          <div className='keyboard'>
  {alphabet.map((letter) => (
    <button
      key={letter}
      className={`key ${getButtonClass(letter)}`}
      onClick={() => handleGussedLetter(letter)}
      disabled={gussedLetters.includes(letter)}
    >
      {letter.toUpperCase()}
    </button>
  ))}
</div>

          {(isgamewon || gameOver) && <button  className="newGame"onClick={isNewgame}>New game</button>}





        </main>
      </div>
    </>
  );
}

export default App;
