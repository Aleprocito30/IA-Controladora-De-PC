import React, { useState, useEffect } from 'react';
import { AIProvider, BotConfiguration, PROVIDER_MODELS } from '../types';
import { Download, Key, Cpu, Mic, Lock } from 'lucide-react';
import { generatePythonScript } from '../utils/pythonGenerator';

interface ConfiguratorProps {
  onGenerate: (script: string) => void;
}

const Configurator: React.FC<ConfiguratorProps> = ({ onGenerate }) => {
  const [config, setConfig] = useState<BotConfiguration>({
    provider: AIProvider.GROQ,
    apiKey: '',
    model: PROVIDER_MODELS[AIProvider.GROQ][0],
    triggerWord: 'Ale Bot',
    language: 'es-ES'
  });

  const [loading, setLoading] = useState(false);

  // Update default values when provider changes
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      // Pre-fill with the first recommended model, but allow editing
      model: PROVIDER_MODELS[prev.provider][0] || '',
      apiKey: prev.provider === AIProvider.OLLAMA ? 'local_no_key_needed' : ''
    }));
  }, [config.provider]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate complex generation process
    setTimeout(() => {
      const script = generatePythonScript(config);
      onGenerate(script);
      setLoading(false);
    }, 1500);
  };

  const handleChange = (field: keyof BotConfiguration, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden max-w-4xl mx-auto my-12">
      <div className="bg-slate-900/50 p-6 border-b border-slate-700 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="text-neon-purple" />
          Configuración del Núcleo
        </h3>
        <span className="text-xs font-mono text-slate-500">SYSTEM_ID: ALE_BOT_GEN_V2</span>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        
        {/* Provider Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Proveedor de IA</label>
            <select
              value={config.provider}
              onChange={(e) => handleChange('provider', e.target.value as AIProvider)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none transition-all"
            >
              {Object.values(AIProvider).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Modelo Neuronal (Manual)</label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => handleChange('model', e.target.value)}
              placeholder="Ej: llama3-8b-8192"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none transition-all font-mono placeholder:text-slate-600"
              required
            />
            <p className="text-xs text-slate-500 break-words leading-relaxed">
              <span className="text-neon-cyan/80">Sugeridos:</span> {PROVIDER_MODELS[config.provider].join(', ')}
            </p>
          </div>
        </div>

        {/* API Key */}
        <div className="space-y-2">
           <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
             <Key className="w-4 h-4 text-neon-green" />
             API Key (Clave de Acceso)
           </label>
           <input
             type="password"
             value={config.apiKey}
             disabled={config.provider === AIProvider.OLLAMA}
             onChange={(e) => handleChange('apiKey', e.target.value)}
             placeholder={config.provider === AIProvider.OLLAMA ? "No requerida para Ollama Local" : "sk-..."}
             className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent outline-none font-mono transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             required={config.provider !== AIProvider.OLLAMA}
           />
           <p className="text-xs text-slate-500">
             {config.provider === AIProvider.GROQ && "Obtén tu key en console.groq.com. Es gratuita y extremadamente rápida."}
             {config.provider === AIProvider.OLLAMA && "Asegúrate de tener Ollama ejecutándose en el puerto 11434."}
             {config.provider === AIProvider.GEMINI && "Usa Google AI Studio para obtener tu clave Gemini."}
           </p>
        </div>

        {/* Safety & Trigger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-700/50">
            <div className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-lg border border-red-900/30">
                <Lock className="w-6 h-6 text-red-500 mt-1" />
                <div>
                    <h4 className="text-sm font-bold text-slate-200">Protocolo de Seguridad Activo</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        El script generado incluye bloqueos duros para: Chrome, System32, Powershell, Format, Shutdown, y Steam.
                    </p>
                </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-slate-900/30 rounded-lg border border-neon-cyan/20">
                <Mic className="w-6 h-6 text-neon-cyan mt-1" />
                <div>
                    <h4 className="text-sm font-bold text-slate-200">Activación por Voz</h4>
                    <p className="text-xs text-slate-400 mt-1">
                        Responde a: "Ale Bot", "Alevot", "AleBot", "Ali Bot".
                    </p>
                </div>
            </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-bold py-4 rounded-lg shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transform hover:scale-[1.01] transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? (
             <>
               <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
               Compilando Script Python...
             </>
          ) : (
             <>
               <Download className="w-5 h-5" />
               GENERAR ARCHIVO .PY
             </>
          )}
        </button>

      </form>
    </div>
  );
};

export default Configurator;