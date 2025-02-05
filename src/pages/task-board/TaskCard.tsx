import React from "react";
import { Task } from "../../tasks/task";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="p-2 bg-gray-200 rounded shadow">
      <h4 className="font-bold">{task.title}</h4>
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
    </div>
  );
};

export default TaskCard;
