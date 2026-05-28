import { CheckCircle, Eye, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useSiteContent } from "../hooks/useSiteContent";

function RichText({ html, className = "" }) {
  if (!html) return null;

  return (
    <div
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const About = () => {
  const { content, loading: contentLoading } = useSiteContent("about");
  const aboutContent = content.about;
  const companyName = aboutContent.heading || "About Us";
  const about = aboutContent.description || "";
  const loading = contentLoading;

  if (loading) {
    return (
      <section className="min-h-screen bg-background px-6 py-16 lg:px-16">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <p className="text-lg font-medium text-gray-500">
            Loading About page...
          </p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="bg-background px-6 py-16 lg:px-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="mx-auto grid max-w-7xl items-stretch gap-12 lg:grid-cols-2">
        <motion.div
          className="flex h-full flex-col"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div>
            <motion.h1
              className="text-4xl font-bold leading-tight text-[#07142f] md:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {companyName}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <RichText
                html={about}
                className="mt-6 text-lg leading-10 text-gray-600 [&_a]:text-[#1d2c57] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#1d2c57] [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
              />
            </motion.div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <motion.div
                className="rounded-2xl border bg-white p-8 text-center shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <div className="flex justify-center">
                  <Eye className="h-14 w-14 text-[#1d2c57]" />
                </div>

                <h3 className="mt-5 text-3xl font-semibold text-[#07142f]">
                  Our Vision
                </h3>

                <RichText
                  html={aboutContent.visionText}
                  className="mt-6 text-lg leading-9 text-gray-500 [&_a]:text-[#1d2c57] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                />
              </motion.div>

              <motion.div
                className="rounded-2xl border bg-white p-8 text-center shadow-sm"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
              >
                <div className="flex justify-center">
                  <Target className="h-14 w-14 text-[#1d2c57]" />
                </div>

                <h3 className="mt-5 text-3xl font-semibold text-[#07142f]">
                  Our Mission
                </h3>

                <RichText
                  html={aboutContent.missionText}
                  className="mt-6 text-lg leading-9 text-gray-500 [&_a]:text-[#1d2c57] [&_a]:underline [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
                />
              </motion.div>
            </div>

            <RichText
              html={aboutContent.closingText}
              className="mt-12 text-xl leading-10 text-gray-600 [&_a]:text-[#1d2c57] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#1d2c57] [&_blockquote]:pl-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6"
            />
          </div>

          <motion.div
            className="mt-10 flex flex-col gap-8 md:flex-row"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          >
            <div className="flex w-full flex-col items-center justify-center rounded-2xl bg-[#1d2c57] px-14 py-10 text-white md:w-[320px]">
              <h2 className="text-6xl font-bold">
                {aboutContent.experienceYears}
              </h2>

              <p className="mt-4 text-center text-2xl font-medium">
                {aboutContent.experienceLabel}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-6">
              {aboutContent.features.map((item, index) => (
                <motion.div
                  key={`${item}-${index}`}
                  className="flex items-center gap-3 text-xl text-gray-600"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: 0.1 + index * 0.05 }}
                >
                  <CheckCircle className="h-6 w-6 text-[#1d2c57]" />
                  <RichText
                    html={item}
                    className="[&_a]:text-[#1d2c57] [&_a]:underline"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex h-full flex-col"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.img
            src={aboutContent.primaryImageUrl}
            alt="cars"
            className="h-[65%] w-full rounded-3xl object-cover shadow-lg"
            initial={{ scale: 0.98, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          <motion.img
            src={aboutContent.secondaryImageUrl}
            alt="travel"
            className="-mt-16 h-[35%] w-[85%] self-end rounded-3xl border-8 border-background object-cover shadow-xl"
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
          />
        </motion.div>
      </div>
      
    </motion.section>
    
  );
};

export default About;
