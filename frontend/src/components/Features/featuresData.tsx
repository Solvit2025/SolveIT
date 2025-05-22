import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      // Multi-panel/workflow icon – suitable for integrations
      <svg width="40" height="41" viewBox="0 0 40 41" className="fill-current">
        <path opacity="0.5" d="M37.7778 40.2223H24C22.8954 40.2223 22 39.3268 22 38.2223V20.0001C22 18.8955 22.8954 18.0001 24 18.0001H37.7778C38.8823 18.0001 39.7778 18.8955 39.7778 20.0001V38.2223C39.7778 39.3268 38.8823 40.2223 37.7778 40.2223Z" />
        <path d="M23.2222 0C22.6699 0 22.2222 0.447715 22.2222 1V12.3333C22.2222 12.8856 22.6699 13.3333 23.2222 13.3333H39C39.5523 13.3333 40 12.8856 40 12.3333V0.999999C40 0.447714 39.5523 0 39 0H23.2222ZM0 39C0 39.5523 0.447715 40 1 40H16.7778C17.3301 40 17.7778 39.5523 17.7778 39V27.6667C17.7778 27.1144 17.3301 26.6667 16.7778 26.6667H1C0.447716 26.6667 0 27.1144 0 27.6667V39ZM0 21.2222C0 21.7745 0.447715 22.2222 1 22.2222H16.7778C17.3301 22.2222 17.7778 21.7745 17.7778 21.2222V0.999999C17.7778 0.447714 17.3301 0 16.7778 0H1C0.447716 0 0 0.447715 0 1V21.2222Z" />
      </svg>
    ),
    title: "Built for Enterprise Workflows",
    paragraph:
      "Seamlessly integrates with CRMs, ticketing systems, and internal tools — ensuring operational continuity across complex support structures.",
  },
  {
    id: 2,
    icon: (
      // Envelope-like structure = messaging
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path opacity="0.5" d="M20.5914 34.2584C20.2394 34.5172 19.7603 34.5175 19.408 34.2593L4.19163 23.1079C3.8395 22.8498 3.36065 22.85 3.00873 23.1084L1.09802 24.5111C0.553731 24.9107 0.553731 25.7237 1.09802 26.1233L19.4082 39.5655C19.7604 39.824 20.2396 39.824 20.5918 39.5655L38.9029 26.1226C39.4469 25.7232 39.4473 24.9107 38.9036 24.5109L36.9701 23.0889C36.6177 22.8298 36.1378 22.8297 35.7854 23.0888L20.5914 34.2584Z" />
        <path d="M19.408 28.931C19.7603 29.1896 20.2396 29.1894 20.5918 28.9306L36.3556 17.3466L38.8979 15.4883C39.4437 15.0894 39.4446 14.275 38.8996 13.8749L20.5918 0.43445C20.2396 0.175911 19.7604 0.175913 19.4082 0.434452L1.09706 13.8774C0.553051 14.2767 0.552712 15.0892 1.09638 15.4891L3.62222 17.3466L19.408 28.931Z" />
      </svg>
    ),
    title: "Intelligent Voice & Chat Automation",
    paragraph:
      "AI agents handle voice and chat queries in real time using speech recognition, intent detection, and multilingual support — reducing queue time and cost.",
  },
  {
    id: 3,
    icon: (
      // Dot matrix = signal points / voice AI
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path opacity="0.5" d="M20 30C22.75 30 25 32.25 25 35C25 37.75 22.75 40 20 40C17.25 40 15 37.75 15 35C15 32.25 17.25 30 20 30Z" />
        <path d="M20 15C22.75 15 25 17.25 25 20C25 22.75 22.75 25 20 25C17.25 25 15 22.75 15 20C15 17.25 17.25 15 20 15Z" />
      </svg>
    ),
    title: "Real-Time Speech-to-Text",
    paragraph:
      "Low-latency, accurate transcription powers every conversation. Supports noisy environments, multiple languages, and domain-specific models.",
  },
  {
    id: 4,
    icon: (
      // Shielded wire globe – privacy + infra
      <svg width="40" height="42" viewBox="0 0 40 42" className="fill-current">
        <path opacity="0.5" d="M31.8943 25.3303C34.1233 25.3303 36.1497 26.1409 37.5682 27.762L39.1464 26.1839C39.4614 25.8689 39.9999 26.092 39.9999 26.5374V32.936C39.9999 33.2121 39.7761 33.436 39.4999 33.436H33.1014C32.6559 33.436 32.4328 32.8974 32.7478 32.5825L35.5418 29.7885C34.5286 28.9779 33.3128 28.37 31.8943 28.37C29.0573 28.37 26.8282 30.599 26.8282 33.436C26.8282 36.273 29.0573 38.5021 31.8943 38.5021C33.3549 38.5021 34.6511 37.844 35.6345 36.8244C35.8406 36.6107 36.1187 36.4756 36.4155 36.4756H38.6535C39.0072 36.4756 39.2477 36.833 39.0881 37.1487C37.7427 39.8107 35.0781 41.5417 31.8943 41.5417C27.4361 41.5417 23.7886 37.8941 23.7886 33.436C23.7886 28.9779 27.4361 25.3303 31.8943 25.3303Z" />
        <path d="..." />
      </svg>
    ),
    title: "Enterprise-Grade Security",
    paragraph:
      "End-to-end encrypted communication, RBAC, and GDPR-ready architecture. Ideal for regulated industries like finance, healthcare, and telecom.",
  },
  {
    id: 5,
    icon: (
      // Grid box = modular system
      <svg width="40" height="40" viewBox="0 0 40 40" className="fill-current">
        <path opacity="0.5" d="M39 12C39.5523 12 40 12.4477 40 13V39C40 39.5523 39.5523 40 39 40H13C12.4477 40 12 39.5523 12 39V33C12 32.4477 12.4477 32 13 32H31C31.5523 32 32 31.5523 32 31V13C32 12.4477 32.4477 12 33 12H39Z" />
        <rect width="28" height="28" rx="1" />
      </svg>
    ),
    title: "Modular & Customizable",
    paragraph:
      "Define routing flows, escalation logic, agent fallback, and AI personas using a plug-and-play service configuration engine.",
  },
  {
    id: 6,
    icon: (
      // Book+chat+gear icon = extensibility
      <svg width="40" height="45" viewBox="0 0 40 45" className="fill-current">
        <path opacity="0.5" d="..." />
        <path d="..." />
      </svg>
    ),
    title: "Open API & Extensible",
    paragraph:
      "Easily connect with external systems, build on our API-first platform, and extend functionality with SDKs and webhook triggers.",
  },
];

export default featuresData;
