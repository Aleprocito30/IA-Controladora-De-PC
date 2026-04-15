import React, { useState } from 'react';
import Hero from './components/Hero';
import Configurator from './components/Configurator';
import { Bot, CheckCircle, Copy, Download, Terminal } from 'lucide-react';

const App = () => {
  const [generatedScript, setGeneratedScript] = useState<string | null>(null);

  const handleDownload = () => {
    if (!generatedScript) return;
    const blob = new Blob([generatedScript], { type: 'text/x-python' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alebot_core.py';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      alert("Código copiado al portapapeles");
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 selection:bg-neon-cyan selection:text-black font-sans">
      
      {/* Header */}
      <nav className="border-b border-slate-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Bot className="h-8 w-8 text-neon-cyan" />
              <span className="font-mono font-bold text-xl tracking-tighter text-white">
                ALEBOT<span className="text-neon-purple">.CONF</span>
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <span className="text-xs font-mono text-neon-green px-3 py-1 bg-neon-green/10 rounded-full border border-neon-green/20">
                  SYSTEM READY
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {!generatedScript ? (
          <>
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
               <Configurator onGenerate={setGeneratedScript} />
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="bg-slate-900 border border-neon-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.1)]">
              
              <div className="p-8 border-b border-slate-800 bg-slate-900/80 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <CheckCircle className="text-neon-green w-8 h-8" />
                    Script Generado con Éxito
                  </h2>
                  <p className="mt-2 text-slate-400">
                    Tu asistente personal AleBot ha sido compilado. Sigue las instrucciones para ejecutarlo.
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <button onClick={handleCopy} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                    <Copy className="w-4 h-4" /> Copiar
                  </button>
                  <button onClick={handleDownload} className="px-6 py-2 bg-neon-cyan hover:bg-cyan-400 text-black font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-cyan-500/20">
                    <Download className="w-4 h-4" /> Descargar .py
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Instructions Side */}
                <div className="p-8 bg-slate-800/50 lg:border-r border-slate-700 space-y-6">
                  <h3 className="font-mono font-bold text-lg text-neon-purple mb-4">
                    // GUÍA DE INSTALACIÓN
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">1</div>
                      <div>
                        <h4 className="font-bold text-white">Instalar Python</h4>
                        <p className="text-sm text-slate-400">Asegúrate de tener Python 3.10+ instalado.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">2</div>
                      <div>
                        <h4 className="font-bold text-white">Instalar Dependencias</h4>
                        <div className="mt-2 bg-black p-3 rounded border border-slate-600 font-mono text-xs text-green-400 break-all">
                          pip install pyautogui SpeechRecognition pyaudio requests psutil colorama
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white shrink-0">3</div>
                      <div>
                        <h4 className="font-bold text-white">Ejecutar</h4>
                        <div className="mt-2 bg-black p-3 rounded border border-slate-600 font-mono text-xs text-green-400 break-all">
                          python alebot_core.py
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-200">
                    <p className="font-bold">Nota de Seguridad:</p>
                    Para permitir que AleBot controle aplicaciones de sistema, es posible que necesites ejecutar la terminal como <strong>Administrador</strong>.
                  </div>
                  
                  <button 
                    onClick={() => setGeneratedScript(null)}
                    className="w-full mt-4 py-3 text-sm text-slate-400 hover:text-white underline decoration-slate-600 hover:decoration-white transition-all"
                  >
                    ← Volver a configurar
                  </button>
                </div>

                {/* Code Preview Side */}
                <div className="lg:col-span-2 bg-[#0d1117] p-0 overflow-hidden flex flex-col max-h-[600px]">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                     <span className="text-xs font-mono text-slate-400">alebot_core.py</span>
                     <div className="flex gap-1.5">
                       <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                     </div>
                  </div>
                  <pre className="p-6 font-mono text-sm text-slate-300 overflow-auto scrollbar-hide">
                    <code>{generatedScript}</code>
                  </pre>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-black mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-slate-500 text-sm">
             AleBot Project &copy; 2024. Diseñado para control total.
           </p>
           <p className="text-slate-700 text-xs mt-2 font-mono">
             NO NOS HACEMOS RESPONSABLES POR EL USO DE ESTA HERRAMIENTA.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;