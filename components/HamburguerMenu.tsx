"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Início", href: "/", id: "01" },
    { name: "Notícias", href: "/noticias", id: "02" },
    { name: "Sobre Nós", href: "/sobre", id: "03" },
  ];

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  // Variantes para cada link individual
  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <>
      {/* BOTÃO HAMBÚRGUER */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Abrir Menu"
        className="fixed top-8 right-8 z-[60] w-14 h-14 flex flex-col justify-center items-center gap-1.5 bg-gradient-to-r from-blue-950 to-blue-800 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all duration-300 border  border-white/20 group cursor-pointer">
        <motion.span
          animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          className="w-7 h-[2px] bg-white rounded-full"
        />
        <motion.span
          animate={open ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
          className="w-7 h-[2px] bg-white rounded-full"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          className="w-7 h-[2px] bg-white rounded-full"
        />
      </button>

      {/* OVERLAY DO MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          >
            {/* BACKGROUND COM GRADIENTE E BLUR PESADO */}
            <div className="absolute inset-0 bg-blue-950/90 backdrop-blur-3xl" />
            
            {/* ELEMENTOS DECORATIVOS (ORBS) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />

            <nav className="relative z-10 w-full max-w-2xl px-10">
              <motion.div
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="flex flex-col gap-8"
              >
                {menuItems.map((item) => (
                  <motion.div key={item.id} >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 md:gap-8 transition-transform duration-300 active:scale-95"
                    >
                      <span className="text-sm md:text-lg font-mono text-blue-400 opacity-70 group-hover:text-white transition-colors">
                        {item.id}
                      </span>
                      <span className="relative text-5xl md:text-7xl font-bold text-white tracking-tighter">
                        {item.name}
                        {/* UNDERLINE ANIMADO */}
                        <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-500 group-hover:w-full" />
                      </span>
                      
                      {/* SETA QUE APARECE NO HOVER */}
                      <span className="text-4xl text-white opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hidden md:block">
                        →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </nav>

            {/* RODAPÉ DO MENU */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6 text-white/40 text-sm uppercase tracking-widest"
            >
              <span>Instagram</span>
              <span>LinkedIn</span>
              <span>Twitter</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}