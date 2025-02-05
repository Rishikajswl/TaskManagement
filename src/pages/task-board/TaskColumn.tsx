import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { Task } from "../../tasks/task";

interface TaskColumnProps {
  status: string;
  tasks: Task[];
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-1/3 p-4 border rounded"
        >
          <h3 className="font-bold text-lg mb-2">{status}</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center">No tasks in this column.</p>
          ) : (
            tasks.map((task) => (
              <TaskCard task={task} key={task.id}  />
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
