import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [characterName, setCharacterName] = useState<string>('')

  // Load character name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('worldstriders-character-name')
    if (savedName) {
      setCharacterName(savedName)
    }
  }, [])

  // Save character name to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('worldstriders-character-name', characterName)
  }, [characterName])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Worldstriders Character List</h1>
      </header>
      
      <main className="app-main">
        <div className="character-name-section">
          <label htmlFor="character-name" className="character-name-label">
            Character Name:
          </label>
          <input
            id="character-name"
            type="text"
            className="character-name-input"
            value={characterName}
            onChange={handleNameChange}
            placeholder="Enter your character's name"
            autoFocus
          />
        </div>
      </main>
    </div>
  )
}

export default App