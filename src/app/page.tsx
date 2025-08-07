'use client';

import { useState, useEffect } from 'react';
import { DndContext } from '@dnd-kit/core';
import { pointerWithin } from '@dnd-kit/core';

import { BurgerProvider, useBurger } from '@/context/BurgerContext';

import { IngredientsMenu } from '@/components/IngredientsMenu';
import { BurgerDragOverlay } from '@/components/BurgerDragOverlay';
import { Burger } from '@/components/Burger';

const AppLayout = () => {
  const { handleDragStart, handleDragEnd } = useBurger();

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <main className="flex flex-col h-screen bg-slate-50">
        <header className="text-center p-5">
          <h1 className="text-2xl font-bold text-slate-800">Monta tu Hamburguesa</h1>
          <p className="text-slate-500 text-sm mt-1">Arrastra y suelta los ingredientes</p>
        </header>
        <div className="flex-grow flex items-center justify-center p-4">
          <Burger />
        </div>
        <IngredientsMenu />
      </main>
      <BurgerDragOverlay />
    </DndContext>
  );
};

export default function BurgerBuilderPage() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true) }, []);

  if (!isMounted) return null;

  return (
    <BurgerProvider>
      <AppLayout />
    </BurgerProvider>
  );
}
