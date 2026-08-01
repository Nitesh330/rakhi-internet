const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const mobileButtonTarget = `                              <span className="text-xs font-black text-slate-700">
                                Background Remover
                              </span>
                            </div>
                          </button>`;

const mobileButtonReplace = mobileButtonTarget + `

                          <button
                            onClick={() => {
                              setImageResizerModalOpen(true);
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 p-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                AI Tools
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Image Resizer
                              </span>
                            </div>
                          </button>`;

if (!content.includes('Image Resizer</span>')) {
    content = content.replace(mobileButtonTarget, mobileButtonReplace);
}

fs.writeFileSync('src/App.tsx', content);
