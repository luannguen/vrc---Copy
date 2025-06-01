import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, Linkedin, Award, Briefcase, GraduationCap, Quote } from 'lucide-react';

// Define the leadership profile type based on the API schema
interface LeadershipProfile {
  name: string;
  position: string;
  image?: {
    url?: string;
    alt?: string;
  };
  bio?: {
    root?: {
      children?: Array<{
        children?: Array<{
          text?: string;
        }>;
      }>;
    };
  };
  detailedBio?: {
    root?: {
      children?: Array<{
        children?: Array<{
          text?: string;
        }>;
      }>;
    };
  };
  experience?: string;
  education?: string;
  expertise?: Array<{
    skill: string;
  }>;
  achievements?: Array<{
    achievement: string;
  }>;
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

interface LeadershipProfileModalProps {
  profile: LeadershipProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to extract text from rich text format
interface RichTextNode {
  text?: string;
}

interface RichTextChild {
  children?: RichTextNode[];
}

interface RichTextRoot {
  root?: {
    children?: RichTextChild[];
  };
}

const extractText = (richText: RichTextRoot): string => {
  if (!richText?.root?.children) return '';
  
  return richText.root.children
    .map((child: RichTextChild) => 
      child.children?.map((textNode: RichTextNode) => textNode.text || '').join('') || ''
    )
    .join(' ');
};

const LeadershipProfileModal: React.FC<LeadershipProfileModalProps> = ({
  profile,
  isOpen,
  onClose
}) => {
  if (!profile) return null;

  const detailedBio = extractText(profile.detailedBio || {});
  const profileImage = profile.image?.url || '/api/placeholder/300/300';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Đóng"
                >
                  <X size={24} />
                </button>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt={profile.image?.alt || profile.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                    <p className="text-xl text-blue-100 mb-3">{profile.position}</p>
                    {profile.experience && (
                      <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                        <Briefcase size={16} />
                        <span>Kinh nghiệm: {profile.experience}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Quote */}
                {profile.quote && (
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-start gap-3">
                      <Quote className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                      <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                        "{profile.quote}"
                      </blockquote>
                    </div>
                  </div>
                )}

                {/* Detailed Bio */}
                {detailedBio && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <GraduationCap className="text-blue-600" size={24} />
                      Tiểu sử
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{detailedBio}</p>
                  </div>
                )}

                {/* Education */}
                {profile.education && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <GraduationCap className="text-blue-600" size={24} />
                      Học vấn
                    </h3>
                    <p className="text-gray-700">{profile.education}</p>
                  </div>
                )}

                {/* Expertise */}
                {profile.expertise && profile.expertise.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="text-blue-600" size={24} />
                      Chuyên môn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.expertise.map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {item.skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {profile.achievements && profile.achievements.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Award className="text-blue-600" size={24} />
                      Thành tích
                    </h3>
                    <ul className="space-y-2">
                      {profile.achievements.map((item, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-gray-700"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{item.achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Projects */}
                {profile.projects && profile.projects.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Briefcase className="text-blue-600" size={24} />
                      Dự án tiêu biểu
                    </h3>
                    <div className="space-y-4">
                      {profile.projects.map((project, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{project.name}</h4>
                            {project.year && (
                              <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                {project.year}
                              </span>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-gray-600 text-sm">{project.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Liên hệ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.email && (
                      <a
                        href={`mailto:${profile.email}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <Mail className="text-blue-600 group-hover:text-blue-700" size={20} />
                        <span className="text-gray-700 group-hover:text-gray-800">{profile.email}</span>
                      </a>
                    )}
                    
                    {profile.phone && (
                      <a
                        href={`tel:${profile.phone}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                      >
                        <Phone className="text-blue-600 group-hover:text-blue-700" size={20} />
                        <span className="text-gray-700 group-hover:text-gray-800">{profile.phone}</span>
                      </a>
                    )}
                    
                    {profile.linkedin && (
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group md:col-span-2"
                      >
                        <Linkedin className="text-blue-600 group-hover:text-blue-700" size={20} />
                        <span className="text-gray-700 group-hover:text-gray-800">LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeadershipProfileModal;
