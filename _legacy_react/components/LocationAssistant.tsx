import React, { useState } from 'react';
import { Send, MapPin, Loader2, Navigation } from 'lucide-react';
import { askLocationAssistant } from '../services/geminiService';
import { GroundingChunk } from '../types';

const LocationAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [chunks, setChunks] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    setChunks([]);

    try {
      const result = await askLocationAssistant(query);
      setResponse(result.text);
      setChunks(result.groundingMetadata?.groundingChunks || []);
    } catch (error) {
      setResponse("Sorry, I couldn't find that information right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="location" className="flex w-full justify-center bg-background-light py-16">
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
        <div className="flex flex-col max-w-[960px] flex-1 bg-white rounded-2xl shadow-sm border border-[#cfe7d7] overflow-hidden">
          <div className="bg-surface-dark p-8 md:p-10 text-center">
            <h2 className="text-white text-3xl font-bold mb-4">Explore the Camp Area</h2>
            <p className="text-gray-300 max-w-xl mx-auto mb-8">
              Ask our AI assistant about hiking trails, restaurants, or directions near Camp Lakota. 
              Powered by Google Maps data.
            </p>
            
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., What are good hiking trails nearby?"
                className="w-full h-14 pl-6 pr-14 rounded-full border-none focus:ring-2 focus:ring-primary shadow-lg text-text-main text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-text-main hover:brightness-110 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </form>
          </div>

          {(response || loading) && (
            <div className="p-8 md:p-10 animate-fade-in">
              {loading ? (
                <div className="flex flex-col items-center gap-4 text-gray-500 py-10">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p>Searching Google Maps...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="prose prose-green max-w-none text-gray-700">
                    <p className="whitespace-pre-line leading-relaxed">{response}</p>
                  </div>

                  {chunks.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        <MapPin size={16} /> Locations Found
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {chunks.map((chunk, index) => {
                          if (chunk.maps) {
                            return (
                              <a 
                                key={index} 
                                href={chunk.maps.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/50 hover:bg-green-50/50 transition-all group"
                              >
                                <div className="mt-1 min-w-[32px] h-8 bg-green-100 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                  <Navigation size={18} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">
                                    {chunk.maps.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">View on Google Maps</p>
                                </div>
                              </a>
                            );
                          } else if (chunk.web) {
                             return (
                               <a 
                                key={index} 
                                href={chunk.web.uri} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-primary/50 hover:bg-green-50/50 transition-all group"
                              >
                                 <div className="mt-1 min-w-[32px] h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                  <Navigation size={18} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-text-main group-hover:text-blue-600 transition-colors">
                                    {chunk.web.title}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">Source Website</p>
                                </div>
                              </a>
                             );
                          }
                          return null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationAssistant;