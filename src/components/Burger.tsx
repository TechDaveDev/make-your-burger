'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBurger } from '@/context/BurgerContext';
import { SortableIngredient } from './SortableIngredients';

export const Burger = () => {
  const { ingredients } = useBurger();
  const { isOver, setNodeRef } = useDroppable({ id: 'burger-area' });

  return (
    <div className="flex flex-col items-center w-72">
      <div className="w-full h-14 bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-full shadow-inner" />
      <div
        ref={setNodeRef}
        className={`w-full p-2 min-h-[95px] flex flex-col items-center gap-1.5 transition-all duration-300 ${isOver ? 'bg-green-100/80' : 'bg-slate-200/50'}`}
      >
        <SortableContext items={ingredients} strategy={verticalListSortingStrategy}>
          {ingredients.length > 0 ? (
            ingredients.map(id => <SortableIngredient key={id} id={id} />)
          ) : (
            <div className="flex-grow flex items-center justify-center pointer-events-none">
              <span className="text-slate-400 text-sm font-medium border-2 border-dashed border-slate-300 rounded-xl px-4 py-2">
                Zona de ingredientes
              </span>
            </div>
          )}
        </SortableContext>
      </div>
      <div className="w-full h-8 bg-gradient-to-t from-amber-500 to-amber-600 rounded-b-xl shadow-inner" />
    </div>
  );
};
