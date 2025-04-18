import styles from "../style";
import Button from "./Button";

// CTA (Call to Action) component for encouraging users to take action on improving their posture
const CTA = () => (
  <section className={`${styles.flexCenter} ${styles.marginY} ${styles.padding} sm:flex-row flex-col bg-black-gradient-2 rounded-[20px] box-shadow`}>
    <div className="flex-1 flex flex-col">
      <h2 className={styles.heading2}>Improve Your Posture Today!</h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Get real-time posture analysis, instant feedback, and personalized insights to maintain a healthy stance. Start now for a pain-free, confident posture!
      </p>
    </div>

    <div className={`${styles.flexCenter} sm:ml-10 ml-0 sm:mt-0 mt-10`}>
      <Button>
        Get Started
      </Button>
    </div>
  </section>
);

export default CTA;
