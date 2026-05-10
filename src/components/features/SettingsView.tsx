import { useState, useEffect } from "react";
import { Moon, Languages, Palette, Trash2, Smartphone, Volume2, SmartphoneNfc, Check, Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { THEMES, ThemeName, applyTheme, CustomTheme, saveTheme, getSavedTheme } from "../../lib/theme";
import { useHistory, useSettings, useTranslation } from "../../lib/hooks";

export function SettingsView() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>('blue');
  const [isCustom, setIsCustom] = useState(false);
  const [customTheme, setCustomTheme] = useState<CustomTheme>(THEMES.blue);
  const { clearAllData } = useHistory();
  const { settings, saveSettings } = useSettings();
  const { T } = useTranslation();

  useEffect(() => {
    const { name, custom } = getSavedTheme();
    setActiveTheme(name);
    if (custom) {
      setCustomTheme(custom);
      setIsCustom(name === 'custom');
    }
  }, []);

  const handleThemeSelect = (name: ThemeName) => {
    setActiveTheme(name);
    setIsCustom(name === 'custom');
    const theme = THEMES[name as keyof typeof THEMES];
    if (theme) {
      applyTheme(theme);
      saveTheme(name);
    }
  };

  const handleCustomChange = (key: keyof CustomTheme, value: string) => {
    const newTheme = { ...customTheme, [key]: value };
    setCustomTheme(newTheme);
    if (isCustom) {
      applyTheme(newTheme);
      saveTheme('custom', newTheme);
    }
  };

  const handleClearData = () => {
    if (confirm("This will permanently delete all records and history. Are you sure?")) {
      clearAllData();
      alert("All data cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Theme Selection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Palette className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">{T('appearance')}</h3>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {(Object.keys(THEMES) as ThemeName[]).map((name) => (
            <button
              key={name}
              onClick={() => handleThemeSelect(name)}
              className={`h-12 rounded-2xl border-2 transition-all relative overflow-hidden flex items-center justify-center ${activeTheme === name ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white/5 opacity-60'}`}
              style={{ backgroundColor: THEMES[name as keyof typeof THEMES].bg }}
            >
              <div 
                className="w-5 h-5 rounded-full" 
                style={{ backgroundColor: THEMES[name as keyof typeof THEMES].primary }} 
              />
              {activeTheme === name && <Check className="w-3 h-3 text-white absolute bottom-1 right-1" />}
            </button>
          ))}
          <button
            onClick={() => handleThemeSelect('custom')}
            className={`h-12 rounded-2xl border-2 transition-all relative overflow-hidden flex items-center justify-center ${activeTheme === 'custom' ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white/5 opacity-60'}`}
            style={{ backgroundColor: customTheme.bg }}
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </section>

      {/* Custom Theme Editor */}
      {isCustom && (
        <section className="bg-bg-card rounded-[32px] p-6 border border-primary/20 animate-fade-in space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Custom Theme Editor</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(customTheme).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">{key}</label>
                <div className="flex items-center gap-2 bg-zinc-950 p-2 rounded-xl border border-white/5">
                  <input 
                    type="color" 
                    value={value} 
                    onChange={(e) => handleCustomChange(key as keyof CustomTheme, e.target.value)}
                    className="w-6 h-6 rounded-lg bg-transparent border-none cursor-pointer"
                  />
                  <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => handleCustomChange(key as keyof CustomTheme, e.target.value)}
                    className="bg-transparent text-[10px] uppercase font-mono w-full outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* App Preferences */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Smartphone className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">{T('preferences')}</h3>
        </div>
        <div className="bg-bg-card rounded-[32px] overflow-hidden border border-white/5 divide-y divide-white/5">
        <div className="flex flex-col">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-300">{T('sounds')}</span>
            </div>
            <ToggleButton 
              enabled={settings.sounds} 
              onChange={(val) => saveSettings({ sounds: val })} 
            />
          </div>
          {settings.sounds && (
            <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{T('volume')}</span>
                <span className="text-[10px] font-mono text-primary">{settings.soundVolume}%</span>
              </div>
              <input 
                type="range"
                min="0"
                max="100"
                value={settings.soundVolume}
                onChange={(e) => saveSettings({ soundVolume: parseInt(e.target.value) })}
                className="w-full accent-primary h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SmartphoneNfc className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-300">{T('haptic')}</span>
            </div>
            <ToggleButton 
              enabled={settings.haptic} 
              onChange={(val) => saveSettings({ haptic: val })} 
            />
          </div>
          {settings.haptic && (
            <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{T('intensity')}</span>
                <span className="text-[10px] font-mono text-primary">{settings.hapticIntensity}ms</span>
              </div>
              <input 
                type="range"
                min="5"
                max="50"
                value={settings.hapticIntensity}
                onChange={(e) => saveSettings({ hapticIntensity: parseInt(e.target.value) })}
                className="w-full accent-primary h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-300">{T('language')}</span>
          </div>
          <select 
            value={settings.language}
            onChange={(e) => saveSettings({ language: e.target.value as any })}
            className="bg-transparent text-sm text-primary font-bold outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
          </select>
        </div>
      </div>
    </section>

      {/* Danger Zone */}
      <section className="bg-bg-card rounded-[32px] p-6 border border-white/5">
        <h4 className="text-[10px] uppercase font-bold text-red-500 tracking-[0.2em] mb-4">{T('danger_zone')}</h4>
        <Button variant="secondary" onClick={handleClearData} className="w-full justify-start gap-4 text-red-400 hover:text-red-300 hover:bg-red-500/5 py-4 px-6 rounded-2xl border-white/5">
          <Trash2 className="w-5 h-5" /> 
          <div className="text-left">
            <p className="font-bold text-sm">{T('reset_data')}</p>
            <p className="text-[10px] opacity-70">{T('wipe_info')}</p>
          </div>
        </Button>
      </section>

      <div className="text-center py-8 opacity-20 flex flex-col items-center">
        <p className="text-[10px] uppercase tracking-[0.5em] font-medium">{T('app_name' as any)} v2.0.0 (Premium)</p>
        <p className="text-[8px] mt-1">NO FIREBASE • 100% OFFLINE • PRIVACY FIRST</p>
        <div className="creator-tag mt-8 !opacity-100">
          <span>@saif_ali_official_07</span>
        </div>
      </div>
    </div>
  );
}

function ToggleButton({ enabled, onChange }: { enabled: boolean, onChange: (val: boolean) => void }) {
  return (
    <button 
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition-all duration-300 relative ${enabled ? "bg-primary" : "bg-slate-700"}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${enabled ? "left-7" : "left-1"}`} />
    </button>
  );
}
