import { motion } from 'framer-motion';
import { CreditCard, Banknote, Building2, FileCheck } from 'lucide-react';
import type { Invoice } from '../data/types';
import StatusBadge from './StatusBadge';

interface InvoiceCardProps {
  invoice: Invoice;
  onSelect?: (invoice: Invoice) => void;
}

const paymentIcons: Record<string, typeof CreditCard> = {
  cb: CreditCard,
  especes: Banknote,
  virement: Building2,
  cheque: FileCheck,
};

export default function InvoiceCard({ invoice, onSelect }: InvoiceCardProps) {
  const PaymentIcon = invoice.paymentMethod ? paymentIcons[invoice.paymentMethod] : null;

  return (
    <motion.button
      onClick={() => onSelect?.(invoice)}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="w-full ios-card p-4 flex items-center gap-3 text-left"
    >
      {/* Left info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-black truncate">
            {invoice.patientName}
          </span>
        </div>
        <p className="text-[13px] text-ios-gray-1 mt-0.5">
          N&deg; {invoice.number}
        </p>
        <p className="text-[12px] text-ios-gray-2 mt-0.5">
          {invoice.date}
        </p>
      </div>

      {/* Right: amount + status */}
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className="text-[20px] font-bold text-black">{invoice.amount}&nbsp;&euro;</span>
        <div className="flex items-center gap-1.5">
          {PaymentIcon && invoice.paid && (
            <PaymentIcon size={14} className="text-ios-gray-2" />
          )}
          <StatusBadge
            status={invoice.paid ? 'Paye' : 'Impaye'}
            variant={invoice.paid ? 'green' : 'red'}
          />
        </div>
      </div>
    </motion.button>
  );
}
