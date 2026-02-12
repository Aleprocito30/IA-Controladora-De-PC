import React from 'react';
import { Bot, Terminal, Shield, Cpu } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 pt-16 pb-32 space-y-24">
      <div className="relative">
        <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
          <div className="px-4 max-w-xl mx-auto sm:px-6 lg:py-32 lg:max-w-none lg:mx-0 lg:px-0 lg:col-start-2">
            <div className="relative rounded-2xl p-6 bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-neon-cyan/20 rounded-full blur-xl"></div>
                <div className="font-mono text-neon-cyan mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span>SYSTEM_STATUS: ONLINE</span>
                </div>
                <h2 className="text-4xl font-extrabold tracking-tight text-white">
                  AleBot <span className="text-neon-purple">v2.0</span>
                </h2>
                <p className="mt-4 text-lg text-slate-300">
                  La Inteligencia Artificial definitiva para control de escritorio. 
                  Ejecuta comandos por voz, controla periféricos y mantiene tu seguridad con protocolos Void.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                   <div className="flex items-center gap-2 text-slate-400">
                      <Shield className="w-5 h-5 text-neon-green" />
                      <span>Void Protocol Safe</span>
                   </div>
                   <div className="flex items-center gap-2 text-slate-400">
                      <Cpu className="w-5 h-5 text-neon-purple" />
                      <span>Multi-LLM Core</span>
                   </div>
                </div>
            </div>
          </div>
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-start-1">
            <div className="pr-4 -ml-48 sm:pr-6 md:-ml-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
               <div className="w-full h-full flex items-center justify-center">
                  <Bot className="w-64 h-64 text-slate-700 opacity-20 animate-pulse absolute" />
                  <div className="relative z-10 p-8 border border-neon-cyan/30 bg-black/40 rounded-full">
                     <Bot className="w-32 h-32 text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;