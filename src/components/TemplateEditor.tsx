import { Copy, Eraser, Play, Save, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';
import { ALL_PIECES, PIECE_COLORS } from '../engine/srs.ts';
import type { CellColor, PieceType } from '../engine/types.ts';
import type { CustomTemplateItem } from '../lessons/customTemplates.ts';

interface TemplateEditorProps {
  activeBrush: Exclude<CellColor, null>;
  onSelectBrush: (brush: Exclude<CellColor, null>) => void;
  eraseMode: boolean;
  onToggleEraseMode: (erase: boolean) => void;
  queueInput: string;
  onChangeQueueInput: (val: string) => void;
  holdInput: PieceType | '';
  onChangeHoldInput: (val: PieceType | '') => void;
  onClearBoard: () => void;
  onLoadCurrentLessonToEditor: () => void;
  onTestTemplate: () => void;
  onSaveTemplate: (name: string, description: string) => void;
  onExportJson: () => string;
  onImportJson: (raw: string) => boolean;
  customTemplates: CustomTemplateItem[];
  onDeleteCustomTemplate: (id: string) => void;
  onLoadCustomIntoEditor: (tpl: CustomTemplateItem) => void;
}

const BRUSHES: Array<Exclude<CellColor, null>> = ['G', 'T', 'I', 'O', 'S', 'Z', 'J', 'L'];

export function TemplateEditor({
  activeBrush,
  onSelectBrush,
  eraseMode,
  onToggleEraseMode,
  queueInput,
  onChangeQueueInput,
  holdInput,
  onChangeHoldInput,
  onClearBoard,
  onLoadCurrentLessonToEditor,
  onTestTemplate,
  onSaveTemplate,
  onExportJson,
  onImportJson,
  customTemplates,
  onDeleteCustomTemplate,
  onLoadCustomIntoEditor,
}: TemplateEditorProps) {
  const [name, setName] = useState('Mi Plantilla T-Spin');
  const [desc, setDesc] = useState('Práctica personalizada de giros SRS.');
  const [jsonBox, setJsonBox] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  return (
    <section className="flex flex-col h-full bg-slate-900/75 border border-slate-800/90 rounded-2xl overflow-hidden backdrop-blur-md">
      <div className="p-4 border-b border-slate-800/80 space-y-2">
        <h2 className="text-base font-extrabold text-slate-100">
          🎨 Editor de Plantillas
        </h2>
        <p className="text-xs text-slate-400">
          Haz clic y arrastra sobre el tablero para pintar bloques (clic derecho para borrar) y diseña tus propios setups de C-Spin o PC.
        </p>
        <button
          onClick={onTestTemplate}
          className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-lg"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          ¡Jugar / Probar Esta Plantilla Ahora!
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Brush Palette */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Pincel de Bloques
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {BRUSHES.map((b) => {
              const selected = !eraseMode && activeBrush === b;
              return (
                <button
                  key={b}
                  onClick={() => {
                    onToggleEraseMode(false);
                    onSelectBrush(b);
                  }}
                  className={`py-2 rounded-lg font-black text-xs border transition cursor-pointer ${
                    selected
                      ? 'ring-2 ring-white border-white scale-105'
                      : 'border-slate-700 opacity-85 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: PIECE_COLORS[b].fill,
                    color: '#090d16',
                  }}
                >
                  {b === 'G' ? 'Gris' : b}
                </button>
              );
            })}
            <button
              onClick={() => onToggleEraseMode(true)}
              className={`col-span-2 py-2 rounded-lg font-bold text-xs border flex items-center justify-center gap-1 transition cursor-pointer ${
                eraseMode
                  ? 'bg-rose-500 text-slate-950 border-rose-300'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              Borrar
            </button>
          </div>

          <div className="flex gap-1.5 pt-1">
            <button
              onClick={onLoadCurrentLessonToEditor}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-sky-300 cursor-pointer transition"
            >
              Clonar Lección Actual
            </button>
            <button
              onClick={onClearBoard}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-rose-950 border border-slate-700 text-[11px] font-semibold text-rose-300 cursor-pointer transition"
            >
              Vaciar Tablero
            </button>
          </div>
        </div>

        {/* Queue & Hold Config */}
        <div className="space-y-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Cola Inicial de Piezas (ej: T, T, I, J, L, S, Z)
            </label>
            <input
              type="text"
              value={queueInput}
              onChange={(e) => onChangeQueueInput(e.target.value.toUpperCase())}
              placeholder="T, T, I, O, S, Z, J, L"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-100 focus:outline-none focus:border-fuchsia-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1">
              Pieza en Hold Inicial
            </label>
            <div className="flex gap-1">
              <button
                onClick={() => onChangeHoldInput('')}
                className={`px-2 py-1 rounded text-[11px] font-bold border cursor-pointer ${
                  holdInput === ''
                    ? 'bg-slate-200 text-slate-950 border-white'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                Vacío
              </button>
              {ALL_PIECES.map((p) => (
                <button
                  key={p}
                  onClick={() => onChangeHoldInput(p)}
                  className={`flex-1 py-1 rounded text-[11px] font-black border cursor-pointer ${
                    holdInput === p
                      ? 'ring-2 ring-white border-white text-slate-950'
                      : 'border-slate-700 text-slate-950 opacity-75 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: PIECE_COLORS[p].fill }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Custom Template */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="text-xs font-bold text-slate-200">Guardar en «Mis Plantillas»</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la plantilla"
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
          />
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Descripción corta"
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100"
          />
          <button
            onClick={() => {
              onSaveTemplate(name.trim() || 'Plantilla sin título', desc.trim());
              setStatusMsg('✓ Plantilla guardada en tu navegador.');
            }}
            className="w-full py-1.5 px-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar Plantilla
          </button>
        </div>

        {/* Export / Import JSON */}
        <div className="space-y-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200">Importar / Exportar JSON</span>
            <button
              onClick={() => {
                const exported = onExportJson();
                setJsonBox(exported);
                navigator.clipboard?.writeText(exported);
                setStatusMsg('✓ JSON copiado al portapapeles.');
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-sky-300 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              Exportar
            </button>
          </div>
          <textarea
            rows={2}
            value={jsonBox}
            onChange={(e) => setJsonBox(e.target.value)}
            placeholder='Pega aquí el JSON exportado para cargarlo...'
            className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-mono text-slate-200"
          />
          <button
            onClick={() => {
              const ok = onImportJson(jsonBox);
              setStatusMsg(ok ? '✓ Plantilla importada al tablero.' : '✗ JSON no válido.');
            }}
            className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            Cargar JSON en el Editor
          </button>
          {statusMsg && <div className="text-[11px] text-emerald-400">{statusMsg}</div>}
        </div>

        {/* Saved Templates List */}
        {customTemplates.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Plantillas Guardadas ({customTemplates.length})
            </div>
            {customTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800"
              >
                <button
                  onClick={() => onLoadCustomIntoEditor(tpl)}
                  className="text-left min-w-0 flex-1 cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-200 truncate">{tpl.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    Cola: {tpl.queue.join(',')}
                  </div>
                </button>
                <button
                  onClick={() => onDeleteCustomTemplate(tpl.id)}
                  className="p-1.5 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                  title="Eliminar plantilla"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
