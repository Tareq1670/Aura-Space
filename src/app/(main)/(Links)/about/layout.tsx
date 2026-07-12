import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | AuraSpace',
  description: 'Learn more about our mission, vision, and the team behind YourAppName. We are dedicated to providing the best service.',
  openGraph: {
    title: 'About Us | YourAppName',
    description: 'Discover our story and what makes us unique.',
  },
};

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
        {children}
    </section>
  );
};

export default AboutLayout;