import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | AuraSpace',
  description: 'Find answers to common questions about our services, pricing, and policies on our FAQ page.',
  keywords: ['FAQ', 'Questions', 'Support', 'Help'],
};

const FaqLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      {children}
    </section>
  );
};

export default FaqLayout;