import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import ImageUploadGallery from "../../../components/image-upload-gallery";

const ruledLineStyle: React.CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 31px,
      rgba(160, 130, 80, 0.18) 31px,
      rgba(160, 130, 80, 0.18) 32px
    )
  `,
  lineHeight: "32px",
};

export default function PlantBoxImages({
  plantBoxId,
}: {
  plantBoxId: Id<"plantBoxes">;
}) {
  const images = useQuery(api.plantBoxImages.list, { plantBoxId }) ?? [];
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addImage = useMutation(api.plantBoxImages.add);
  const removeImage = useMutation(api.plantBoxImages.remove);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileSelected(file: File) {
    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = (await result.json()) as {
        storageId: Id<"_storage">;
      };
      await addImage({ plantBoxId, storageId });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="panel-ornate">
      <h2 className="text-sm uppercase tracking-widest text-botanical mb-6 text-center">
        Photographic Record
      </h2>

      <div style={{ ...ruledLineStyle, padding: "8px 0" }}>
        {images.length === 0 && !isUploading && (
          <p
            className="italic mb-4"
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "12px",
              color: "#8B6340",
              opacity: 0.7,
            }}
          >
            No plates recorded for this station.
          </p>
        )}
        <ImageUploadGallery
          images={images.map((img) => ({ _id: img._id, url: img.url }))}
          onFileSelected={handleFileSelected}
          onRemove={(id) =>
            void removeImage({ imageId: id as Id<"plantBoxImages"> })
          }
          isUploading={isUploading}
        />
      </div>
    </section>
  );
}
