import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, CheckCircle, UserPlus, ArrowLeft, Upload } from 'lucide-react';

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
  const router = useRouter();
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
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Rest of your JSX remains the same */}
    </div>
  );
};

export default CycleReviewComponent;
