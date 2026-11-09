import Image from "next/image";
import { closing } from "@/data/closing";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function ClosingSection() {
  return (
    <section className="closing-cta" id="cta">
      <div className="closing-collage" aria-label="Momen majlis dan pasangan">
        {closing.photos.map((photo, index) => (
          <div
            className={`closing-collage__photo closing-collage__photo--${index + 1}`}
            key={photo.image}
          >
            <Image
              src={`https://images.unsplash.com/${photo.image}?fm=jpg&q=70&w=900&auto=format&fit=crop`}
              alt={photo.label.replace("PHOTO: ", "")}
              fill
              sizes="(max-width: 860px) 50vw, 36vw"
            />
          </div>
        ))}
      </div>
      <div className="closing-cta__copy">
        <p className="eyebrow">{closing.label}</p>
        <h2>{closing.title}</h2>
        <p className="closing-cta__description">{closing.description}</p>
        <WhatsAppButton variant="gold" message={closing.message}>
          Start Planning
        </WhatsAppButton>
      </div>
    </section>
  );
}
