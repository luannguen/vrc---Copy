/**
 * React Query Hooks for API Data Fetching
 * Centralized data fetching hooks using React Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { headerInfoService } from '@/services/headerInfoService';
import { getServices, getService } from '@/services/servicesService';
import { getProjects, getProject } from '@/services/projectsService';
import { getTechnologies, getTechnology } from '@/services/technologiesService';
import { getPosts, getPost } from '@/services/postsService';
import { getEvents, getEvent } from '@/services/eventsService';
import { submitContactForm, type ContactFormData } from '@/services/contactService';

// Query Keys - centralized for cache management
export const QUERY_KEYS = {
  HEADER_INFO: 'header-info',
  COMPANY_INFO: 'company-info',
  SERVICES: 'services',
  SERVICE: 'service',
  PROJECTS: 'projects',
  PROJECT: 'project',
  TECHNOLOGIES: 'technologies',
  TECHNOLOGY: 'technology',
  POSTS: 'posts',
  POST: 'post',
  EVENTS: 'events',
  EVENT: 'event',
} as const;

// Configuration for React Query
const defaultConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  refetchOnWindowFocus: false,
};

// Header & Company Info Hooks
export const useHeaderInfo = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.HEADER_INFO],
    queryFn: () => headerInfoService.getHeaderInfo(),
    ...defaultConfig,
  });
};

export const useCompanyInfo = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.COMPANY_INFO],
    queryFn: () => headerInfoService.getCompanyInfo(),
    ...defaultConfig,
  });
};

// Services Hooks
export const useServices = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICES],
    queryFn: getServices,
    ...defaultConfig,
  });
};

export const useService = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SERVICE, id],
    queryFn: () => getService(id),
    enabled: !!id,
    ...defaultConfig,
  });
};

// Projects Hooks
export const useProjects = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECTS],
    queryFn: getProjects,
    ...defaultConfig,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROJECT, id],
    queryFn: () => getProject(id),
    enabled: !!id,
    ...defaultConfig,
  });
};

// Technologies Hooks
export const useTechnologies = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.TECHNOLOGIES],
    queryFn: getTechnologies,
    ...defaultConfig,
  });
};

export const useTechnology = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TECHNOLOGY, id],
    queryFn: () => getTechnology(id),
    enabled: !!id,
    ...defaultConfig,
  });
};

// Posts Hooks
export const usePosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.POSTS],
    queryFn: getPosts,
    ...defaultConfig,
  });
};

export const usePost = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.POST, id],
    queryFn: () => getPost(id),
    enabled: !!id,
    ...defaultConfig,
  });
};

// Events Hooks
export const useEvents = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS],
    queryFn: getEvents,
    ...defaultConfig,
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT, id],
    queryFn: () => getEvent(id),
    enabled: !!id,
    ...defaultConfig,
  });
};

// Contact Form Mutation Hook
export const useContactForm = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      // Optionally invalidate any related queries
      // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONTACT] });
    },
  });
};
