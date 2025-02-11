import React, { useState } from 'react';
import { MessageSquare, CheckCircle, AlertCircle, FileCheck, UserPlus, ArrowLeft, Upload } from 'lucide-react';

interface CycleReviewProps {
  cycle: string;
  company: {
    id: string;
    name: string;
  };
  user: {
    email: string;
    role: string;
    permissions: {
      canValidate: boolean;
      canEdit: boolean;
      canComment: boolean;
      canExport: boolean;
      canAssignTasks: boolean;
    };
  };
  onBack: () => void;
  onFileUpload: (file: File, isCurrentYear: boolean) => void;
}

const CycleReviewComponent: React.FC<CycleReviewProps> = ({
  cycle,
  company,
  user,
  onBack,
  onFileUpload
}) => {
  const [comments, setComments] = useState<Array<{
    text: string;
    author: string;
    role: string;
    timestamp: string;
  }>>([]);
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState<'en_cours' | 'a_valider' | 'valide'>('en_cours');
  const [tasks, setTasks] = useState<Array<{
    id: string;
    assignee: string;
    task: string;
    status: 'pending' | 'completed';
    createdBy: string;
    createdAt: string;
  }>>([]);
  const [newTask, setNewTask] = useState('');
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [workingPapers, setWorkingPapers] = useState<Array<{
    id: string;
    title: string;
    content: string;
    lastModified: string;
  }>>([]);

  // Gestion des commentaires
  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        text: newComment,
        author: user.email,
        role: user.role,
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  // Gestion des tâches
  const assignTask = () => {
    if (newTask && selectedAssignee) {
      const task = {
        id: Date.now().toString(),
        assignee: selectedAssignee,
        task: newTask,
        status: 'pending' as const,
        createdBy: user.email,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setSelectedAssignee('');
      setShowAssignTaskModal(false);
    }
  };

  // Gestion des fichiers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isCurrentYear: boolean) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, isCurrentYear);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* En-tête du cycle */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold">{cycle}</h1>
              <p className="text-gray-500">{company.name}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {user.permissions.canValidate && status === 'a_valider' && (
              <button
                onClick={() => setStatus('valide')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Valider
              </button>
            )}
            {user.permissions.canAssignTasks && (
              <button
                onClick={() => setShowAssignTaskModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assigner une tâche
              </button>
            )}
          </div>
        </div>

        {/* Import des fichiers */}
        <div className="p-4 grid grid-cols-2 gap-4 border-b">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import Grand Livre N
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
                id="current-year-file"
                accept=".xlsx,.xls,.csv"
              />
              <label
                htmlFor="current-year-file"
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer N
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import Grand Livre N-1
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, false)}
                className="hidden"
                id="previous-year-file"
                accept=".xlsx,.xls,.csv"
              />
              <label
                htmlFor="previous-year-file"
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importer N-1
              </label>
            </div>
          </div>
        </div>

        {/* Statut du cycle */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Statut:</span>
            <span className={`px-3 py-1 rounded-full text-sm
              ${status === 'valide' ? 'bg-green-100 text-green-800' : 
                status === 'a_valider' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'}`}>
              {status === 'valide' ? 'Validé' : 
               status === 'a_valider' ? 'À valider' : 
               'En cours'}
            </span>
          </div>
        </div>

        {/* Section des commentaires */}
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Commentaires</h3>
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{comment.author} ({comment.role})</span>
                  <span>{new Date(comment.timestamp).toLocaleString()}</span>
                </div>
                <p className="mt-1">{comment.text}</p>
              </div>
            ))}
          </div>
          {user.permissions.canComment && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="flex-1 p-2 border rounded-md"
              />
              <button
                onClick={addComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section des tâches */}
        <div className="p-4 border-t">
          <h3 className="text-lg font-medium mb-4">Tâches assignées</h3>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <p className="font-medium">{task.task}</p>
                  <p className="text-sm text-gray-500">
                    Assigné à: {task.assignee}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm
                  ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {task.status === 'completed' ? 'Terminé' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal d'assignation de tâche */}
      {showAssignTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Assigner une nouvelle tâche</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description de la tâche
                </label>
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigner à
                </label>
                <input
                  type="email"
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Email du collaborateur"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={assignTask}
                  className="flex-1 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  Assigner
                </button>
                <button
                  onClick={() => setShowAssignTaskModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleReviewComponent;