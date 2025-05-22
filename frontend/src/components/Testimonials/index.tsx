import { Testimonial } from "@/types/testimonial";
import SectionTitle from "../Common/SectionTitle";
import SingleTestimonial from "./SingleTestimonial";

const testimonialData: Testimonial[] = [
  {
    id: 1,
    name: "Sara Mahmoud",
    designation: "Operations Lead @Telecom Egypt",
    content:
      "Our contact center transformation was made possible through this AI solution. Real-time voice transcription, multilingual support, and seamless integration with our backend reduced manual workload by 50%.",
    image: "/images/testimonials/auth-01.png",
    star: 5,
  },
  {
    id: 2,
    name: "Omar Khaled",
    designation: "Customer Experience Director @Fawry",
    content:
      "The platform turned our fragmented support system into a smart, cohesive engine. Auto-routing and intent-based classification have drastically improved first-response time. It's like having an AI co-pilot in every conversation.",
    image: "/images/testimonials/auth-02.png",
    star: 5,
  },
  {
    id: 3,
    name: "Lina Farouk",
    designation: "IT Manager @Vodafone Egypt",
    content:
      "What impressed us most was the flexibility and control — from API access to customizable escalation logic. The AI learns from every interaction, improving continuously. It’s not just automation; it’s intelligent augmentation.",
    image: "/images/testimonials/auth-03.png",
    star: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="dark:bg-bg-color-dark bg-gray-light relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
      <SectionTitle
        title="What Industry Leaders Are Saying"
        paragraph="See how top organizations are transforming customer support operations with our AI-powered call center — enhancing efficiency, reducing costs, and delivering exceptional user experiences around the clock."
        center
      />


        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {testimonialData.map((testimonial) => (
            <SingleTestimonial key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Keep the background SVGs as-is */}
      <div className="absolute right-0 top-5 z-[-1]">
        {/* ...background SVG... */}
      </div>
      <div className="absolute bottom-5 left-0 z-[-1]">
        {/* ...background SVG... */}
      </div>
    </section>
  );
};

export default Testimonials;
