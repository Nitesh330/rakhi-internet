const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetButtons = `                    {/* Context-Specific Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
                      {HERO_SLIDES[currentSlide].type === "courier" ? (
                        <>
                          <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
                            {["Narnaund", "Jind", "Uchana"].map((loc) => (
                              <div
                                key={loc}
                                className="flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-wider"
                              >
                                <MapPin className="w-3 h-3 text-cyan-400" />
                                {loc}
                              </div>
                            ))}
                          </div>`;

const replacementButtons = `                    {/* Context-Specific Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2 relative z-20">
                      {HERO_SLIDES[currentSlide].type === "courier" ? (
                        <>
                          <div className="flex flex-wrap justify-center gap-3 mb-6 w-full perspective-[1000px]">
                            {["Narnaund", "Jind", "Uchana"].map((loc, idx) => (
                              <motion.div
                                key={loc}
                                initial={{ opacity: 0, rotateX: 90, z: -50 }}
                                animate={{ opacity: 1, rotateX: 0, z: 0 }}
                                transition={{ 
                                  duration: 0.8, 
                                  delay: idx * 0.2, 
                                  type: "spring",
                                  bounce: 0.5
                                }}
                                whileHover={{ 
                                  rotateY: 15, 
                                  rotateX: -10, 
                                  scale: 1.1, 
                                  z: 20 
                                }}
                                className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-black uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.2)] cursor-pointer hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] hover:border-cyan-400/60 transition-colors"
                                style={{ transformStyle: "preserve-3d" }}
                              >
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                                {loc}
                              </motion.div>
                            ))}
                          </div>`;

content = content.replace(targetButtons, replacementButtons);

const targetAnim = `              {/* Manual Left/Right Arrows - Hidden on small mobile, visible & elegant on larger viewports */}`;

const replacementAnim = `              {/* Flying Airplanes for Courier Slide */}
              <AnimatePresence>
                {HERO_SLIDES[currentSlide].type === "courier" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 pointer-events-none z-[5] overflow-hidden"
                  >
                    <img src="/plane_silver.png" className="absolute w-16 h-16 opacity-80" style={{ animation: 'fly1 6s linear infinite' }} alt="plane" />
                    <img src="/plane2.png" className="absolute w-12 h-12 opacity-80" style={{ animation: 'fly2 8s linear infinite' }} alt="plane" />
                    <img src="/plane3.png" className="absolute w-14 h-14 opacity-80" style={{ animation: 'fly3 7s linear infinite' }} alt="plane" />
                    <img src="/plane.png" className="absolute w-10 h-10 opacity-80" style={{ animation: 'fly4 9s linear infinite' }} alt="plane" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Manual Left/Right Arrows - Hidden on small mobile, visible & elegant on larger viewports */}`;

content = content.replace(targetAnim, replacementAnim);

fs.writeFileSync('src/App.tsx', content, 'utf8');
console.log("Updated 3D branch names and airplanes.");
