"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { reviews } from "@/data/reviews";

export function ReviewsSection() {
  const [activeReview, setActiveReview] = useState(0);

  function changeReview(delta: number) {
    setActiveReview((index) => (index + delta + reviews.length) % reviews.length);
  }

  return (
    <section id="kata" style={{ paddingTop: 0 }}>
      <div className="w">
        <h2 className="rv">Apa kata <span className="ser mk">pasangan kami.</span></h2>
        <div className="cr">
          <div className="pt" aria-hidden="true">
            <div className="im p-bw" />
            <div className="im p-warm" />
          </div>
          <div>
            <div aria-live="polite">
              {reviews.map((review, index) => (
                <article className={`sd${activeReview === index ? " on" : ""}`} key={review.name}>
                  <div className="dm-head">
                    <span>{review.source}</span>
                    <span className="dm-badge">{review.package}</span>
                  </div>
                  <blockquote>“{review.quote}”</blockquote>
                  <div className="who">{review.name}<small>{review.place}</small></div>
                </article>
              ))}
            </div>
            <div className="ctl">
              <button className="ar" type="button" onClick={() => changeReview(-1)} aria-label="Testimoni sebelum">
                <ArrowLeft className="i" />
              </button>
              <button className="ar" type="button" onClick={() => changeReview(1)} aria-label="Testimoni seterusnya">
                <ArrowRight className="i" />
              </button>
              <div className="dts" aria-label="Pilih testimoni">
                {reviews.map((review, index) => (
                  <button
                    className={activeReview === index ? "on" : ""}
                    type="button"
                    key={review.name}
                    onClick={() => setActiveReview(index)}
                    aria-label={`Testimoni ${index + 1}`}
                    aria-current={activeReview === index ? "true" : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
