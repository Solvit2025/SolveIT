import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    slug: "ai-features-call-centers-2025",
    title: "How AI-Powered Call Centers Are Redefining Customer Experience in 2025",
    paragraph:
      "AI-driven call centers are now strategic pillars for enterprise support. Leveraging advanced real-time transcription models like FasterWhisper and WhisperX, combined with Retrieval-Augmented Generation (RAG) architectures powered by vector databases such as Pinecone, systems can interpret user intent and fetch relevant knowledge in seconds. LLMs like GPT-4 and Claude ensure responses are fluid and contextually rich. This end-to-end pipeline reduces handling time, boosts CSAT, and provides 24/7 multilingual support—transforming traditional telecom and finance service workflows.",
    image: "/images/blog/blog-01.jpg",
    author: {
      name: "Nour Hassan",
      image: "/images/blog/author-01.png",
      designation: "AI Solutions Architect",
    },
    tags: ["AI", "automation", "customer-support"],
    publishDate: "2025",
  },
  {
    id: 2,
    slug: "real-time-ai-call-routing",
    title: "The Tech Stack Behind a Real-Time AI Call Center: From Voice to Resolution",
    paragraph:
      "Building a real-time AI call center involves a seamless orchestration of speech recognition, NLP, and knowledge retrieval. Audio is transcribed live with Whisper/FasterWhisper, classified using transformers like BERT or Cohere, and routed smartly with decision trees or reinforcement agents. LLMs such as Claude or GPT-4 process context-aware prompts, pulling from enterprise knowledge bases indexed in Pinecone. Combined with streaming architectures and WebSockets, this enables low-latency, high-accuracy resolution across industries like telecom, insurance, and banking.",
    image: "/images/blog/blog-02.jpg",
    author: {
      name: "Omar El Saeed",
      image: "/images/blog/author-02.png",
      designation: "Backend Engineer",
    },
    tags: ["real-time", "voice", "LLM"],
    publishDate: "2025",
  },
  {
    id: 3,
    slug: "agent-productivity-ai-copilots",
    title: "Boosting Agent Productivity with AI Co-Pilots and Automation Layers",
    paragraph:
      "AI co-pilots are transforming how human agents operate by offering contextual suggestions, automated summaries, and emotion-aware escalation. Systems use whisper-based transcription and RAG workflows to deliver instant support suggestions. With agent-side tools built on LangChain, OpenAI Assistants API, and vector search, call summaries and resolutions are pre-filled, slashing resolution time. Real-time analytics and behavioral insights help managers optimize team performance while maintaining human empathy at scale.",
    image: "/images/blog/blog-03.jpg",
    author: {
      name: "Salma Adel",
      image: "/images/blog/author-03.png",
      designation: "Product Manager",
    },
    tags: ["agent-assist", "productivity", "AI"],
    publishDate: "2025",
  },
];

export default blogData;
