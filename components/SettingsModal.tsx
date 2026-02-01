
import React from 'react';
import { testApiKey } from '../services/geminiService';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [keyInput, setKeyInput] = React.useState('');
  const [isTesting, setIsTesting] = React.useState(false);
  const [status, setStatus] = React.useState<{type: 'success' | 'error' | 'none', message: string}>({type: 'none', message: ''});
  const [hasSavedKey, setHasSavedKey] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('user_gemini_api_key');
    if (saved) {
      setHasSavedKey(true);
    }
  }, []);

  const handleSaveAndTest = async () => {
    if (!keyInput.trim()) return;
    
    setIsTesting(true);
    setStatus({type: 'none', message: ''});
    
    const isValid = await testApiKey(keyInput.trim());
    
    if (isValid) {
      localStorage.setItem('user_gemini_api_key', btoa(keyInput.trim()));
      setHasSavedKey(true);
      setStatus({type: 'success', message: '연결 성공! API Key가 안전하게 저장되었습니다.'});
      setKeyInput('');
    } else {
      setStatus({type: 'error', message: '연결 실패. API Key를 다시 확인해주세요.'});
    }
    setIsTesting(false);
  };

  const handleDelete = () => {
    if (confirm('저장된 API Key를 삭제하시겠습니까? 삭제 후에는 게임 시작 전 다시 설정해야 합니다.')) {
      localStorage.removeItem('user_gemini_api_key');
      setHasSavedKey(false);
      setStatus({type: 'none', message: '저장된 API Key가 삭제되었습니다.'});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-emerald-900/50 flex justify-between items-center bg-emerald-950/20">
          <h2 className="text-2xl font-black text-emerald-400 font-cafe24-magic">
            <i className="fas fa-cog mr-2"></i> 설정
          </h2>
          <button onClick={onClose} className="text-emerald-700 hover:text-emerald-400 text-2xl transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-emerald-200 font-bold text-lg">Gemini API Key</label>
              {hasSavedKey && (
                <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded-md border border-emerald-800">
                  <i className="fas fa-lock mr-1"></i> 현재 키 저장됨
                </span>
              )}
            </div>
            
            <div className="relative">
              <input 
                type="password"
                placeholder="AI Studio에서 발급받은 키를 입력하세요"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full bg-black/50 border-2 border-emerald-900/50 rounded-xl px-5 py-4 outline-none focus:border-emerald-500 text-emerald-100 font-mono transition-all"
              />
            </div>
            
            <p className="text-xs text-emerald-700 leading-relaxed">
              * 입력하신 키는 서버로 전송되지 않으며, 브라우저의 로컬 스토리지에 암호화되어 안전하게 보관됩니다. Vercel 배포 버전에서도 개인별로 키를 설정하여 사용할 수 있습니다.
            </p>
          </section>

          {status.type !== 'none' && (
            <div className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-rose-900/30 border-rose-500 text-rose-400'
            }`}>
              <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}`}></i>
              {status.message}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={handleSaveAndTest}
              disabled={isTesting || !keyInput.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <i className="fas fa-spinner animate-spin"></i>
              ) : (
                <i className="fas fa-save"></i>
              )}
              연결 테스트 및 저장
            </button>
            
            {hasSavedKey && (
              <button
                onClick={handleDelete}
                className="w-full bg-rose-900/10 hover:bg-rose-900/20 text-rose-400 font-bold py-3 rounded-xl border border-rose-900/30 transition-all flex items-center justify-center gap-2"
              >
                <i className="fas fa-trash-alt"></i>
                API Key 삭제
              </button>
            )}
          </div>
        </div>

        <div className="p-4 bg-black/30 text-center">
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-500 text-sm hover:underline font-bold"
          >
            API Key 발급받기 (Google AI Studio) <i className="fas fa-external-link-alt ml-1"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
