import React from 'react';
import { useQuery } from 'react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase'; // Ensure Firestore is initialized in `firebase.ts`
import { Button, Card, CardContent, Typography, CircularProgress } from '@mui/material';

interface Task {
  id: string;
  title: string;
  description: string;
}

const fetchTasks = async (): Promise<Task[]> => {
  const querySnapshot = await getDocs(collection(db, 'tasks'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Task[];
};

const TaskPage: React.FC = () => {
  const { data: tasks, isLoading, error } = useQuery('tasks', fetchTasks);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load tasks. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">Tasks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks?.map((task) => (
          <Card key={task.id} className="shadow-md">
            <CardContent>
              <Typography variant="h6" className="font-bold">
                {task.title}
              </Typography>
              <Typography variant="body2" className="text-gray-600 mt-2">
                {task.description}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                className="mt-4"
              >
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TaskPage;
