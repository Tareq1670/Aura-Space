import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Get in Touch',
  description: 'Have questions? Contact our team today for support, inquiries, or feedback. We are here to help you.',
};


const ContactLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
        {children}
    </section>
  );
};

export default ContactLayout;