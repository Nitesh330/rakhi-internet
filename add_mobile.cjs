const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `                              <span className="text-[9px] text-blue-600 font-extrabold uppercase tracking-wider block leading-none mb-0.5">
                                AI Tools
                              </span>
                              <span className="text-xs font-black text-slate-700">
                                Photo Background Remover
                              </span>
                            </div>
                          </button>`;

const replace1 = target1 + `

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
    content = content.replace(target1, replace1);
}

const target2 = `                  <li>
                    <button
                      onClick={() => {
                        setPhotoToolActiveTab("bg-remover");
                        setPhotoToolsModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <Scissors className="w-4 h-4" /> Background Remover
                    </button>
                  </li>`;
const replace2 = target2 + `
                  <li>
                    <button
                      onClick={() => {
                        setImageResizerModalOpen(true);
                      }}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-left"
                    >
                      <Sparkles className="w-4 h-4" /> Image Resizer
                    </button>
                  </li>`;

if (!content.includes('<Sparkles className="w-4 h-4" /> Image Resizer')) {
    content = content.replace(target2, replace2);
}

fs.writeFileSync('src/App.tsx', content);
