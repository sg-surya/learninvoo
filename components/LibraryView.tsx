
import React, { useState, useRef } from 'react';
import { Book, Download, ExternalLink, Search, Plus, X, Upload, Image as ImageIcon, BookOpen, GraduationCap, User } from 'lucide-react';

interface Resource {
  title: string;
  author: string;
  subject: string;
  classLevel: string;
  type: string;
  cover?: string;
  color: string;
  iconColor: string;
}

const THEMES = [
  { color: 'bg-lime-100', iconColor: 'text-lime-600' },
  { color: 'bg-sky-100', iconColor: 'text-sky-600' },
  { color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { color: 'bg-orange-100', iconColor: 'text-orange-600' },
  { color: 'bg-purple-100', iconColor: 'text-purple-600' },
  { color: 'bg-rose-100', iconColor: 'text-rose-600' },
];

const LibraryView: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newBook, setNewBook] = useState({ 
    title: '', 
    author: '', 
    subject: '', 
    classLevel: '', 
    type: 'PDF' 
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;

    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    
    const resource: Resource = {
      ...newBook,
      cover: coverPreview || undefined,
      color: randomTheme.color,
      iconColor: randomTheme.iconColor
    };

    setResources([resource, ...resources]);
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setNewBook({ title: '', author: '', subject: '', classLevel: '', type: 'PDF' });
    setCoverPreview(null);
  };

  return (
    <div className="p-8 w-full min-h-full relative">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Library</h2>
          <p className="text-gray-400 text-sm">Your personal collection of academic books and guides.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search library..." 
              className="bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-lime-100 w-64"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-lime-900 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:bg-black transition-all"
          >
            <Plus size={18} />
            <span className="text-sm">Add Book</span>
          </button>
        </div>
      </header>

      {resources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
            <Book size={48} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your library is empty</h3>
          <p className="text-gray-400 max-w-xs mx-auto mb-8">Start adding your favorite academic books and resources to keep them organized.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-lime-600 font-bold hover:underline flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            Add your first book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {resources.map((res, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-lime-50 transition-all group cursor-pointer border-b-4 border-b-transparent hover:border-b-lime-500">
              <div className="h-48 bg-gray-50 relative overflow-hidden">
                {res.cover ? (
                  <img src={res.cover} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className={`w-full h-full ${res.color} flex items-center justify-center`}>
                    <Book className={`${res.iconColor} opacity-40`} size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-700 shadow-sm uppercase tracking-wider">
                  {res.type}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{res.title}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-4 font-medium italic">by {res.author}</p>
                
                <div className="flex gap-2 mb-6">
                  <span className="bg-lime-50 text-lime-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{res.subject}</span>
                  <span className="bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md">{res.classLevel}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <button className="text-gray-300 hover:text-lime-600 transition-colors">
                    <Download size={18} />
                  </button>
                  <button className="flex items-center gap-1.5 text-lime-700 text-xs font-bold hover:underline">
                    Read <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Add New Resource</h3>
              
              <form onSubmit={handleAddBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title</label>
                    <input 
                      required
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium"
                      placeholder="Book Title"
                      value={newBook.title}
                      onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Author</label>
                    <input 
                      required
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium"
                      placeholder="Author Name"
                      value={newBook.author}
                      onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</label>
                    <input 
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium"
                      placeholder="e.g. Mathematics"
                      value={newBook.subject}
                      onChange={(e) => setNewBook({...newBook, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Class/Level</label>
                    <input 
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-lime-500/20 font-medium"
                      placeholder="e.g. Grade 10"
                      value={newBook.classLevel}
                      onChange={(e) => setNewBook({...newBook, classLevel: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:border-lime-500 hover:bg-lime-50/50 transition-all overflow-hidden"
                    >
                      {coverPreview ? (
                        <img src={coverPreview} className="w-full h-full object-cover" alt="Cover preview" />
                      ) : (
                        <div className="text-center text-gray-300">
                          <ImageIcon size={24} className="mx-auto mb-1" />
                          <span className="text-[10px] font-bold">Upload</span>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <div className="text-xs text-gray-400 max-w-[200px]">
                      Click box to upload a cover image. Supported formats: JPG, PNG.
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-lime-900 text-white rounded-xl py-4 font-bold text-sm hover:bg-black transition-all shadow-lg mt-4"
                >
                  Add to Library
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;