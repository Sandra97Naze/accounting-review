import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, CheckCircle, UserPlus, ArrowLeft, Upload } from 'lucide-react';
import { Company, UserData, CycleData, Cycles } from '@/src/types';

interface CycleReviewProps {
  cycle: string;
  company: Company;
  user: UserData;
  cycleData: CycleData;
  onBack: () => void;
  onFileUpload: (file: File, isCurrentYear: boolean) => void;
  onCycleUpdate: (updates: Partial<CycleData>) => void;
}

const CycleReviewComponent: React.FC<CycleReviewProps> = ({
  cycle,
  company,
  user,
  cycleData,
  onBack,
  onFileUpload,
  onCycleUpdate
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
      
      // Mettre à jour le nombre de commentaires
      onCycleUpdate({ 
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
      
      // Mettre à jour le nombre de tâches
      onCycleUpdate({ 
        tasks: (cycleData.tasks || 0) + 1 
      });
    }
  };

  const updateCycleStatus = (newStatus: CycleData['status']) => {
    onCycleUpdate({ 
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
        {/* Partie gauche : Détails du cycle */}
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
            
            {/* Reste du contenu... */}
          </div>
        </div>

        {/* Partie droite : Commentaires et Tâches */}
        <div>
          {/* Section Commentaires */}
          <div className="mb-6">
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
          {/* ... (reste du code pour les tâches) */}
        </div>
      </div>
    </div>
  );
};

export default CycleReviewComponent;
