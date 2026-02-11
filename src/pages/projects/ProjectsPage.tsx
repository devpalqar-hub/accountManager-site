import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Calendar, DollarSign, User, Edit2, Trash2 } from 'lucide-react';
import { projectApi } from '@/services/api';
import { Project } from '@/types';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const response = await projectApi.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectApi.delete(id);
      toast.success('Project deleted successfully');
      loadProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.clientDetails?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="page-header">Projects</h1>
          <p className="text-gray-600">Manage all your projects in one place</p>
        </div>
        <Link
          to="/projects/new"
          className="btn btn-primary flex items-center gap-2 justify-center md:w-auto"
        >
          <Plus className="w-5 h-5" />
          New Project
        </Link>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
            placeholder="Search projects by name or client..."
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'No projects found matching your search' : 'No projects yet'}
          </p>
          {!searchQuery && (
            <Link to="/projects/new" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create Your First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card hover:shadow-md transition-shadow relative"
            >
              <Link to={`/projects/${project.id}`} className="block">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {project.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {project.clientDetails && (
                  <div className="flex items-start gap-2 mb-3">
                    <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2">{project.clientDetails}</p>
                  </div>
                )}

                {project.budget && (
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-900 font-medium">
                      Budget: {formatCurrency(project.budget)}
                    </p>
                  </div>
                )}

                {(project.startDate || project.endDate) && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {project.startDate && format(new Date(project.startDate), 'MMM dd, yyyy')}
                      {project.startDate && project.endDate && ' - '}
                      {project.endDate && format(new Date(project.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}

                {project.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-3 pt-3 border-t border-gray-100">
                    {project.description}
                  </p>
                )}
              </Link>
              
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <Link
                  to={`/projects/edit/${project.id}`}
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2 text-sm py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={(e) => handleDelete(project.id, e)}
                  className="btn btn-outline flex-1 flex items-center justify-center gap-2 text-sm py-2 text-red-600 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
