import React, { useEffect, useState } from 'react';

const MouseGlow = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="fixed w-64 h-64 rounded-full pointer-events-none z-50"
      style={{
        left: pos.x,
        top: pos.y,
        background:
          'radial-gradient(circle, rgba(0,255,245,0.8) 0%, rgba(0,210,255,0.6) 50%, rgba(0,180,255,0) 50%)',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(38px)',
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default MouseGlow;
