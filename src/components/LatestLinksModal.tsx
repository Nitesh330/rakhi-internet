import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Sparkles, Clock, Globe } from 'lucide-react';

interface LatestLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: {title: string, link: string, pubDate: string, source: string}[];
  isLoading: boolean;
}

export default function LatestLinksModal({ isOpen, onClose, jobs, isLoading }: LatestLinksModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 pointer-events-none z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col pointer-events-auto overflow-hidden border border-gray-200"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Latest Govt & Haryana Updates</h2>
                    <p className="text-blue-100 text-sm">Automatically updated real-time information</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-white/80 hover:bg-white/10 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Fetching the latest updates...</p>
                  </div>
                ) : jobs.length > 0 ? (
                  <div className="space-y-4" style={{ perspective: '1000px' }}>
                    {jobs.map((job, idx) => (
                      <motion.a 
                        key={idx} 
                        href={job.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        initial={{ opacity: 0, y: 30, rotateX: 15 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 100, 
                          damping: 15, 
                          delay: idx * 0.05 
                        }}
                        whileHover={{ 
                          scale: 1.02, 
                          rotateX: 2, 
                          rotateY: -2, 
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                          zIndex: 10
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 transition-all group relative overflow-hidden transform-gpu"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 group-hover:bg-cyan-500 transition-colors"></div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                <Sparkles className="w-3 h-3" />
                                Verified & Real-Time
                              </span>
                              <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded flex items-center">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                                Live
                              </span>
                            </div>
                            <h3 className="text-gray-900 font-bold text-base sm:text-lg group-hover:text-blue-700 transition-colors leading-snug pr-4">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-4 mt-3 flex-wrap">
                              <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                                <Globe className="w-3.5 h-3.5 text-blue-500" />
                                {job.source === 'Haryana' ? 'Haryana State Govt.' : 'All India Govt.'}
                              </span>
                              {job.pubDate && (
                                <span className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  {new Date(job.pubDate).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0 shadow-sm mt-1">
                            <ExternalLink className="w-5 h-5" />
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No updates available right now.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
