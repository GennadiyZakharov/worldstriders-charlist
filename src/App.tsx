import { useState, useEffect } from 'react'
import './App.css'
import { TranslationProvider, useTranslation } from './contexts/TranslationContext'
import { LanguageSwitcher } from './components/LanguageSwitcher'

interface Attributes {
  intelligence: number
  comprehension: number
  resoluteness: number
  magic: number
  luck: number
  bodyControl: number
  impressiveness: number
  manipulation: number
  poise: number
}

function CharacterForm() {
  const { t } = useTranslation()
  const [characterName, setCharacterName] = useState<string>('')
  const [attributes, setAttributes] = useState<Attributes>({
    intelligence: 1,
    comprehension: 1,
    resoluteness: 1,
    magic: 1,
    luck: 1,
    bodyControl: 1,
    impressiveness: 1,
    manipulation: 1,
    poise: 1,
  })

  // Load character name from localStorage on component mount
  useEffect(() => {
    const savedName = localStorage.getItem('worldstriders-character-name')
    if (savedName) {
      setCharacterName(savedName)
    }
  }, [])

  // Load attributes from localStorage on component mount
  useEffect(() => {
    const savedAttributes = localStorage.getItem('worldstriders-character-attributes')
    if (savedAttributes) {
      try {
        const parsedAttributes = JSON.parse(savedAttributes)
        setAttributes(parsedAttributes)
      } catch (error) {
        console.error('Failed to parse saved attributes:', error)
      }
    }
  }, [])

  // Save character name to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('worldstriders-character-name', characterName)
  }, [characterName])

  // Save attributes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('worldstriders-character-attributes', JSON.stringify(attributes))
  }, [attributes])

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value)
  }

  const handleAttributeChange = (attribute: keyof Attributes, value: number) => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: Math.max(1, Math.min(5, value))
    }))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </header>
      
      <main className="app-main">
        <div className="character-name-section">
          <label htmlFor="character-name" className="character-name-label">
            {t('character.nameLabel')}
          </label>
          <input
            id="character-name"
            type="text"
            className="character-name-input"
            value={characterName}
            onChange={handleNameChange}
            placeholder={t('character.namePlaceholder')}
            autoFocus
          />
        </div>

        <div className="attributes-section">
          <h2 className="attributes-title">{t('attributes.title')}</h2>
          <div className="attributes-grid">
            <div className="attributes-column">
              <div className="attribute-item">
                <label htmlFor="intelligence" className="attribute-label">{t('attributes.intelligence')}</label>
                <input
                  id="intelligence"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.intelligence}
                  onChange={(e) => handleAttributeChange('intelligence', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="attribute-item">
                <label htmlFor="comprehension" className="attribute-label">{t('attributes.comprehension')}</label>
                <input
                  id="comprehension"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.comprehension}
                  onChange={(e) => handleAttributeChange('comprehension', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="attribute-item">
                <label htmlFor="resoluteness" className="attribute-label">{t('attributes.resoluteness')}</label>
                <input
                  id="resoluteness"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.resoluteness}
                  onChange={(e) => handleAttributeChange('resoluteness', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="attributes-column">
              <div className="attribute-item">
                <label htmlFor="magic" className="attribute-label">{t('attributes.magic')}</label>
                <input
                  id="magic"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.magic}
                  onChange={(e) => handleAttributeChange('magic', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="attribute-item">
                <label htmlFor="luck" className="attribute-label">{t('attributes.luck')}</label>
                <input
                  id="luck"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.luck}
                  onChange={(e) => handleAttributeChange('luck', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="attribute-item">
                <label htmlFor="bodyControl" className="attribute-label">{t('attributes.bodyControl')}</label>
                <input
                  id="bodyControl"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.bodyControl}
                  onChange={(e) => handleAttributeChange('bodyControl', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>

            <div className="attributes-column">
              <div className="attribute-item">
                <label htmlFor="impressiveness" className="attribute-label">{t('attributes.impressiveness')}</label>
                <input
                  id="impressiveness"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.impressiveness}
                  onChange={(e) => handleAttributeChange('impressiveness', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="attribute-item">
                <label htmlFor="manipulation" className="attribute-label">{t('attributes.manipulation')}</label>
                <input
                  id="manipulation"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.manipulation}
                  onChange={(e) => handleAttributeChange('manipulation', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="attribute-item">
                <label htmlFor="poise" className="attribute-label">{t('attributes.poise')}</label>
                <input
                  id="poise"
                  type="number"
                  min="1"
                  max="5"
                  className="attribute-input"
                  value={attributes.poise}
                  onChange={(e) => handleAttributeChange('poise', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <TranslationProvider>
      <CharacterForm />
    </TranslationProvider>
  )
}

export default App