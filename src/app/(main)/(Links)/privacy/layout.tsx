import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AuraSpace',
  description: 'Read our privacy policy to understand how we collect, use, and protect your personal information.',
};

const PrivacyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default PrivacyLayout;