import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string;
  variant?: 'green' | 'red' | 'blue' | 'orange' | 'gray';
  pulse?: boolean;
}

const variantStyles: Record<string, { bg: string; text: string }> = {
  green: { bg: 'bg-ios-green/15', text: 'text-ios-green' },
  red: { bg: 'bg-ios-red/15', text: 'text-ios-red' },
  blue: { bg: 'bg-ios-blue/15', text: 'text-ios-blue' },
  orange: { bg: 'bg-ios-orange/15', text: 'text-ios-orange' },
  gray: { bg: 'bg-ios-gray-5', text: 'text-ios-gray-1' },
};

export default function StatusBadge({ status, variant = 'gray', pulse = false }: StatusBadgeProps) {
  const style = variantStyles[variant] ?? variantStyles.gray;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${variant === 'blue' ? 'bg-ios-blue' : 'bg-current'}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${variant === 'blue' ? 'bg-ios-blue' : 'bg-current'}`} />
        </span>
      )}
      {status}
    </motion.span>
  );
}
