import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MapPin, Users, Target, Award, Building2, FileText, Loader2 } from 'lucide-react';
import { useProject, useProjects, getImageUrl, getImageAlt, extractTextFromLexicalContent } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  
  // Use the specific useProject hook to fetch single project
  const { project, loading, error } = useProject(slug || '');
  
  // Fetch related projects (limited) for the sidebar
  const { projects: allProjects } = useProjects({ limit: 10 });

  const category = project?.category || project?.categories?.[0];

  // Set background image using useEffect to avoid inline styles
  useEffect(() => {
    if (project?.featuredImage) {
      const heroElement = document.querySelector('[data-hero-bg]') as HTMLElement;
      if (heroElement) {
        const imageUrl = getImageUrl(project.featuredImage, 'large');
        if (imageUrl) {
          heroElement.style.backgroundImage = `url(${imageUrl})`;
        }
      }
    }
  }, [project?.featuredImage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>{t('common.loading', 'Loading...')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button asChild>
            <Link to="/projects">{t('common.backToProjects', 'Back to Projects')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return <Navigate to="/404" replace />;
  }

  const featuredImage = project.featuredImage;
  const gallery = project.gallery || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700">        {featuredImage && (
          <>
            <div 
              data-hero-bg
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </>
        )}
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <Link 
              to="/projects"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.backToProjects', 'Back to Projects')}
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {category && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {category.title}
                </Badge>
              )}
              {project.status && (
                <Badge 
                  variant={project.status === 'published' ? 'default' : 'outline'}
                  className={project.status === 'published' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-600 text-white border-yellow-500'
                  }
                >
                  {project.status === 'published' ? t('project.published', 'Published') : t('project.draft', 'Draft')}
                </Badge>
              )}
            </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            {project.summary && (
              <p className="text-xl text-white/90 leading-relaxed">{project.summary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Overview */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                {t('project.overview', 'Project Overview')}
              </h2>              <div className="prose prose-lg max-w-none">
                {project.content ? (
                  <p className="text-gray-600 leading-relaxed">
                    {extractTextFromLexicalContent(project.content)}
                  </p>
                ) : project.summary ? (
                  <p className="text-gray-600 leading-relaxed">{project.summary}</p>
                ) : (
                  <p className="text-gray-500 italic">No detailed description available.</p>
                )}
              </div>
            </div>

            {/* Achievements */}
            {project.achievements && project.achievements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Award className="w-6 h-6 mr-3 text-green-600" />
                  {t('project.achievements', 'Achievements')}
                </h2>
                <ul className="space-y-3">
                  {project.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{achievement.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Standards */}
            {project.standards && project.standards.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-purple-600" />
                  {t('project.standards', 'Standards & Certifications')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.standards.map((standard, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <Award className="w-5 h-5 text-purple-600 mr-3" />
                      <span className="font-medium text-gray-800">{standard.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}            {/* Image Gallery */}
            {gallery && gallery.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">
                  {t('project.gallery', 'Project Gallery')}
                </h2>                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gallery.map((galleryItem, index) => {
                    // Handle both new structure (galleryItem.image) and old structure (direct image)
                    const image = galleryItem.image || galleryItem;
                    const imageUrl = getImageUrl(image, 'medium');
                    
                    // Skip if no valid image URL can be generated
                    if (!imageUrl) {
                      return null;
                    }
                    
                    return (
                      <div key={galleryItem.id || index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={getImageAlt(image, `${project.title} image ${index + 1}`)}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t('project.information', 'Project Information')}
              </h3>
              <div className="space-y-4">
                {project.location && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{t('project.location', 'Location')}</p>
                      <p className="text-gray-600">{project.location}</p>
                    </div>
                  </div>
                )}
                
                {project.timeframe && (
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{t('project.timeframe', 'Timeline')}</p>
                      <p className="text-gray-600">
                        {new Date(project.timeframe.startDate).toLocaleDateString()} - 
                        {project.timeframe.isOngoing 
                          ? t('project.ongoing', 'Ongoing')
                          : new Date(project.timeframe.endDate).toLocaleDateString()
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {project.area && (
                  <div className="flex items-start">
                    <Building2 className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{t('project.area', 'Project Area')}</p>
                      <p className="text-gray-600">{project.area}</p>
                    </div>
                  </div>
                )}
                
                {project.capacity && (
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{t('project.capacity', 'Capacity')}</p>
                      <p className="text-gray-600">{project.capacity}</p>
                    </div>
                  </div>
                )}

                {project.client && (
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{t('project.client', 'Client')}</p>
                      <p className="text-gray-600">{project.client}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Projects */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t('project.related', 'Related Projects')}
              </h3>              <div className="space-y-4">
                {allProjects
                  .filter(p => p.id !== project?.id && 
                    (p.category?.id === project?.category?.id || 
                     p.categories?.some(cat => project?.categories?.some(pCat => pCat.id === cat.id))))
                  .slice(0, 3)
                  .map((relatedProject) => (
                    <Link
                      key={relatedProject.id}
                      to={`/projects/detail/${relatedProject.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-3">
                        {relatedProject.featuredImage && (
                          <img
                            src={getImageUrl(relatedProject.featuredImage, 'thumbnail') || "/placeholder.svg"}
                            alt={getImageAlt(relatedProject.featuredImage, relatedProject.title)}
                            className="w-16 h-12 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedProject.title}
                          </p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {relatedProject.location}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">
                {t('project.interested', 'Interested in Similar Projects?')}
              </h3>
              <p className="text-blue-100 mb-4">
                {t('project.contactUs', 'Contact us to discuss your next project.')}
              </p>
              <Button asChild variant="secondary">
                <Link to="/contact">
                  {t('common.contactUs', 'Contact Us')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
