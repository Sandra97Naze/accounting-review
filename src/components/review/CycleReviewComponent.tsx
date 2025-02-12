import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, CheckCircle, UserPlus, ArrowLeft, Upload, CheckSquare } from 'lucide-react';
import { UserData, CycleData, Cycles, Company } from '@/types/types';

interface CycleReviewProps {
  cycle: string;
  cycleData: CycleData;
  company: Company;
  user: UserData;
  onBack: () => void;
  onFileUpload: (file: File, isCurrentYear: boolean) => void;
  onUpdate: (updates: Partial<CycleData>) => void;
}

const CycleReviewComponent: React.FC<CycleReviewProps> = ({
  cycle,
  cycleData,
  company,
  user,
  onBack,
  onFileUpload,
  onUpdate
}) => {
  const router = useRouter();
  const [comments, setComments] = useState<Array<{
    text: string;
    author: string;
    role: string;
    timestamp: string;
  }>>([]);
  const [newComment, setNewComment] = useState('');
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isCurrentYear: boolean) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, isCurrentYear);
    }
  };

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
      
      onUpdate({ 
        comments: (cycleData.comments || 0) + 1 
      });
    }
  };

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
      
      onUpdate({ 
        tasks: (cycleData.tasks || 0) + 1 
      });
    }
  };

  const updateCycleStatus = (newStatus: CycleData['status']) => {
    onUpdate({ 
      status: newStatus,
      progress: newStatus === 'valide' ? 100 : cycleData.progress
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        
        {user.permissions.canValidate && (
          <div className="flex space-x-2">
            {cycleData.status === 'en_cours' && (
              <button 
                onClick={() => updateCycleStatus('a_valider')}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Prêt à valider
              </button>
            )}
            {cycleData.status === 'a_valider' && (
              <button 
                onClick={() => updateCycleStatus('valide')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Valider
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Section Gauche : Détails et Import */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{cycle}</h2>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Statut :</span>
              <span 
                className={`px-3 py-1 rounded-full text-sm ${
                  cycleData.status === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                  cycleData.status === 'a_valider' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                {cycleData.status === 'en_cours' ? 'En cours' :
                 cycleData.status === 'a_valider' ? 'À valider' :
                 'Validé'}
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Progression :</span>
              <span>{cycleData.progress}%</span>
            </div>

            {/* Import des fichiers */}
            <div className="space-y-4 mt-6">
              <h3 className="font-medium mb-2">Documents</h3>
              
              <div>
                <input
                  type="file"
                  id="current-year"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                />
                <label
                  htmlFor="current-year"
                  className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Grand Livre N</span>
                </label>
              </div>

              <div>
                <input
                  type="file"
                  id="previous-year"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                />
                <label
                  htmlFor="previous-year"
                  className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span>Grand Livre N-1</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section Droite : Commentaires et Tâches */}
        <div className="space-y-6">
          {/* Section Commentaires */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-5 w-5 mr-2 text-gray-500" />
              <h3 className="font-semibold">Commentaires ({comments.length})</h3>
            </div>
            
            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm">{comment.text}</p>
                  <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>{comment.author}</span>
                    <span>{new Date(comment.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {user.permissions.canComment && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire"
                  className="flex-grow p-2 border rounded"
                />
                <button 
                  onClick={addComment}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Envoyer
                </button>
              </div>
            )}
          </div>

          {/* Section Tâches */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-gray-500" />
                <h3 className="font-semibold">Tâches ({tasks.length})</h3>
              </div>
              {user.permissions.canAssignTasks && (
                <button
                  onClick={() => setShowAssignTaskModal(true)}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Assigner
                </button>
              )}
            </div>

            <div className="space-y-2">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-100 p-3 rounded-lg">
                  <p className="font-medium">{task.task}</p>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-gray-500">Assigné à: {task.assignee}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status === 'completed' ? 'Terminé' : 'En cours'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'assignation de tâche */}
      {showAssignTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Assigner une nouvelle tâche</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigné à</label>
                <input
                  type="email"
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Email"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={assignTask}
                  className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                >
                  Assigner
                </button>
                <button
                  onClick={() => setShowAssignTaskModal(false)}
                  className="flex-1 bg-gray-200 p-2 rounded-md hover:bg-gray-300"
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
