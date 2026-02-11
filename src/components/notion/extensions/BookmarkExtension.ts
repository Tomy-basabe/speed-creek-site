/**
 * TipTap Bookmark Extension
 * Creates a bookmark/link preview card similar to Notion's web bookmark block.
 */
import { Node, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        bookmark: {
            setBookmark: (attrs: {
                url: string;
                title?: string;
                description?: string;
                favicon?: string;
            }) => ReturnType;
        };
    }
}

export const Bookmark = Node.create({
    name: "bookmark",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            url: { default: "" },
            title: { default: "" },
            description: { default: "" },
            favicon: { default: "" },
        };
    },

    parseHTML() {
        return [{ tag: 'a[data-type="bookmark"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        const { url, title, description, favicon } = HTMLAttributes;
        let displayUrl = "";
        try {
            displayUrl = url ? new URL(url).hostname : "";
        } catch {
            displayUrl = url || "";
        }

        return [
            "a",
            mergeAttributes(
                {
                    "data-type": "bookmark",
                    class: "notion-bookmark",
                    href: url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    contenteditable: "false",
                    style:
                        "display: flex; text-decoration: none; border: 1px solid hsl(var(--border)); border-radius: 4px; overflow: hidden; margin: 8px 0; cursor: pointer; color: inherit;",
                },
                { "data-url": url }
            ),
            [
                "div",
                {
                    style: "flex: 1; padding: 14px 16px; min-width: 0; display: flex; flex-direction: column; gap: 4px;",
                },
                [
                    "div",
                    {
                        style: "font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;",
                    },
                    title || url,
                ],
                ...(description
                    ? [
                        [
                            "div",
                            {
                                style:
                                    "font-size: 12px; opacity: 0.6; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;",
                            },
                            description,
                        ] as any,
                    ]
                    : []),
                [
                    "div",
                    {
                        style: "display: flex; align-items: center; gap: 6px; font-size: 12px; opacity: 0.5; margin-top: auto;",
                    },
                    ...(favicon
                        ? [
                            [
                                "img",
                                {
                                    src: favicon,
                                    style: "width: 14px; height: 14px; border-radius: 2px;",
                                    loading: "lazy",
                                },
                            ] as any,
                        ]
                        : []),
                    ["span", {}, displayUrl],
                ],
            ],
        ];
    },

    addCommands() {
        return {
            setBookmark:
                (attrs) =>
                    ({ commands }) => {
                        let favicon = attrs.favicon || "";
                        if (!favicon && attrs.url) {
                            try {
                                favicon = `https://www.google.com/s2/favicons?domain=${new URL(attrs.url).hostname}&sz=32`;
                            } catch {
                                // ignore
                            }
                        }
                        return commands.insertContent({
                            type: this.name,
                            attrs: {
                                url: attrs.url,
                                title: attrs.title || attrs.url,
                                description: attrs.description || "",
                                favicon,
                            },
                        });
                    },
        };
    },
});
