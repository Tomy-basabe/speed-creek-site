/**
 * TipTap Columns Extension
 * Allows creating multi-column layouts (2, 3, or 4 columns) like Notion's column blocks.
 */
import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        columnBlock: {
            setColumns: (columns?: number) => ReturnType;
        };
    }
}

// ColumnBlock: a wrapper for multiple columns
export const ColumnBlock = Node.create({
    name: "columnBlock",
    group: "block",
    content: "column+",
    defining: true,
    isolating: true,

    addAttributes() {
        return {
            columns: {
                default: 2,
                parseHTML: (el) => parseInt(el.getAttribute("data-columns") || "2"),
                renderHTML: (attrs) => ({ "data-columns": attrs.columns }),
            },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="column-block"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        const cols = HTMLAttributes["data-columns"] || 2;
        return [
            "div",
            mergeAttributes(HTMLAttributes, {
                "data-type": "column-block",
                class: "notion-column-block",
                style: `display: grid; grid-template-columns: repeat(${cols}, 1fr); gap: 16px; margin: 8px 0;`,
            }),
            0,
        ];
    },

    addCommands() {
        return {
            setColumns:
                (columns: number = 2) =>
                    ({ commands }) => {
                        const content: any[] = [];
                        for (let i = 0; i < columns; i++) {
                            content.push({
                                type: "column",
                                content: [{ type: "paragraph" }],
                            });
                        }
                        return commands.insertContent({
                            type: this.name,
                            attrs: { columns },
                            content,
                        });
                    },
        };
    },
});

// Column: a single column inside a ColumnBlock
export const Column = Node.create({
    name: "column",
    group: "",
    content: "block+",
    defining: true,
    isolating: true,

    parseHTML() {
        return [{ tag: 'div[data-type="column"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, {
                "data-type": "column",
                class: "notion-column",
                style:
                    "min-width: 0; padding: 4px 8px; border-radius: 4px; border: 1px dashed transparent;",
            }),
            0,
        ];
    },
});
