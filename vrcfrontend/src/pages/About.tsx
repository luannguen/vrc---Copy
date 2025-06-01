import { useState } from 'react';
import useAboutPage from '../hooks/useAboutPage';
import LeadershipProfileModal from '../components/LeadershipProfileModal';
import { Eye, Target, Award, Medal, Users, Lightbulb, Heart, FileCheck } from 'lucide-react';

// Define Leadership type (same as in the hook but extended for modal)
interface RichTextContent {
  root?: {
    children?: Array<{
      children?: Array<{
        text?: string;
      }>;
    }>;
  };
}

interface LeadershipProfile {
  id: string;
  name: string;
  position: string;
  bio: RichTextContent;
  image?: {
    url?: string;
    alt?: string;
  };
  detailedBio?: RichTextContent;
  experience?: string;
  education?: string;
  expertise?: Array<{ skill: string }>;
  achievements?: Array<{ achievement: string }>;
  quote?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  projects?: Array<{
    name: string;
    description?: string;
    year?: string;
  }>;
}

const About = () => {
  const { data, loading, error, richTextToPlainText } = useAboutPage();
  const [selectedProfile, setSelectedProfile] = useState<LeadershipProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProfileClick = (profile: LeadershipProfile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  // Loading state
  if (loading) {
    return (
      <main className="flex-grow">
        <div className="container-custom py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <main className="flex-grow">
        <div className="container-custom py-20">
          <div className="text-center text-red-600">
            <p>Có lỗi xảy ra khi tải thông tin: {error}</p>
          </div>
        </div>
      </main>
    );
  }

  // Icon mapping
  const getIcon = (iconName: string, size = 24) => {
    const iconProps = { size, className: "text-primary" };
    switch (iconName) {
      case 'eye': return <Eye {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'award': return <Award {...iconProps} />;
      case 'medal': return <Medal {...iconProps} />;
      case 'certificate': return <FileCheck {...iconProps} />;
      case 'team': return <Users {...iconProps} />;
      case 'innovation': return <Lightbulb {...iconProps} />;
      case 'heart': return <Heart {...iconProps} />;
      default: return <Award {...iconProps} />;
    }
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-12 md:py-20">
        <div className="container-custom">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
            {data.heroSection.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {data.heroSection.subtitle}
          </p>
        </div>
      </div>      {/* Lịch sử phát triển */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                {data.companyHistory.title}
              </h2>
              <div className="space-y-4">
                {richTextToPlainText(data.companyHistory.description)
                  .split('\n\n')
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{data.companyHistory.establishedYear}</p>
                  <p className="text-sm text-muted-foreground">Năm thành lập</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{data.companyHistory.experienceYears}+</p>
                  <p className="text-sm text-muted-foreground">Năm kinh nghiệm</p>
                </div>
              </div>
            </div>            <div className="relative">
              <img 
                src={data.heroSection?.backgroundImage?.url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop&crop=center"}
                alt={data.heroSection?.backgroundImage?.alt || "VRC Company History"} 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>      {/* Tầm nhìn & Sứ mệnh */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                {getIcon(data.vision?.icon || 'eye')}
                <span className="ml-2">{data.vision?.title || 'Tầm nhìn'}</span>
              </h2>
              <div className="space-y-4">
                {data.vision?.description && richTextToPlainText(data.vision.description)
                  .split('\n\n')
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center">
                {getIcon(data.mission?.icon || 'target')}
                <span className="ml-2">{data.mission?.title || 'Sứ mệnh'}</span>
              </h2>
              <div className="space-y-4">
                {data.mission?.description && richTextToPlainText(data.mission.description)
                  .split('\n\n')
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Giá trị cốt lõi */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.coreValues?.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary">
                <div className="mb-4 text-primary">
                  {getIcon(value.icon, 40)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <div>
                  {richTextToPlainText(value.description)
                    .split('\n\n')
                    .map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Đội ngũ lãnh đạo */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">Đội ngũ lãnh đạo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {data.leadership?.map((leader, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => handleProfileClick(leader as LeadershipProfile)}
              >
                <img 
                  src={leader.image?.url || `https://i.pravatar.cc/300?img=${index + 1}`}
                  alt={leader.image?.alt || leader.name} 
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-primary">{leader.name}</h3>
                  <p className="text-muted-foreground">{leader.position}</p>
                  {leader.bio && (
                    <p className="text-sm mt-2">{richTextToPlainText(leader.bio)}</p>
                  )}
                  <div className="mt-3 text-sm text-blue-600 font-medium">
                    Nhấp để xem thêm →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>{/* Thành tựu */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">Thành tựu nổi bật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <ul className="space-y-6">
                {data.achievements?.slice(0, Math.ceil(data.achievements.length / 2)).map((achievement, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-min">
                      {getIcon(achievement.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>            <div>
              <ul className="space-y-6">
                {data.achievements?.slice(Math.ceil(data.achievements.length / 2)).map((achievement, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="bg-primary/10 p-3 rounded-full h-min">
                      {getIcon(achievement.icon)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-muted-foreground">{achievement.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile Modal */}
      <LeadershipProfileModal
        profile={selectedProfile}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
};

export default About;