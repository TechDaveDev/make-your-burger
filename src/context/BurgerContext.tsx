'use client';

import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren
} from 'react';
import { type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const AVAILABLE_INGREDIENTS = [
  { id: 'lettuce', name: 'Lechuga', emoji: '🥬', color: 'bg-gradient-to-br from-green-400 to-green-500' },
  { id: 'tomato', name: 'Tomate', emoji: '🍅', color: 'bg-gradient-to-br from-red-500 to-red-600' },
  { id: 'onion', name: 'Cebolla', emoji: '🧅', color: 'bg-gradient-to-br from-pink-500 to-pink-600' },
  { id: 'cheese', name: 'Queso', emoji: '🧀', color: 'bg-gradient-to-br from-yellow-400 to-yellow-500' },
  { id: 'meat', name: 'Carne', emoji: '🥩', color: 'bg-gradient-to-br from-yellow-800 to-yellow-900' },
];

interface BurgerContextType {
  ingredients: string[];
  activeId: string | null;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

const BurgerContext = createContext<BurgerContextType | null>(null);

export const useBurger = () => {
  const context = useContext(BurgerContext);
  if (!context) {
    throw new Error('useBurger debe ser usado dentro de un BurgerProvider');
  }
  return context;
};

export const BurgerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!active || !over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isReordering = ingredients.includes(activeId);
    if (isReordering) {
      if (activeId !== overId) {
        const oldIndex = ingredients.indexOf(activeId);
        const newIndex = ingredients.indexOf(overId);
        if (newIndex !== -1) {
          setIngredients(items => arrayMove(items, oldIndex, newIndex));
        }
      }
      return;
    }

    const isNewIngredient = AVAILABLE_INGREDIENTS.some(ing => ing.id === activeId);
    if (isNewIngredient) {
      const newUniqueId = `${activeId}-${Date.now()}`;
      if (overId === 'burger-area') {
        setIngredients(items => [...items, newUniqueId]);
      } else {
        const overIndex = ingredients.indexOf(overId);
        if (overIndex !== -1) {
          setIngredients(items => {
            const newItems = [...items];
            newItems.splice(overIndex, 0, newUniqueId);
            return newItems;
          });
        }
      }
    }
  };

  const value = {
    ingredients,
    activeId,
    handleDragStart,
    handleDragEnd,
  };

  return <BurgerContext.Provider value={value}>{children}</BurgerContext.Provider>;
};
