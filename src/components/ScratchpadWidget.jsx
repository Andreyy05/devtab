import React, { useState } from 'react';
import { FileCode, CheckSquare, Copy, Check, Trash2, Plus, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function ScratchpadWidget({ accentTheme }) {
  const [activeTab, setActiveTab] = useLocalStorage('devtab_widget_tab', 'todo');
  const [scratchContent, setScratchContent] = useLocalStorage('devtab_scratchpad', '// Quick scratchpad for code snippets, API tokens, commands\nconst apiKey = "demo_key";\n');
  const [todos, setTodos] = useLocalStorage('devtab_todos', [
    { id: '1', text: 'Push daily commit to GitHub', completed: true },
    { id: '2', text: 'Review pull requests and issues', completed: false },
    { id: '3', text: 'Learn something new today', completed: false },
  ]);
  const [newTodoText, setNewTodoText] = useState('');
  const [copied, setCopied] = useState(false);

  // Scratchpad metrics
  const linesCount = scratchContent.split('\n').length;
  const charsCount = scratchContent.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scratchContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
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
    const updated = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTodos(updated);

    // If all tasks are completed, trigger confetti!
    const allDone = updated.length > 0 && updated.every((t) => t.completed);
    if (allDone) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      });
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const clearCompletedTodos = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  return (
    <div className="w-full bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden shadow-xl flex flex-col justify-between">
      {/* Widget Tabs */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800/60 mb-3">
        <div className="flex items-center gap-1 bg-neutral-950/80 p-1 rounded-xl border border-neutral-800/80">
          <button
            onClick={() => setActiveTab('todo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'todo'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Daily Tasks</span>
            {todos.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-900 text-neutral-400 font-mono">
                {completedCount}/{todos.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scratch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'scratch'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scratchpad</span>
          </button>
        </div>

        {/* Action icons depending on tab */}
        {activeTab === 'scratch' ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 hover:text-white transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={() => setScratchContent('')}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-rose-950/50 text-neutral-400 hover:text-rose-400 transition-colors"
              title="Clear scratchpad"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          completedCount > 0 && (
            <button
              onClick={clearCompletedTodos}
              className="text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors font-medium"
            >
              Clear completed
            </button>
          )
        )}
      </div>

      {/* Tab Content: Daily Tasks */}
      {activeTab === 'todo' && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Progress Bar */}
          {todos.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1 font-mono">
                <span>Completion</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Todo List Items */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="group flex items-center justify-between p-2 rounded-xl bg-neutral-950/40 hover:bg-neutral-950/80 border border-neutral-850 hover:border-neutral-800 transition-colors"
              >
                <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-4 h-4 rounded bg-neutral-900 border-neutral-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span
                    className={`text-xs transition-all truncate select-none ${
                      todo.completed
                        ? 'line-through text-neutral-500'
                        : 'text-neutral-200 font-medium'
                    }`}
                  >
                    {todo.text}
                  </span>
                </label>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-neutral-500 hover:text-rose-400 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {todos.length === 0 && (
              <div className="py-6 text-center text-xs text-neutral-500">
                All caught up! Add a new task below.
              </div>
            )}
          </div>

          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="mt-3 flex items-center gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task (press Enter)..."
              className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 focus:border-emerald-500 text-xs text-white placeholder-neutral-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shrink-0"
              title="Add task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab Content: Scratchpad */}
      {activeTab === 'scratch' && (
        <div className="flex-1 flex flex-col justify-between">
          <textarea
            value={scratchContent}
            onChange={(e) => setScratchContent(e.target.value)}
            placeholder="Type anything here... Auto-saved to your browser."
            rows={7}
            className="w-full bg-neutral-950/80 border border-neutral-800/80 rounded-xl p-3 text-xs font-mono text-neutral-200 placeholder-neutral-600 outline-none focus:border-cyan-500/50 resize-none transition-all"
            spellCheck={false}
          />

          <div className="mt-2.5 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
            <span>{linesCount} lines · {charsCount} characters</span>
            <span className="flex items-center gap-1 text-emerald-400/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Auto-saved
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
