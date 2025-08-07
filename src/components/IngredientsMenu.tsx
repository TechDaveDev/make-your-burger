'use client';

import { type FC, type PropsWithChildren } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { AVAILABLE_INGREDIENTS } from '../context/BurgerContext';

const DraggableIngredient: FC<{ ingredient: typeof AVAILABLE_INGREDIENTS[0] }> = ({ ingredient }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: ingredient.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab touch-none transition-transform hover:scale-110 active:scale-95">
      <div className="flex flex-col items-center gap-2">
        <span className="text-5xl drop-shadow-md">{ingredient.emoji}</span>
        <span className="text-xs font-medium text-slate-600">{ingredient.name}</span>
      </div>
    </div>
  );
};

export const IngredientsMenu = () => (
  <footer className="sticky bottom-4 mx-4 bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-lg">
    <div className="p-5 flex justify-center items-center gap-x-8">
      {AVAILABLE_INGREDIENTS.map(ing => <DraggableIngredient key={ing.id} ingredient={ing} />)}
    </div>
  </footer>
);
