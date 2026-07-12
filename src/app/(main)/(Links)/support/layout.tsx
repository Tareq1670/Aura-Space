import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | How Can We Help You?',
  description: 'Get the technical support and assistance you need. Our team is available to help you resolve any issues.',
};

const SupportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

export default SupportLayout;