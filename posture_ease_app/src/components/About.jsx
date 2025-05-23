import { features } from "../constants";
import styles, { layout } from "../style";

// Component to render individual feature cards
const FeatureCard = ({ icon, title, content, index }) => (
  <div className={`flex flex-row p-6 rounded-[20px] ${index !== features.length - 1 ? "mb-6" : "mb-0"} feature-card`}>
    <div className={`w-[64px] h-[64px] rounded-full ${styles.flexCenter} bg-dimBlue`}>
      <img src={icon} alt="star" className="w-[50%] h-[50%] object-contain" />
    </div>
    <div className="flex-1 flex flex-col ml-3">
      <h4 className="font-poppins font-semibold text-white text-[18px] leading-[23.4px] mb-1">
        {title}
      </h4>
      <p className="font-poppins font-normal text-dimWhite text-[16px] leading-[24px]">
        {content}
      </p>
    </div>
  </div>
);

// Main About component to describe the purpose of the application
const About = () => (
  <section id="about" className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Focus on Your Work, <br className="sm:block hidden" /> We’ll Take Care of Your Posture.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Maintain a healthy posture effortlessly with real-time AI detection. Stay aligned, reduce discomfort, and build better habits—all while working or studying.
      </p>
    </div>

    {/* Section to render feature cards dynamically */}
    <div className={`${layout.sectionImg} flex-col`}>
      {features.map((feature, index) => (
        <FeatureCard key={feature.id} {...feature} index={index} />
      ))}
    </div>
  </section>
);

export default About;
