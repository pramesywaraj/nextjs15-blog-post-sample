import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import React, { useRef, useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

const ALIGN_OPTIONS = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

// Custom React node view for the image
const ResizableImageComponent = (props: any) => {
  const { node, updateAttributes, selected } = props;
  const imgRef = useRef<HTMLImageElement>(null);
  const [isEnableAlign, setIsEnableAlign] = useState(false);
  const [alignPopoverStyle, setAlignPopoverStyle] = useState({});

  useEffect(() => {
    setIsEnableAlign(selected);
  }, [selected]);

  useEffect(() => {
    if (selected && imgRef.current) {
      // Small delay to ensure DOM has updated after alignment change
      const updatePosition = () => {
        const rect = imgRef.current!.getBoundingClientRect();
        setAlignPopoverStyle({
          position: "fixed",
          left: rect.left + rect.width / 2,
          top: rect.top - 8,
          transform: "translate(-50%, -100%)",
          zIndex: 1000,
        });
      };

      setTimeout(updatePosition, 0); // Next tick
    }
  }, [selected, node.attrs.align]);

  // Handle drag to resize
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = imgRef.current?.getBoundingClientRect().width || 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
      updateAttributes({ width: newWidth });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  let wrapperStyle: React.CSSProperties = {
    whiteSpace: "normal",
    display: "block",
    width: "100%",
    textAlign: node.attrs.align as "left" | "center" | "right",
  };

  return (
    <NodeViewWrapper className="group" style={wrapperStyle}>
      <div className="relative inline-block">
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt}
          draggable={false}
          loading={node.attrs.loading || "lazy"}
          style={{
            width: node.attrs.width ? `${node.attrs.width}px` : "auto",
            display: "block",
            maxWidth: "100%",
            border: selected ? "2px solid #2563eb" : "2px solid transparent",
            borderRadius: 6,
            boxShadow: selected ? "0 0 0 2px #2563eb33" : undefined,
            transition: "border 0.2s, box-shadow 0.2s",
          }}
        />
        {/* Resize handle: only show when selected */}
        {node.attrs.description && (
          <figcaption
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: 14,
              marginTop: 8,
              fontStyle: "italic",
            }}
          >
            {node.attrs.description}
          </figcaption>
        )}
        {selected && (
          <>
            <span
              onMouseDown={startResize}
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 16,
                height: 16,
                background: "#fff",
                border: "1px solid #888",
                cursor: "ew-resize",
                zIndex: 10,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}
            >
              ↔️
            </span>

            <button
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 20,
                background: "#fff",
                border: "1px solid #888",
                borderRadius: 4,
                padding: "2px 6px",
                fontSize: 12,
                cursor: "pointer",
              }}
              onClick={() => {
                const alt = window.prompt("Alt text", node.attrs.alt || "");
                const description = window.prompt(
                  "Description",
                  node.attrs.description || ""
                );
                updateAttributes({ alt, description });
              }}
              type="button"
            >
              📝
            </button>

            <div style={alignPopoverStyle}>
              <Popover open={isEnableAlign} onOpenChange={setIsEnableAlign}>
                <PopoverTrigger asChild>
                  <button
                    style={{
                      width: 1,
                      height: 1,
                      opacity: 0,
                      pointerEvents: "none",
                      position: "absolute",
                    }}
                    tabIndex={-1}
                    aria-hidden
                  />
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="center"
                  style={{
                    display: "flex",
                    gap: 8,
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: 6,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    padding: 8,
                  }}
                >
                  {ALIGN_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`px-2 py-1 rounded ${
                        node.attrs.align === opt.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                      onClick={() => updateAttributes({ align: opt.value })}
                      type="button"
                    >
                      {opt.label}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

// Custom extension
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      align: {
        default: "left",
        parseHTML: (element) => element.getAttribute("data-align") || "left",
        renderHTML: (attributes) => {
          return {
            "data-align": attributes.align,
            style: `text-align: ${attributes.align}; display: block;`,
          };
        },
      },
      alt: {
        default: "",
        parseHTML: (element) => element.getAttribute("alt") || "",
        renderHTML: (attributes) => {
          if (!attributes.alt) return {};
          return { alt: attributes.alt };
        },
      },
      description: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-description") || "",
        renderHTML: (attributes) => {
          if (!attributes.description) return {};

          return { "data-description": attributes.description };
        },
      },
      loading: {
        default: "lazy",
        parseHTML: (element) => element.getAttribute("loading") || "lazy",
        renderHTML: () => ({
          loading: "lazy",
        }),
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const renderedAttributes = {
        src: HTMLAttributes.src,
        alt: HTMLAttributes.alt || "",
        loading: HTMLAttributes.loading || "lazy",
        width: HTMLAttributes.width,
        "data-align": HTMLAttributes?.['data-align'] || 'left',
        style: `text-align: ${HTMLAttributes?.['data-align'] || 'left'}; display: block;`
    };
    if (HTMLAttributes?.['data-description']) {
      return [
        "figure",
        {},
        [
          "img",
          {
            ...renderedAttributes,
            "data-description": HTMLAttributes['data-description'],
          },
        ],
        [
          "figcaption",
          {},
          HTMLAttributes['data-description'],
        ],
      ];
    }
    return [
      "img",
      renderedAttributes,
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

export default ResizableImage;
