import React from 'react'
import { useTranslation, Language } from '../contexts/TranslationContext'
import './LanguageSwitcher.css'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation()

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value as Language)
  }

  return (
    <div className="language-switcher">
      <label htmlFor="language-select" className="language-label">
        {t('ui.language')}
      </label>
      <select
        id="language-select"
        className="language-select"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="en">{t('ui.english')}</option>
        <option value="ru">{t('ui.russian')}</option>
      </select>
    </div>
  )
}