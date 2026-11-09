import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

export function ReviewsSection() {
  return (
    <section className="reviews section-shell" id="reviews">
      <div className="section-heading section-heading--row">
        <div>
          <p className="eyebrow">Kata mereka</p>
          <h2>Majlis yang<br /><em>penuh makna.</em></h2>
        </div>
        {site.googleReviewsUrl ? (
          <a className="text-link" href={site.googleReviewsUrl} target="_blank" rel="noreferrer">
            Read more reviews on Google <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <p className="content-note">Pautan Google Reviews akan ditambah selepas disahkan.</p>
        )}
      </div>
      <div className="review-list">
        {reviews.map((review, index) => (
          <figure className="review" key={`${review.name}-${index}`}>
            <blockquote>“{review.quote}”</blockquote>
            <figcaption>{review.name}<span>{review.place}</span></figcaption>
          </figure>
        ))}
      </div>
      <p className="content-note">Teks ini ialah placeholder. Terbitkan hanya testimoni sebenar yang mendapat kebenaran.</p>
    </section>
  );
}
