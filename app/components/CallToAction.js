import CTAGooBG from "../../public/cta-goo-bg.webp";

export default function CallToAction() {
  return (
    <div
      className="guide-footer-cta flex items-center justify-center p-4"
      style={{
        background: `url(${CTAGooBG.src}) no-repeat center center`,
        backgroundSize: "cover",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div className="text-center">
        <h1 className="text-xl text-white font-bold">
          Chat with Claude 4 Sonnet for FREE
        </h1>
      </div>
    </div>
  );
}
