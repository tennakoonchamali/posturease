import { homeimage } from "../assets";
import styles, { layout } from "../style";

// AboutSectionTwo component to provide additional information about the app
const AboutSectionTwo = () => (
  <section className={layout.sectionReverse}>
    <div className={layout.sectionImgReverse}>
      <img src={homeimage} alt="billing" className="w-[100%] h-[100%] relative z-[5]" />

      {/* Gradient overlays for visual effect */}
      {/* gradient start */}
      <div className="absolute z-[3] -left-1/2 top-0 w-[50%] h-[50%] rounded-full white__gradient" />
      <div className="absolute z-[0] w-[50%] h-[50%] -left-1/2 bottom-0 rounded-full pink__gradient" />
      {/* gradient end */}
    </div>

    {/* Text Section */}
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Effortlessly Monitor Your <br className="sm:block hidden" /> Posture & Well-Being
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Stay aligned and pain free with real time posture tracking. Our AI driven system analyzes your stance, provides instant feedback, and helps you build healthier habits effortlessly.
      </p>
    </div>
  </section>
);

export default AboutSectionTwo;
