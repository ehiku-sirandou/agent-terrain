import React, { useRef, useEffect, useState } from 'react';
import { Gift, RotateCcw, Sparkles, Mail, ArrowRight } from 'lucide-react';

interface ScratchCardProps {
  prize: string;
  onReset: () => void;
}

export default function ScratchCard({ prize, onReset }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratching, setIsScratching] = useState(false);
  const [showPrize, setShowPrize] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create beautiful blue gradient background like in the image
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#00D4FF');
    gradient.addColorStop(0.5, '#0EA5E9');
    gradient.addColorStop(1, '#0284C7');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add decorative elements like in the image
    drawDecorativeElements(ctx, canvas.width, canvas.height);

    // Add main text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 4;
    ctx.fillText('Grattez pour découvrir', canvas.width / 2, canvas.height / 2 - 10);
    ctx.fillText('votre cadeau', canvas.width / 2, canvas.height / 2 + 15);

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  const drawDecorativeElements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw stars like in the image
    const drawStar = (x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('✨', x, y);
    };

    // Draw gift boxes
    const drawGift = (x: number, y: number, size: number) => {
      ctx.fillStyle = '#1E40AF';
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('🎁', x, y);
    };

    // Draw trophy
    const drawTrophy = (x: number, y: number, size: number) => {
      ctx.fillStyle = '#F59E0B';
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('🏆', x, y);
    };

    // Draw medal
    const drawMedal = (x: number, y: number, size: number) => {
      ctx.fillStyle = '#10B981';
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('🏅', x, y);
    };

    // Draw penguin (closest to the blue character in image)
    const drawPenguin = (x: number, y: number, size: number) => {
      ctx.fillStyle = '#1E293B';
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText('🐧', x, y);
    };

    // Position elements randomly like in the image
    drawStar(width * 0.15, height * 0.25, 16, 'rgba(255,255,255,0.8)');
    drawStar(width * 0.85, height * 0.3, 12, 'rgba(255,255,255,0.6)');
    drawStar(width * 0.2, height * 0.75, 14, 'rgba(255,255,255,0.7)');
    drawStar(width * 0.8, height * 0.8, 10, 'rgba(255,255,255,0.5)');

    drawGift(width * 0.25, height * 0.4, 24);
    drawTrophy(width * 0.75, height * 0.5, 28);
    drawMedal(width * 0.15, height * 0.6, 20);
    drawPenguin(width * 0.7, height * 0.75, 22);

    // Add small dots like in the image
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, Math.random() * 3 + 1, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Add curved lines like confetti
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const endX = startX + (Math.random() - 0.5) * 40;
      const endY = startY + (Math.random() - 0.5) * 40;
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        startX + (Math.random() - 0.5) * 20,
        startY + (Math.random() - 0.5) * 20,
        endX,
        endY
      );
      ctx.stroke();
    }
  };

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fill();

    // Calculate scratch percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let scratchedPixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) scratchedPixels++;
    }

    const percentage = (scratchedPixels / (pixels.length / 4)) * 100;

    if (percentage > 25 && !showPrize) {
      setShowPrize(true);
      // Start animation sequence
      setTimeout(() => {
        setAnimationPhase(1);
        setShowConfetti(true);
      }, 300);
      
      setTimeout(() => {
        setAnimationPhase(2);
      }, 800);
      
      setTimeout(() => {
        setAnimationPhase(3);
      }, 2000);
    }
  };

  const createConfetti = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF8A80', '#82B1FF'];
    return Array.from({ length: 60 }, (_, i) => (
      <div
        key={i}
        className="absolute animate-ping"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          width: `${Math.random() * 8 + 4}px`,
          height: `${Math.random() * 8 + 4}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          animationDelay: `${Math.random() * 1.5}s`,
        }}
      />
    ));
  };

  const createFloatingElements = () => {
    return Array.from({ length: 20 }, (_, i) => (
      <div
        key={i}
        className="absolute animate-bounce"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 20 + 15}px`,
          animationDelay: `${Math.random() * 2}s`,
        }}
      >
        {['🎉', '🎊', '✨', '🎁', '🏆'][Math.floor(Math.random() * 5)]}
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {createConfetti()}
          {createFloatingElements()}
        </div>
      )}

      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full mb-4 transition-all duration-500 ${
            showPrize ? 'animate-pulse scale-110' : ''
          }`}>
            <Gift className={`w-8 h-8 sm:w-10 sm:h-10 text-white transition-all duration-500 ${
              showPrize ? 'animate-spin' : ''
            }`} />
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold text-white mb-2 transition-all duration-500 ${
            showPrize ? 'animate-pulse' : ''
          }`}>
            Votre Carte Cadeau
          </h1>
          <p className="text-sm sm:text-base text-cyan-100">
            {showPrize ? '🎊 Félicitations ! 🎊' : 'Grattez pour découvrir votre prix !'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 relative overflow-hidden">
          <div className="relative">
            {/* Prize background with enhanced animations */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
              showPrize ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            }`}>
              <div className="text-center p-4 sm:p-8">
                <div className={`text-5xl sm:text-7xl mb-4 sm:mb-6 transition-all duration-700 ${
                  animationPhase >= 1 ? 'animate-bounce' : ''
                }`}>
                  🎉
                </div>
                <div className={`text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-3 sm:mb-4 transition-all duration-700 ${
                  animationPhase >= 2 ? 'animate-pulse' : ''
                }`}>
                  Félicitations !
                </div>
                <div className={`text-lg sm:text-2xl font-bold text-gray-800 bg-gradient-to-r from-yellow-200 to-yellow-300 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-4 border-yellow-400 shadow-lg transition-all duration-700 ${
                  animationPhase >= 3 ? 'animate-bounce' : ''
                }`}>
                  {prize}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Vous avez gagné ce superbe prix !
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Scratch canvas */}
            <canvas
              ref={canvasRef}
              className={`w-full h-64 sm:h-80 cursor-pointer transition-all duration-700 rounded-2xl ${
                showPrize ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              onMouseDown={() => setIsScratching(true)}
              onMouseUp={() => setIsScratching(false)}
              onMouseMove={(e) => isScratching && scratch(e)}
              onTouchStart={() => setIsScratching(true)}
              onTouchEnd={() => setIsScratching(false)}
              onTouchMove={(e) => {
                e.preventDefault();
                scratch(e);
              }}
            />
          </div>

          {showPrize && (
            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              <div className="text-center">
                <div className="text-green-600 font-bold text-base sm:text-lg mb-2 sm:mb-3 animate-pulse">
                  🎊 Prix entièrement révélé ! 🎊
                </div>
                <div className="text-xs sm:text-sm text-gray-600 bg-green-50 p-2 sm:p-3 rounded-lg border border-green-200">
                  Votre {prize.toLowerCase()} vous sera remis sous 24h !
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <button
                  onClick={onReset}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                  Nouvelle tentative
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}