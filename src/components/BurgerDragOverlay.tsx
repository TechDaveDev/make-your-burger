'use client';

import { type FC } from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { useBurger, AVAILABLE_INGREDIENTS } from '../context/BurgerContext';

const IngredientDisplay: FC<{ name: string; color: string }> = ({ name, color }) => (
  <div className={`text-white w-full text-center p-2 rounded-lg shadow-lg ${color}`}>
    <span className="font-medium text-sm">{name}</span>
  </div>
);

export const BurgerDragOverlay = () => {
  const { activeId } = useBurger();
  if (!activeId) return null;

  const isReordering = activeId.includes('-');
  const baseId = activeId.split('-')[0];
  const ingredientData = AVAILABLE_INGREDIENTS.find(i => i.id === baseId);
  if (!ingredientData) return null;

  return (
    <DragOverlay>
      {isReordering ? (
        <div className="w-72 h-8"><IngredientDisplay name={ingredientData.name} color={ingredientData.color} /></div>
      ) : (
        <span className="text-6xl drop-shadow-lg">{ingredientData.emoji}</span>
      )}
    </DragOverlay>
  );
};
