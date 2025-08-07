'use client';

import React, { type FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AVAILABLE_INGREDIENTS } from '../context/BurgerContext';

const IngredientDisplay: FC<{ name: string; color: string }> = ({ name, color }) => (
  <div className={`text-white w-full text-center p-2 rounded-lg shadow-lg ${color}`}>
    <span className="font-medium text-sm">{name}</span>
  </div>
);

export const SortableIngredient: FC<{ id: string }> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1
  };

  const baseIngredient = AVAILABLE_INGREDIENTS.find(i => i.id === id.split('-')[0]);

  if (!baseIngredient) return null;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none w-full h-8">
      <IngredientDisplay name={baseIngredient.name} color={baseIngredient.color} />
    </div>
  );
};
