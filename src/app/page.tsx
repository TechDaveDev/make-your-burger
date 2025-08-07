'use client';

import React, { useState, useEffect, type FC, type PropsWithChildren } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  pointerWithin
} from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const AVAILABLE_INGREDIENTS = [
  { id: 'lettuce', name: 'Lechuga', emoji: '🥬', color: 'bg-gradient-to-br from-green-400 to-green-500' },
  { id: 'tomato', name: 'Tomate', emoji: '🍅', color: 'bg-gradient-to-br from-red-500 to-red-600' },
  { id: 'cheese', name: 'Queso', emoji: '🧀', color: 'bg-gradient-to-br from-yellow-400 to-yellow-500' },
  { id: 'meat', name: 'Carne', emoji: '🥩', color: 'bg-gradient-to-br from-yellow-800 to-yellow-900' },
];

const IngredientDisplay: FC<{ name: string; color: string }> = ({ name, color }) => (
  <div className={`text-white w-full text-center p-2 rounded-lg shadow-lg ${color}`}>
    <span className="font-medium text-sm">{name}</span>
  </div>
);

const SortableIngredient: FC<{ id: string }> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease',
    opacity: isDragging ? 0 : 1,
  };

  const ingredientBase = AVAILABLE_INGREDIENTS.find(i => i.id === id.split('-')[0]);
  if (!ingredientBase) return null;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none w-full h-8">
      <IngredientDisplay name={ingredientBase.name} color={ingredientBase.color} />
    </div>
  );
};

const Draggable: FC<PropsWithChildren<{ id: string }>> = (props) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: props.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab touch-none transition-transform hover:scale-110 active:scale-95">
      {props.children}
    </div>
  );
};

const Droppable: FC<PropsWithChildren<{ id: string }>> = (props) => {
  const { isOver, setNodeRef } = useDroppable({ id: props.id });
  return (
    <div ref={setNodeRef} className={`w-72 p-2 min-h-[200px] flex flex-col items-center gap-1.5 transition-all duration-300 ${isOver ? 'bg-green-100/80' : 'bg-slate-200/50'}`}>
      {props.children}
    </div>
  );
};

export default function BurgerBuilderPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [burgerIngredients, setBurgerIngredients] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id.toString());
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!active || !over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isReordering = burgerIngredients.includes(activeId);
    if (isReordering) {
      if (activeId !== overId) {
        const oldIndex = burgerIngredients.indexOf(activeId);
        const newIndex = burgerIngredients.indexOf(overId);
        if (newIndex !== -1) {
          setBurgerIngredients(items => arrayMove(items, oldIndex, newIndex));
        }
      }
      return;
    }

    const isNewIngredient = AVAILABLE_INGREDIENTS.some(ing => ing.id === activeId);
    if (isNewIngredient) {
      const newUniqueId = `${activeId}-${Date.now()}`;

      if (overId === 'burger-area') {
        setBurgerIngredients(items => [...items, newUniqueId]);
      } else {
        const overIndex = burgerIngredients.indexOf(overId);
        if (overIndex !== -1) {
          setBurgerIngredients(items => {
            const newItems = [...items];
            newItems.splice(overIndex, 0, newUniqueId);
            return newItems;
          });
        }
      }
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <main className="flex flex-col h-screen bg-slate-50">
        <header className="text-center p-5">
          <h1 className="text-2xl font-bold text-slate-800">Crea tu Hamburguesa</h1>
          <p className="text-slate-500 text-sm mt-1">Arrastra y suelta los ingredientes</p>
        </header>

        <div className="flex-grow flex items-center justify-center p-4">
          <div className="flex flex-col items-center w-72">
            <div className="w-full h-14 bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-full shadow-inner" />
            <Droppable id="burger-area">
              <SortableContext items={burgerIngredients} strategy={verticalListSortingStrategy}>
                {burgerIngredients.length > 0 ? (
                  burgerIngredients.map((ingredientId) => (
                    <SortableIngredient key={ingredientId} id={ingredientId} />
                  ))
                ) : (
                  <div className={`flex-grow flex items-center justify-center pointer-events-none transition-opacity duration-300`}>
                    <span className="text-slate-400 text-sm font-medium border-2 border-dashed border-slate-300 rounded-xl px-4 py-2">
                      Zona de Burger
                    </span>
                  </div>
                )}
              </SortableContext>
            </Droppable>
            <div className="w-full h-8 bg-gradient-to-t from-amber-500 to-amber-600 rounded-b-xl shadow-inner" />
          </div>
        </div>

        <footer className="sticky bottom-4 mx-4 bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-lg">
          <div className="p-5 flex justify-center items-center gap-x-8">
            {AVAILABLE_INGREDIENTS.map((ingredient) => (
              <Draggable key={ingredient.id} id={ingredient.id}>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-5xl drop-shadow-md">{ingredient.emoji}</span>
                  <span className="text-xs font-medium text-slate-600">{ingredient.name}</span>
                </div>
              </Draggable>
            ))}
          </div>
        </footer>
      </main>

      <DragOverlay>
        {(() => {
          if (!activeId) return null;
          const isReordering = activeId.includes('-');
          const baseId = activeId.split('-')[0];
          const ingredientData = AVAILABLE_INGREDIENTS.find(i => i.id === baseId);
          if (!ingredientData) return null;

          if (isReordering) {
            return <div className="w-72 h-8"><IngredientDisplay name={ingredientData.name} color={ingredientData.color} /></div>;
          } else {
            return <span className="text-6xl drop-shadow-lg">{ingredientData.emoji}</span>;
          }
        })()}
      </DragOverlay>
    </DndContext>
  );
}
