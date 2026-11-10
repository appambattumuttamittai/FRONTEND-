import Image from 'next/image';

const items = [
  { text: 'Appambattu Mutta Mittai', color: '#582A00' },
  { text: 'முட்டை மிட்டாய்', color: '#C42F2C' },
  { text: 'Traditional Egg Sweet', color: '#582A00' },
  { text: 'அப்பம்பட்டு', color: '#C42F2C' },
  { text: 'Made Fresh Daily', color: '#582A00' },
  { text: 'Villupuram Tamil Nadu', color: '#C42F2C' },
];

export default function MarqueeBand() {
  return (
    <div className="py-5 overflow-hidden" style={{ background: '#FFFFFF', borderTop: '1px solid rgba(196,47,44,0.08)', borderBottom: '1px solid rgba(196,47,44,0.08)' }} aria-hidden="true">
      {/* Row 1 — left */}
      <div className="relative flex mb-3">
        <div className="sw-row-left flex items-center gap-8 whitespace-nowrap w-max">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center gap-4">
              <span className="font-black text-sm tracking-wide" style={{ color: item.color, fontFamily: i % 2 === 1 ? "'Noto Sans Tamil', sans-serif" : "'Exo 2', sans-serif" }}>
                {item.text}
              </span>
              <span style={{ color: '#D97706' }}>◆</span>
            </span>
          ))}
        </div>
      </div>
      {/* Row 2 — right */}
      <div className="relative flex">
        <div className="sw-row-right flex items-center gap-8 whitespace-nowrap w-max">
          {[...items.slice().reverse(), ...items.slice().reverse()].map((item, i) => (
            <span key={i} className="flex items-center gap-4">
              <span style={{ color: '#D97706' }}>◆</span>
              <span className="font-black text-sm tracking-wide" style={{ color: item.color, fontFamily: i % 2 === 0 ? "'Noto Sans Tamil', sans-serif" : "'Exo 2', sans-serif" }}>
                {item.text}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
