import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4],
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-emerald-600 hover:text-emerald-700 underline cursor-pointer",
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: "max-w-full h-auto rounded-lg my-4",
    },
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "border-collapse border-2 border-gray-300 my-4",
    },
  }),
  TableRow,
  TableCell.configure({
    HTMLAttributes: {
      class: "border border-gray-300 px-4 py-2",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: "border border-gray-300 px-4 py-2 bg-emerald-50 font-bold",
    },
  }),
  Youtube.configure({
    width: 640,
    height: 360,
    HTMLAttributes: {
      class: "aspect-video w-full max-w-2xl mx-auto my-4",
    },
  }),
  Placeholder.configure({
    placeholder: "Start writing your blog post...",
  }),
];
