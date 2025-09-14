import React from 'react';

type Props = {
  src: string;
};

export default function ThreeSliceImage({ src }: Props) {
  const positions = ['0% 50%', '50% 50%', '100% 50%']; // left / center / right thirds

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="h-64 md:h-80 lg:h-96 rounded-2xl shadow-lg"
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '300% 100%',   // stretch across 3 tiles
            backgroundPosition: pos,        // show left/middle/right slice
          }}
        />
      ))}
    </div>
  );
}
