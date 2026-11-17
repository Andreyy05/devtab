import React, { useState } from 'react';
import { Copy, Check, Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ScratchpadWidget({ accentTheme }) {
  const [activeTab, setActiveTab] = useLocalStorage('devtab_widget_tab', 'todo');
  const [scratchContent, setScratchContent] = useLocalStorage('devtab_scratchpad', '// Quick scratchpad\n');
  const [todos, setTodos] = useLocalStorage('devtab_todos', [
    { id: '1', text: 'Push streak commit to GitHub', completed: true },
    { id: '2', text: 'Review project issues', completed: false },
    { id: '3', text: 'Draft daily log', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scratchContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    setTodos([
      ...todos,
      {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
      },
    ]);
    setNewTodoText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="w-full bg-white/[0.04] border border-white/[0.08] rounded-3xl p-5 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
      {/* Apple-style Segmented Control */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-3">
        <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'todo'
                ? 'bg-white/[0.12] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Reminders
            {todos.length > 0 && (
              <span className="ml-1.5 text-[10px] text-neutral-400">
                {completedCount}/{todos.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scratch')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'scratch'
                ? 'bg-white/[0.12] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Notes
          </button>
        </div>

        {/* Tab Actions */}
        {activeTab === 'scratch' ? (
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs text-neutral-300 hover:text-white transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-[#30d158]" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        ) : (
          completedCount > 0 && (
            <button
              onClick={clearCompletedTodos}
              className="text-[11px] text-neutral-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )
        )}
      </div>

      {/* Reminders List */}
      {activeTab === 'todo' && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleTodo(todo.id)}
                  className="flex items-center gap-2.5 text-left flex-1 min-w-0"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#30d158] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-neutral-400 hover:text-neutral-300 shrink-0" />
                  )}
                  <span
                    className={`text-xs transition-colors truncate select-none ${
                      todo.completed ? 'line-through text-neutral-500' : 'text-white/90'
                    }`}
                  >
                    {todo.text}
                  </span>
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-neutral-300 transition-opacity"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}

            {todos.length === 0 && (
              <div className="py-6 text-center text-xs text-neutral-400">
                No reminders.
              </div>
            )}
          </div>

          <form onSubmit={handleAddTodo} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="New reminder..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-white/[0.2] text-xs text-white placeholder-neutral-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="w-7 h-7 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white flex items-center justify-center transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Apple Notes style Scratchpad */}
      {activeTab === 'scratch' && (
        <div className="flex-1 flex flex-col justify-between">
          <textarea
            value={scratchContent}
            onChange={(e) => setScratchContent(e.target.value)}
            placeholder="Type notes here..."
            rows={6}
            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 text-xs font-mono text-neutral-200 placeholder-neutral-500 outline-none focus:border-white/[0.15] resize-none transition-all"
            spellCheck={false}
          />
          <div className="mt-2 text-[10px] text-neutral-400 flex justify-between">
            <span>{scratchContent.length} characters</span>
            <span>Saved</span>
          </div>
        </div>
      )}
    </div>
  );
}
