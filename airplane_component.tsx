import React from 'react';

export const RakhiAirplane = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 800 400" className={className} xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-5 400 200)">
      <path d="M 150 200 L 80 50 L 160 50 L 220 200 Z" fill="#059669" />
      <path d="M 450 200 L 350 80 L 420 80 L 530 200 Z" fill="#94a3b8" />
      <path d="M 100 200 C 100 170, 150 140, 250 140 L 650 140 C 750 140, 780 170, 780 200 C 780 230, 750 260, 650 260 L 250 260 C 150 260, 100 230, 100 200 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
      <path d="M 680 155 C 720 155, 750 165, 760 180 L 680 180 Z" fill="#38bdf8" />
      <path d="M 120 215 L 750 215" stroke="#059669" strokeWidth="8" />
      <line x1="250" y1="180" x2="600" y2="180" stroke="#0ea5e9" strokeWidth="10" strokeDasharray="15 20" strokeLinecap="round" />
      <text x="320" y="245" fontFamily="system-ui, sans-serif" fontWeight="900" fontSize="28" fill="#0f172a" letterSpacing="1.5" fontStyle="italic">RakhiInternet</text>
      <path d="M 420 220 L 550 380 L 630 380 L 520 220 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="3" />
      <g transform="translate(480, 260)">
        <rect x="0" y="0" width="100" height="40" rx="20" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="3" />
        <path d="M 100 0 C 115 0, 115 40, 100 40 Z" fill="#334155" />
        <path d="M 0 5 C -10 5, -10 35, 0 35 Z" fill="#334155" />
      </g>
      <path d="M 180 220 L 120 280 L 170 280 L 220 220 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
    </g>
  </svg>
);
