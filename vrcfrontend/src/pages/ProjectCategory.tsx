import React, { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MapPin, Users, Building2, Loader2 } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ProjectCategory: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { t } = useTranslation();
  
  // Fetch projects filtered by category from API
  const { projects: filteredProjects, loading, error } = useProjects({ 
    category: categorySlug 
  });

  // Get category info from first project
  const category = useMemo(() => {
    if (!categorySlug || filteredProjects.length === 0) return null;
    
    const firstProject = filteredProjects[0];
    return firstProject.category?.slug === categorySlug 
      ? firstProject.category 
      : firstProject.categories?.find(cat => cat.slug === categorySlug);
  }, [filteredProjects, categorySlug]);

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

  if (!category || filteredProjects.length === 0) {
    return <Navigate to="/projects" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="container mx-auto px-4">
          <div className="text-white max-w-4xl">
            <Link 
              to="/projects"
              className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('common.backToProjects', 'Back to Projects')}
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.title} {t('projects.title', 'Projects')}
            </h1>
            {category.description && (
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl">
                {category.description}
              </p>
            )}
            
            <div className="mt-6">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {filteredProjects.length} {filteredProjects.length === 1 ? t('project.singular', 'Project') : t('project.plural', 'Projects')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/detail/${project.slug}`}
              className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Project Image */}
              <div className="aspect-video bg-gray-200 overflow-hidden">
                {project.featuredImage ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${project.featuredImage.url}`}
                    alt={project.featuredImage.alt || project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-blue-400" />
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {category.title}
                  </Badge>
                  {project.status === 'published' && (
                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                      {t('project.published', 'Published')}
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                )}

                <div className="space-y-2 text-sm text-gray-500">
                  {project.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{project.location}</span>
                    </div>
                  )}
                  
                  {project.area && (
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>{project.area}</span>
                    </div>
                  )}
                  
                  {project.capacity && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{project.capacity}</span>
                    </div>
                  )}

                  {project.timeframe && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {project.timeframe.isOngoing 
                          ? t('project.ongoing', 'Ongoing')
                          : new Date(project.timeframe.endDate).getFullYear()
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Featured achievements */}
                {project.achievements && project.achievements.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      <span className="line-clamp-1">{project.achievements[0].description}</span>
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('projects.noProjects', 'No Projects Found')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('projects.noProjectsDescription', 'There are currently no projects in this category.')}
            </p>
            <Button asChild>
              <Link to="/projects">
                {t('common.backToProjects', 'Back to Projects')}
              </Link>
            </Button>
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredProjects.length > 0 && filteredProjects.length >= 9 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              {t('common.loadMore', 'Load More Projects')}
            </Button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {filteredProjects.length > 0 && (
        <div className="bg-white border-t">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                {t('projects.interestedTitle', 'Interested in Our Projects?')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('projects.interestedDescription', 'Contact us to learn more about our capabilities and discuss your next project.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">
                    {t('common.contactUs', 'Contact Us')}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/projects">
                    {t('projects.viewAll', 'View All Projects')}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCategory;
