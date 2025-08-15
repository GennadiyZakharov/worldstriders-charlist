import { useState, useEffect } from 'react'
import './App.css'
import { TranslationProvider, useTranslation } from './contexts/TranslationContext'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { AttributeCircles } from './components/AttributeCircles'

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
    intelligence: 0,
    comprehension: 0,
    resoluteness: 0,
    magic: 0,
    luck: 0,
    bodyControl: 0,
    impressiveness: 0,
    manipulation: 0,
    poise: 0,
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
      [attribute]: Math.max(0, Math.min(5, value))
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
                <AttributeCircles
                  value={attributes.intelligence}
                  onChange={(value) => handleAttributeChange('intelligence', value)}
                  label={t('attributes.intelligence')}
                />
              </div>
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.comprehension}
                  onChange={(value) => handleAttributeChange('comprehension', value)}
                  label={t('attributes.comprehension')}
                />
              </div>
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.resoluteness}
                  onChange={(value) => handleAttributeChange('resoluteness', value)}
                  label={t('attributes.resoluteness')}
                />
              </div>
            </div>

            <div className="attributes-column">
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.magic}
                  onChange={(value) => handleAttributeChange('magic', value)}
                  label={t('attributes.magic')}
                />
              </div>
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.luck}
                  onChange={(value) => handleAttributeChange('luck', value)}
                  label={t('attributes.luck')}
                />
              </div>
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.bodyControl}
                  onChange={(value) => handleAttributeChange('bodyControl', value)}
                  label={t('attributes.bodyControl')}
                />
              </div>
            </div>

            <div className="attributes-column">
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.impressiveness}
                  onChange={(value) => handleAttributeChange('impressiveness', value)}
                  label={t('attributes.impressiveness')}
                />
              </div>
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.manipulation}
                  onChange={(value) => handleAttributeChange('manipulation', value)}
                  label={t('attributes.manipulation')}
                />
              </div>
              <div className="attribute-item">
                <AttributeCircles
                  value={attributes.poise}
                  onChange={(value) => handleAttributeChange('poise', value)}
                  label={t('attributes.poise')}
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