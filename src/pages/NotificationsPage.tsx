import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle2, Info, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const seedNotifications = [
  { id: 'n-1', title: 'Blood Panel Ingested & Parsed', message: 'Serum Ferritin measured at 14 ng/mL (Lower reference bound).', time: '10m ago', read: false, type: 'alert' },
  { id: 'n-[#1A3C2B]', title: 'Specialist Match Verified', message: 'Dr. Sarah Jenkins (Hematologist / GP) available for consultation.', time: '1h ago', read: false, type: 'success' },
  { id: 'n-3', title: '256-bit Encrypted Backup', message: 'Diagnostic records backed up securely in your encrypted vault.', time: '1d ago', read: true, type: 'info' },
];

export default function NotificationsPage() {
  const [items, setItems] = useState(seedNotifications);
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'Unread' ? items.filter((n) => !n.read) : items;
  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((n) => n.map((x) => ({ ...x, read: true })));
    toast.success('All notifications marked as read', {
      style: { borderRadius: '2px', background: '#1A3C2B', color: '#FFFFFF' },
    });
  };

  return (
    <div className="space-y-8 select-none font-['Public_Sans']">
      {/* Header */}
      <div className="bg-white border border-[#3A3A38]/20 rounded-[14px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#1A3C2B]">
            HEALTH ALERTS & NOTIFICATIONS
          </span>
          <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#111827]">
            Notification Center
          </h1>
          <p className="font-['Public_Sans'] text-xs sm:text-sm text-[#3A3A38]">
            {unread} unread health alerts and report updates
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-4 py-2.5 bg-white border border-[#3A3A38]/30 hover:border-[#1A3C2B] text-[#111827] font-semibold text-xs rounded-[12px] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="h-4 w-4 text-[#1A3C2B]" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {['All', 'Unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-semibold rounded-[12px] border transition-colors cursor-pointer ${
              filter === f
                ? 'bg-[#1A3C2B] text-white border-[#1A3C2B]'
                : 'bg-white text-[#111827] border-[#3A3A38]/20 hover:border-[#1A3C2B]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`bg-white border border-[#3A3A38]/20 p-4 rounded-[14px] flex items-start gap-3 hover:border-[#1A3C2B] transition-colors ${
              !n.read ? 'border-l-4 border-l-[#1A3C2B]' : ''
            }`}
          >
            <div className="p-2 rounded-[10px] bg-[#F7F7F5] border border-[#3A3A38]/15 text-[#1A3C2B] shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5 text-[#1A3C2B]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-['Space_Grotesk'] font-bold text-base text-[#111827]">
                  {n.title}
                </h3>
                <span className="font-['JetBrains_Mono'] text-[10px] text-[#3A3A38] uppercase">
                  {n.time}
                </span>
              </div>
              <p className="font-['Public_Sans'] text-xs text-[#3A3A38] mt-1 leading-relaxed">
                {n.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
