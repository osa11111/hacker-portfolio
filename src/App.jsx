import React, { useState, useEffect } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import './App.css';
import profileImage from './assets/profile_picture_hacker_style.png';

const MatrixRain = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00ff00';
      ctx.font = fontSize + 'px Fira Code';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    return () => {
      clearInterval(interval);
      document.body.removeChild(canvas);
    };
  }, []);

  return null;
};

const TypingText = ({ text, delay = 100, isEnglish = false, onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }
  }, [currentIndex, text, delay, onComplete]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={`typing-text ${isEnglish ? 'english' : ''}`}>
      {displayText}
      {showCursor && <span className="typing-cursor">|</span>}
    </div>
  );
};

const BinaryBackground = () => {
  const generateBinaryLine = () => {
    return Array.from({ length: 200 }, () => Math.random() > 0.5 ? '1' : '0').join('');
  };

  return (
    <div className="binary-bg">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="binary-line"
          style={{
            top: `${i * 5}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${20 + i * 2}s`
          }}
        >
          {generateBinaryLine()}
        </div>
      ))}
    </div>
  );
};

function App() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showSocialIcons, setShowSocialIcons] = useState(false);

  const arabicTexts = [
    "الاسم: أسامه احمد عبدالله ",
    "العمر: 19 سنة", 
    "أدرس في إدارة البرمجيات",
    "تصميم المواقع",
    "وحمايتها"
  ];

  const englishTexts = [
    "Name: OSAMA AHMED ABDULLAH",
    "Age: 19",
    "Studying: Software Management", 
    "Web Design",
    "And Cybersecurity"
  ];

  const handleTextComplete = () => {
    if (currentTextIndex < arabicTexts.length + englishTexts.length - 1) {
      setTimeout(() => {
        setCurrentTextIndex(prev => prev + 1);
      }, 800);
    } else {
      setTimeout(() => {
        setShowSocialIcons(true);
      }, 1000);
    }
  };

  return (
    <div className="hacker-container">
      <MatrixRain />
      <BinaryBackground />
      
      <img 
        src={profileImage} 
        alt="Profile" 
        className="profile-picture"
      />

      {/* Arabic Texts */}
      {currentTextIndex >= 0 && currentTextIndex < arabicTexts.length && (
        <div>
          {arabicTexts.slice(0, currentTextIndex + 1).map((text, index) => (
            <TypingText
              key={`arabic-${index}`}
              text={text}
              delay={80}
              isEnglish={false}
              onComplete={index === currentTextIndex ? handleTextComplete : null}
            />
          ))}
        </div>
      )}

      {/* English Texts */}
      {currentTextIndex >= arabicTexts.length && (
        <div>
          {arabicTexts.map((text, index) => (
            <div key={`arabic-final-${index}`} className="typing-text">
              {text}
            </div>
          ))}
          {englishTexts.slice(0, currentTextIndex - arabicTexts.length + 1).map((text, index) => (
            <TypingText
              key={`english-${index}`}
              text={text}
              delay={80}
              isEnglish={true}
              onComplete={index === currentTextIndex - arabicTexts.length ? handleTextComplete : null}
            />
          ))}
        </div>
      )}

      {/* Social Icons */}
      {showSocialIcons && (
        <div className="social-icons" style={{ 
          animation: 'fadeIn 1s ease-in-out',
          opacity: showSocialIcons ? 1 : 0 
        }}>
          <a href="https://www.facebook.com/share/16mmcj1fSj/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
            <Facebook size={24} />
          </a>
          <a href="https://www.instagram.com/alweso.1?igsh=M3V3cDNqaXlwbjR1&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
            <Instagram size={24} />
          </a>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;
