import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { NodeSelection } from "@tiptap/pm/state";

export interface DragHandleOptions {
  dragHandleWidth: number;
}

function absoluteRect(node: Element) {
  const data = node.getBoundingClientRect();
  return {
    top: data.top,
    left: data.left,
    width: data.width,
  };
}

function nodeDOMAtCoords(coords: { x: number; y: number }) {
  return document
    .elementsFromPoint(coords.x, coords.y)
    .find(
      (elem) =>
        elem.parentElement?.matches?.(".ProseMirror") ||
        elem.matches(
          [
            "li",
            "p:not(:first-child)",
            "pre",
            "blockquote",
            "h1, h2, h3, h4, h5, h6",
            "[data-type]",
            ".notion-details",
            ".callout",
          ].join(", ")
        )
    );
}

function nodePosAtDOM(node: Element, view: any) {
  const boundingRect = node.getBoundingClientRect();
  return view.posAtCoords({
    left: boundingRect.left + 1,
    top: boundingRect.top + 1,
  })?.inside;
}

export const DragHandle = Extension.create<DragHandleOptions>({
  name: "dragHandle",

  addOptions() {
    return {
      dragHandleWidth: 24,
    };
  },

  addProseMirrorPlugins() {
    let dragHandleElement: HTMLElement | null = null;
    let currentNode: Element | null = null;

    const createDragHandle = () => {
      const handle = document.createElement("div");
      handle.draggable = true;
      handle.dataset.dragHandle = "";
      handle.classList.add("drag-handle");
      handle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="14" height="14">
          <circle cx="2" cy="2" r="1.5" fill="currentColor"/>
          <circle cx="2" cy="5" r="1.5" fill="currentColor"/>
          <circle cx="2" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="6" cy="2" r="1.5" fill="currentColor"/>
          <circle cx="6" cy="5" r="1.5" fill="currentColor"/>
          <circle cx="6" cy="8" r="1.5" fill="currentColor"/>
        </svg>
      `;
      return handle;
    };

    const showDragHandle = () => {
      if (dragHandleElement) {
        dragHandleElement.classList.add("show");
      }
    };

    const hideDragHandle = () => {
      if (dragHandleElement) {
        dragHandleElement.classList.remove("show");
      }
    };

    return [
      new Plugin({
        key: new PluginKey("dragHandle"),
        view: (view) => {
          dragHandleElement = createDragHandle();
          dragHandleElement.addEventListener("dragstart", (e) => {
            if (currentNode) {
              view.dom.classList.add("dragging");
              const nodePos = nodePosAtDOM(currentNode, view);
              if (nodePos != null && nodePos >= 0) {
                const $pos = view.state.doc.resolve(nodePos);
                const node = view.state.doc.nodeAt(nodePos);
                if (node) {
                  const selection = NodeSelection.create(view.state.doc, nodePos);
                  view.dispatch(view.state.tr.setSelection(selection));
                }
              }
            }
          });

          dragHandleElement.addEventListener("dragend", () => {
            view.dom.classList.remove("dragging");
            hideDragHandle();
          });

          view.dom.parentElement?.appendChild(dragHandleElement);

          return {
            destroy: () => {
              dragHandleElement?.remove();
              dragHandleElement = null;
            },
          };
        },
        props: {
          handleDOMEvents: {
            mousemove: (view, event) => {
              if (!view.editable) return false;

              const node = nodeDOMAtCoords({
                x: event.clientX + 50 + this.options.dragHandleWidth,
                y: event.clientY,
              });

              if (!node || !dragHandleElement) {
                hideDragHandle();
                return false;
              }

              currentNode = node;
              const rect = absoluteRect(node);
              const handleRect = dragHandleElement.getBoundingClientRect();
              const left = rect.left - this.options.dragHandleWidth - 4;
              const top = rect.top + (handleRect.height / 2) - 4;

              dragHandleElement.style.left = `${left}px`;
              dragHandleElement.style.top = `${top}px`;
              showDragHandle();

              return false;
            },
            mouseleave: () => {
              hideDragHandle();
              return false;
            },
            drop: (view, event) => {
              view.dom.classList.remove("dragging");
              hideDragHandle();
              return false;
            },
          },
        },
      }),
    ];
  },
});
