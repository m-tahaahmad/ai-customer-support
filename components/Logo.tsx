import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-xl">AI</span>
        </div>
      </div>
      <span className="text-2xl font-bold text-gray-900 dark:text-white">
        Support AI
      </span>
    </div>
  );
}

