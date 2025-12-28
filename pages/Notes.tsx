
import React, { useState, useRef, useMemo } from 'react';
import { getStorageData, saveStorageData } from '../lib/storage';
import { Note, ResourceFile } from '../types';

export const Notes: React.FC = () => {
  const [data, setData] = useState(getStorageData());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '' });
  const [attachedFiles, setAttachedFiles] = useState<ResourceFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existingSubjects = useMemo(() => {
    const subjects = new Set(data.notes.map(n => n.subject));
    data.tasks.forEach(t => subjects.add(t.subject));
    data.exams.forEach(e => subjects.add(e.subject));
    return Array.from(subjects).filter(Boolean);
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }
      
      if (file.size > 1.5 * 1024 * 1024) {
        alert('File size too large for local storage (limit 1.5MB per file for this demo).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newResource: ResourceFile = {
          name: file.name,
          url: event.target?.result as string
        };
        setAttachedFiles(prev => [...prev, newResource]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addNote = () => {
    if (!newNote.title) return;
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title,
      content: newNote.content,
      subject: newNote.subject || 'General',
      lastReviewed: Date.now(),
      files: attachedFiles.length > 0 ? attachedFiles : undefined
    };
    const updatedData = { ...data, notes: [...data.notes, note] };
    setData(updatedData);
    saveStorageData(updatedData);
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewNote({ title: '', content: '', subject: '' });
    setAttachedFiles([]);
  };

  const deleteNote = (id: string) => {
    const updatedData = { ...data, notes: data.notes.filter(n => n.id !== id) };
    setData(updatedData);
    saveStorageData(updatedData);
  };

  const filteredNotes = data.notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.subject.toLowerCase().includes(search.toLowerCase())
  );

  const isDecaying = (timestamp: number) => {
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return (Date.now() - timestamp) > sevenDays;
  };

  const openFile = (url: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`<iframe src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold dark:text-white">Notes & Resources</h2>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="flex-1 md:w-64 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            + Create New Group
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.length === 0 && (
          <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <span className="text-4xl mb-4">📂</span>
            <p>Your library is empty. Organize notes and multiple PDFs together.</p>
          </div>
        )}
        {filteredNotes.map((note) => (
          <div key={note.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm relative group flex flex-col h-full hover:shadow-md transition-shadow">
            {isDecaying(note.lastReviewed) && (
              <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Needs Review</div>
            )}
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded uppercase">
                {note.subject}
              </span>
              <button onClick={() => deleteNote(note.id)} className="text-slate-400 hover:text-rose-500 transition-colors">🗑️</button>
            </div>
            
            <h3 className="text-xl font-bold mb-2 dark:text-white truncate">{note.title}</h3>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
              {note.content}
            </p>

            {note.files && note.files.length > 0 && (
              <div className="mt-2 space-y-2 flex-grow">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attached Resources ({note.files.length})</p>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {note.files.map((file, idx) => (
                    <div key={idx} className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 group/file">
                      <span className="text-lg">📄</span>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">{file.name}</p>
                      </div>
                      <button 
                        onClick={() => openFile(file.url)}
                        className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase hover:bg-indigo-50 dark:hover:bg-indigo-900/40 px-2 py-1 rounded transition-colors"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center text-xs text-slate-400 pt-4 mt-4 border-t border-slate-50 dark:border-slate-700">
              <span>{new Date(note.lastReviewed).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl p-8 space-y-4 shadow-2xl animate-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-bold dark:text-white">Create New Resource Group</h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Title (e.g., Mathematics - Unit 4)" 
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                value={newNote.title}
                onChange={(e) => setNewNote({...newNote, title: e.target.value})}
              />
              <div className="relative">
                <input 
                  list="subjects-list"
                  placeholder="Subject (e.g., Physics, Calculus)" 
                  className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  value={newNote.subject}
                  onChange={(e) => setNewNote({...newNote, subject: e.target.value})}
                />
                <datalist id="subjects-list">
                  {existingSubjects.map(sub => <option key={sub} value={sub} />)}
                </datalist>
              </div>
              <textarea 
                placeholder="Brief summary or description..." 
                className="w-full h-24 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
              />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">PDF Attachments</label>
                   <span className="text-[10px] text-slate-400">{attachedFiles.length} files selected</span>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-lg">📄</span>
                        <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{f.name}</span>
                      </div>
                      <button onClick={() => removeAttachedFile(i)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-1 rounded">✕</button>
                    </div>
                  ))}
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <input 
                    type="file" 
                    accept=".pdf" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <span className="text-2xl">➕</span>
                  <span className="text-xs font-medium text-slate-500">Attach more PDFs</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={closeModal}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={addNote}
                className="flex-1 px-4 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
              >
                Save Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
