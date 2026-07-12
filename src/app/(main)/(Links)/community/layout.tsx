import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Community | Join Our Discussion',
  description: 'Connect with our community, share ideas, and grow together. Join the conversation today.',
};

const CommunityLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        {children}
    </div>
  );
};

export default CommunityLayout;