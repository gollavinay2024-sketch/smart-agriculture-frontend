import React from 'react';
import { Wheat, Carrot, Trees, Sprout, Apple, Flower2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CROPS = [
  { id: 'Rice', key: 'crops.rice', icon: Sprout, color: '#16a34a' },
  { id: 'Wheat', key: 'crops.wheat', icon: Wheat, color: '#ca8a04' },
  { id: 'Cotton', key: 'crops.cotton', icon: Flower2, color: '#0284c7' },
  { id: 'Maize', key: 'crops.maize', icon: Trees, color: '#eab308' },
  { id: 'Vegetables', key: 'crops.vegetables', icon: Carrot, color: '#ea580c' },
  { id: 'Pulses', key: 'crops.pulses', icon: Apple, color: '#9333ea' }
];

export default function CropSelector({ selectedCrop, onSelect }) {
  const { t } = useApp();

  return (
    <div>
      <div className="crop-grid">
        {CROPS.map((crop) => {
          const Icon = crop.icon;
          const isSelected = selectedCrop === crop.id;
          return (
            <button
              key={crop.id}
              type="button"
              className={`crop-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(crop.id)}
            >
              <div
                className="crop-card-icon"
                style={isSelected ? { background: crop.color, color: '#ffffff' } : { color: crop.color }}
              >
                <Icon size={24} />
              </div>
              <span className="crop-card-name">{t(crop.key)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
