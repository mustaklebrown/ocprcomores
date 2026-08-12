'use client';

import Image from 'next/image';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'color' | 'white';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function OCPRLogo({
  className = '',
  variant = 'color',
  showText = true,
  size = 'md',
}: LogoProps) {
  const heightMap = {
    sm: 'h-9',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  const textOCPRColor =
    (variant === 'light' || variant === 'white') ? 'text-white' :
      variant === 'dark' ? 'text-[#2A7B44]' :
        'text-[#367C47]';

  const textSubtitleColor =
    (variant === 'light' || variant === 'white') ? 'text-[#FAF8F3]/90' :
      'text-[#523824]';

  const emblemSrc = (variant === 'light' || variant === 'white')
    ? '/logo-ocpr-white-mark.svg'
    : '/logo-ocpr-mark.svg';

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Logo Emblem Icon */}
      <div className={`relative ${heightMap[size]} aspect-square flex-shrink-0 transition-transform duration-300 hover:scale-105`}>
        <Image
          src={emblemSrc}
          alt="OCPR Emblem"
          fill
          sizes="96px"
          priority
          className="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${textOCPRColor} ${size === 'sm' ? 'text-lg' :
                size === 'md' ? 'text-2xl' :
                  size === 'lg' ? 'text-3xl' : 'text-4xl'
              }`}>
              OCPR
            </span>
            <div className="h-2 w-2 rounded-full bg-[#8C2D32]" />
            <div className="h-2 w-2 rounded-full bg-[#EDBF2B]" />
            <div className="h-2 w-2 rounded-full bg-[#2E2A68]" />
          </div>
          <span className={`font-serif font-medium tracking-wide leading-tight ${textSubtitleColor} ${size === 'sm' ? 'text-[9px]' :
              size === 'md' ? 'text-[11px]' :
                size === 'lg' ? 'text-[13px]' : 'text-base'
            }`}>
            Office Comorien des Produits de Rente
          </span>
        </div>
      )}
    </div>
  );
}
