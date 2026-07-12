import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AuraSpace',
  description: 'Read our terms and conditions carefully to understand the rules and guidelines for using our services.',
};

const TermsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default TermsLayout;