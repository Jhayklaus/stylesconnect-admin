"use client";

import { useState } from "react";
import { Button, Field, FilterDropdown, Modal, TextField } from "@/components/ui";
import {
  useAttributes,
  useCreateAttribute,
  useUpdateAttribute,
} from "@/hooks/attributes/useAttributes";
import type { AttributeBody, AttributeResource } from "@/services/attributes";
import type { AnyAttribute, AttributeTab } from "./attributeConfig";

const HEX = /^#[0-9A-Fa-f]{6}$/;

type FieldErrors = Partial<Record<"name" | "category_id" | "hex_code", string>>;

export interface AttributeFormModalProps {
  tab: AttributeTab;
  open: boolean;
  /** The row being edited; null when adding. */
  editing: AnyAttribute | null;
  onClose: () => void;
}

/** Add and edit share one dialog; types also pick a category, colors a hex. */
export function AttributeFormModal({ tab, open, editing, onClose }: AttributeFormModalProps) {
  const { resource, singular } = tab;
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [hex, setHex] = useState("#000000");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [openedFor, setOpenedFor] = useState<string | null>(null);

  const { data: categories } = useAttributes("categories");
  const create = useCreateAttribute(resource);
  const update = useUpdateAttribute(resource);
  const pending = create.isPending || update.isPending;

  // Reset the form whenever the dialog opens for a different row (or for "add").
  const openKey = open ? `${resource}:${editing?.id ?? "new"}` : null;
  if (openKey !== openedFor) {
    setOpenedFor(openKey);
    setName(editing?.name ?? "");
    setCategoryId(editing?.category_id ? String(editing.category_id) : "");
    setHex(editing?.hex_code ?? "#000000");
    setErrors({});
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Enter a name.";
    if (resource === "types" && !categoryId) next.category_id = "Pick a category.";
    if (resource === "colors" && !HEX.test(hex)) next.hex_code = "Use a 6-digit hex, e.g. #B7410E.";
    return next;
  }

  function submit() {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length) return;

    const body = {
      name: name.trim(),
      ...(resource === "types" && { category_id: Number(categoryId) }),
      ...(resource === "colors" && { hex_code: hex.toUpperCase() }),
    } as AttributeBody[AttributeResource];

    const options = {
      onSuccess: onClose,
      // Surface the backend's field errors (e.g. a duplicate name) inline.
      onError: (error: { errors?: Record<string, string[]> }) =>
        setErrors({
          name: error.errors?.name?.[0],
          category_id: error.errors?.category_id?.[0],
          hex_code: error.errors?.hex_code?.[0],
        }),
    };

    if (editing) update.mutate({ id: editing.id, body }, options);
    else create.mutate(body, options);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `Edit ${singular}` : `Add ${singular}`}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : editing ? "Save changes" : `Add ${singular}`}
          </Button>
        </>
      }
    >
      <form
        className="flex flex-col gap-5 px-6 py-6"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          error={errors.name}
          placeholder={`New ${singular}…`}
          autoFocus
        />

        {resource === "types" && (
          <Field label="Category" error={errors.category_id}>
            <FilterDropdown
              label="Select a category"
              align="start"
              options={(categories ?? []).map((c) => ({ value: String(c.id), label: c.name }))}
              value={categoryId}
              onChange={setCategoryId}
              className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:justify-between"
            />
          </Field>
        )}

        {resource === "colors" && (
          <TextField
            label="Hex code"
            value={hex}
            onChange={setHex}
            error={errors.hex_code}
            placeholder="#B7410E"
            maxLength={7}
            trailing={
              <input
                type="color"
                aria-label="Pick a colour"
                value={HEX.test(hex) ? hex : "#000000"}
                onChange={(e) => setHex(e.target.value.toUpperCase())}
                className="h-7 w-7 shrink-0 cursor-pointer rounded border border-stroke-soft bg-transparent p-0"
              />
            }
          />
        )}

        {/* Lets Enter submit from the text fields. */}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
