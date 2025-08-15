import React from 'react'
import './AttributeCircles.css'

interface AttributeCirclesProps {
  value: number
  onChange: (value: number) => void
  label: string
}

export const AttributeCircles: React.FC<AttributeCirclesProps> = ({
  value,
  onChange,
  label
}) => {
  const handleCircleClick = (clickedIndex: number) => {
    // If clicking on the last filled circle, decrease by 1 (can go to 0)
    // If clicking on an empty circle, set value to that position + 1
    const newValue = clickedIndex < value ? clickedIndex : clickedIndex + 1
    onChange(newValue)
  }

  return (
    <div className="attribute-circles">
      <label className="attribute-circles-label">{label}</label>
      <div className="circles-container">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            className={`circle ${index < value ? 'filled' : 'hollow'}`}
            onClick={() => handleCircleClick(index)}
            aria-label={`Set ${label} to ${index + 1}`}
          >
            {index < value ? '●' : '○'}
          </button>
        ))}
      </div>
    </div>
  )
}