"use client";

import { useEffect, useState } from "react";
import type { EventItem, Priority } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/categories";
import { Trash2 } from "lucide-react";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  initial?: EventItem | null;
  defaultDate?: string;
  onSubmit: (data: Omit<EventItem, "id" | "createdAt">) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
}

function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function EventModal({
  open,
  onClose,
  initial,
  defaultDate,
  onSubmit,
  onDelete,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate ?? todayIso());
  const [time, setTime] = useState("");
  const [category, setCategory] = useState<EventItem["category"]>("work");
  const [priority, setPriority] = useState<Priority>("normal");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setTitle(initial.title);
      setDescription(initial.description ?? "");
      setDate(initial.date);
      setTime(initial.time ?? "");
      setCategory(initial.category);
      setPriority(initial.priority);
      setLocation(initial.location ?? "");
      setNotes(initial.notes ?? "");
    } else {
      setTitle("");
      setDescription("");
      setDate(defaultDate ?? todayIso());
      setTime("");
      setCategory("work");
      setPriority("normal");
      setLocation("");
      setNotes("");
    }
  }, [open, initial, defaultDate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      time: time || undefined,
      category,
      priority,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      done: initial?.done,
    });
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Editar compromisso" : "Novo compromisso"}
      description={
        initial
          ? "Atualize as informações abaixo."
          : "Adicione um item à sua timeline."
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Reunião com fornecedor"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="cat">Categoria</Label>
            <Select
              id="cat"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as EventItem["category"])
              }
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="pri">Prioridade</Label>
            <Select
              id="pri"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="normal">Normal</option>
              <option value="important">Importante</option>
              <option value="urgent">Urgente</option>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="loc">Local</Label>
          <Input
            id="loc"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div>
          <Label htmlFor="desc">Descrição</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalhes do compromisso…"
          />
        </div>

        <div>
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anotações privadas…"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {initial && onDelete ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(initial.id);
                onClose();
              }}
            >
              <Trash2 size={14} /> Excluir
            </Button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">{initial ? "Salvar" : "Criar"}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
