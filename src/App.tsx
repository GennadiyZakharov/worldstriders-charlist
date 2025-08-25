// import { useState } from 'react'
import './App.css'
import { TranslationProvider, useTranslation } from './contexts/TranslationContext'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { AttributeCircles } from './components/AttributeCircles'
import useLocalStorage from './hooks/useLocalStorage'
import { STORAGE_KEYS, ATTRIBUTE_CONSTRAINTS } from './constants'

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
  const [characterName, setCharacterName] = useLocalStorage<string>(STORAGE_KEYS.CHARACTER_NAME, '')
  const [attributes, setAttributes] = useLocalStorage<Attributes>(STORAGE_KEYS.CHARACTER_ATTRIBUTES, {
    intelligence: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    comprehension: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    resoluteness: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    magic: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    luck: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    bodyControl: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    impressiveness: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    manipulation: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
    poise: ATTRIBUTE_CONSTRAINTS.DEFAULT_VALUE,
  })

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(event.target.value)
  }

  const handleAttributeChange = (attribute: keyof Attributes, value: number) => {
    setAttributes(prev => ({
      ...prev,
      [attribute]: Math.max(ATTRIBUTE_CONSTRAINTS.MIN_VALUE, Math.min(ATTRIBUTE_CONSTRAINTS.MAX_VALUE, value))
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