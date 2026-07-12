import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'How It Works | AuraSpace',
  description: 'Learn how our system works step by step.',
};

const HowToWork = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

export default HowToWork;