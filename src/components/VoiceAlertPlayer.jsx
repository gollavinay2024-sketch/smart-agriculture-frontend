import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Square, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function VoiceAlertPlayer({ alertText }) {
  const { language, t } = useApp();
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  const handleSpeak = () => {
    if (!isSupported || !alertText) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(alertText);
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Pick best matching voice
    if (language === 'te') {
      utterance.lang = 'te-IN';
      const teVoice = voices.find(v => v.lang.startsWith('te'));
      if (teVoice) utterance.voice = teVoice;
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
      const hiVoice = voices.find(v => v.lang.startsWith('hi'));
      if (hiVoice) utterance.voice = hiVoice;
    } else {
      utterance.lang = 'en-IN';
      const enVoice = voices.find(v => v.lang === 'en-IN' || v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <div style={{
        background: '#fef3c7',
        border: '1px solid #fde68a',
        padding: '0.85rem 1.15rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#92400e',
        fontSize: '0.88rem'
      }}>
        <AlertCircle size={18} />
        <span>{t('results.voiceUnsupported')}</span>
      </div>
    );
  }

  return (
    <div className="voice-bar">
      <div className="voice-info">
        <div className="voice-icon">
          {isSpeaking ? <Volume2 size={24} color="#ffffff" /> : <VolumeX size={24} color="#ffffff" />}
        </div>
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '1.05rem', margin: 0 }}>
            {isSpeaking ? t('results.voicePlaying') : t('results.listenVoice')}
          </h4>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>
            {language === 'te' ? 'తెలుగులో ఆడియో హెచ్చరిక' : language === 'hi' ? 'हिंदी में ऑडियो अलर्ट' : 'Audio alert in English'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.65rem' }}>
        {!isSpeaking ? (
          <button
            type="button"
            className="btn btn-accent"
            onClick={handleSpeak}
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <Play size={18} fill="currentColor" />
            <span>{t('results.listenVoice')}</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn"
            onClick={handleStop}
            style={{ background: '#ffffff', color: '#dc2626', padding: '0.65rem 1.25rem' }}
          >
            <Square size={16} fill="currentColor" />
            <span>{t('results.stopVoice')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
