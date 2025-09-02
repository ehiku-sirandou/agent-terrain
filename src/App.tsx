import React, { useState, useEffect } from 'react';
import Form from './components/Form';
import ScratchCard from './components/ScratchCard';
import { saveUser } from './services/userService';

interface FormData {
  telephone: string;
  nom: string;
  prenom: string;
  email: string;
  profession: string;
}

const prizes = [
  'Thé Earl Grey Premium',
  'Café Arabica Bio',
  'Thé Vert Matcha',
  'Café Espresso Italien',
  'Thé Blanc aux Fleurs',
  'Café Colombien',
  'Thé Oolong Dragon Well',
  'Café Blue Mountain',
  'Thé Chai Épicé',
  'Café Éthiopien'
];

function App() {
  const [currentStep, setCurrentStep] = useState<'form' | 'scratch'>('form');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [selectedPrize, setSelectedPrize] = useState('');

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  const handleFormSubmit = async (data: FormData) => {
    setFormData(data);
    // Randomly select a prize
    const randomPrize = prizes[Math.floor(Math.random() * prizes.length)];
    setSelectedPrize(randomPrize);
    
    // Sauvegarder les données utilisateur avec le prix
    try {
      const saveResult = await saveUser({
        ...data,
        prize: randomPrize
      });
      
      if (saveResult.success) {
        console.log('Utilisateur sauvegardé avec succès:', saveResult.userId);
      } else {
        console.error('Erreur sauvegarde:', saveResult.error);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
    
    setCurrentStep('scratch');
  };

  const handleReset = () => {
    setCurrentStep('form');
    setFormData(null);
    setSelectedPrize('');
  };

  return (
    <div className="app">
      {currentStep === 'form' ? (
        <Form onSubmit={handleFormSubmit} />
      ) : (
        <ScratchCard prize={selectedPrize} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;