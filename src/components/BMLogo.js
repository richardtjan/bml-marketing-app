import React from 'react';

// Ini adalah komponen final untuk logo BML Anda.
// Kode SVG telah disederhanakan untuk menghilangkan data gambar yang rawan error
// dan diganti dengan warna solid yang sesuai desain, sambil mempertahankan efeknya.

export const BMLogo = () => (
    <svg width="250" viewBox="0 0 836 314" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
        <g filter="url(#filter0_i_642_2123)">
            {/* Mengganti gambar dengan warna solid dari desain Anda */}
            <rect width="836" height="294" fill="#00529B"/>
        </g>
        <defs>
            <filter id="filter0_i_642_2123" x="0" y="0" width="836" height="314" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="20"/>
                <feGaussianBlur stdDeviation="10"/>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_642_2123"/>
            </filter>
        </defs>
    </svg>
);
