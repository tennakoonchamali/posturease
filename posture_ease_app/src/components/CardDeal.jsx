import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

// CardDeal component to present a section with a heading, description, and a button to get started
const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Improve Your Posture <br className="sm:block hidden" /> in Just a Few Steps.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Sit, stand, and move better with real-time AI posture tracking. Get instant feedback, make corrections, and build healthier habits effortlessly.
      </p>

      <Button styles="mt-10">
        Get Started
      </Button>
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="billing" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
