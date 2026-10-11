import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RiskBadge({ riskLevel, size = 'normal' }) {
  const { t } = useApp();
  const level = (riskLevel || 'UNKNOWN').toUpperCase();

  const getIcon = () => {
    switch (level) {
      case 'HIGH':
        return <AlertTriangle size={size === 'large' ? 24 : 18} />;
      case 'MEDIUM':
        return <AlertCircle size={size === 'large' ? 24 : 18} />;
      case 'LOW':
        return <CheckCircle2 size={size === 'large' ? 24 : 18} />;
      default:
        return <HelpCircle size={size === 'large' ? 24 : 18} />;
    }
  };

  const getText = () => {
    switch (level) {
      case 'HIGH':
        return t('risk.highBadge');
      case 'MEDIUM':
        return t('risk.mediumBadge');
      case 'LOW':
        return t('risk.lowBadge');
      default:
        return t('risk.unknown');
    }
  };

  return (
    <div
      className={`risk-badge ${level}`}
      style={size === 'large' ? { fontSize: '1.15rem', padding: '0.65rem 1.4rem' } : {}}
    >
      {getIcon()}
      <span>{getText()}</span>
    </div>
  );
}
