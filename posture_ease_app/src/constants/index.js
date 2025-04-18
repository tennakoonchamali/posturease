import { people01, people02, people03, facebook, instagram, linkedin, twitter, send, shield, star } from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
    isSection: true,
    link: "/",
  },
  {
    id: "startdetection",
    title: "Start Detection",
    link: "/startdetection",
    isSection: false,
  },
  {
    id: "login",
    title: "Login",
    link: "/login",
    isSection: false,
  },
];

export const startDetectionNavLinks = [
  {
    id: "home",
    title: "Home",
    link: "/",
  },
  {
    id: "startdetection",
    title: "Start Detection",
    link: "/startdetection",
  },
  {
    id: "reports",
    title: "Reports",
    link: "/reports",
  },
];

export const loginNavLinks = [
  {
    id: "home",
    title: "Home",
    link: "/",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: star,
    title: "AI-Powered Accuracy",
    content:
      "Advanced AI ensures real-time posture detection with high accuracy to keep you aligned.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Health & Comfort",
    content:
      "Reduce back pain and improve spinal health with continuous posture monitoring.",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Real-Time Alerts",
    content:
      "Receive instant feedback with visual cues and sound alerts whenever your posture needs correction.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "This app has completely transformed my posture! I no longer suffer from back pain, and I feel more confident every day.",
    name: "Emily Johnson",
    title: "Wellness Coach",
    img: people01,
  },
  {
    id: "feedback-2",
    content:
      "A game-changer! The real-time alerts keep me aware of my posture, and I've noticed a huge improvement in just a few weeks.",
    name: "Michael Smith",
    title: "Software Engineer",
    img: people02,
  },
  {
    id: "feedback-3",
    content:
      "I never realized how poor my posture was until I started using this app. The insights and alerts have made a big difference!",
    name: "Sophia Lee",
    title: "Yoga Instructor",
    img: people03,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "Happy Users",
    value: "10K+",
  },
  {
    id: "stats-2",
    title: "Postures Analyzed",
    value: "50K+",
  },
  {
    id: "stats-3",
    title: "Detection Accuracy",
    value: "95%",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "How It Works",
        link: "/how-it-works",
      },
      {
        name: "Features",
        link: "/features",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "/help-center",
      },
      {
        name: "Feedback",
        link: "/feedback",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        name: "Contact Us",
        link: "/contact",
      },
      {
        name: "FAQ",
        link: "/faq",
      },
      {
        name: "Privacy Policy",
        link: "/privacy-policy",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];