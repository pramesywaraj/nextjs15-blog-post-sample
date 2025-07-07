import {
  Node,
  ReactNodeViewRenderer,
  ReactNodeViewProps,
  NodeViewWrapper
} from "@tiptap/react";
import * as Progress from "@radix-ui/react-progress";

export default function UploadingImageComponent({ node }: ReactNodeViewProps) {
  const progress = node.attrs.progress;
  const fileName = node.attrs.fileName;

  return (
    <NodeViewWrapper
      style={{
        padding: 16,
        background: "#f3f3f3",
        borderRadius: 8,
        minWidth: 200,
      }}
    >
      <div style={{ marginBottom: 8 }}>{fileName || "Uploading image..."}</div>
      <Progress.Root
        value={progress}
        max={100}
        style={{
          width: "100%",
          height: 4,
          background: "#e5e7eb",
          borderRadius: 2,
        }}
      >
        <Progress.Indicator
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#6366f1",
            transition: "width 0.2s",
          }}
        />
      </Progress.Root>
    </NodeViewWrapper>
  );
}

export const UploadingImagePlaceholderNode = Node.create({
  name: "uploadingImage",
  group: "block",
  atom: true, // or content: '' (no children)
  addAttributes() {
    return {
      progress: { default: 0 },
      fileName: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-uploading-image]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["div", { ...HTMLAttributes, "data-uploading-image": "true" }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(UploadingImageComponent);
  },
});
