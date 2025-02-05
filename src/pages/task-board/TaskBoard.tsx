import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { Task } from "../../tasks/task";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categoryFilter, setCategoryFilter] = useState(""); // Category filter state
  const [dueDateFilter, setDueDateFilter] = useState(""); // Due date filter state
  const [isEditing, setIsEditing] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null); // Store the id of the task being edited

  useEffect(() => {
    const tasksRef = collection(db, "tasks");

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const onDragEnd = async (result: any) => {
    if (!result.destination) return; // If there's no destination, exit

    const newTasks = [...tasks]; // Copy the tasks to modify the status
    const taskIndex = newTasks.findIndex((task) => task.id === result.draggableId);

    if (taskIndex === -1) {
      console.error("Task not found with id:", result.draggableId);
      return;
    }

    const updatedTask = newTasks[taskIndex];

    // Update task status safely
    updatedTask.status = result.destination.droppableId;
    setTasks(newTasks); // Update the state with the new task list

    // Update task status in Firestore
    try {
      const taskRef = doc(db, "tasks", result.draggableId); // Reference to the task document
      await updateDoc(taskRef, { status: result.destination.droppableId });
      console.log("Task updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating task status in Firestore:", error);
    }
  };

  // Filter tasks based on category and due date
  const filteredTasks = tasks.filter((task) => {
    const categoryMatch = categoryFilter ? task.category === categoryFilter : true;
    const dueDateMatch =
      dueDateFilter === "Today"
        ? new Date(task.dueDate).toDateString() === new Date().toDateString()
        : dueDateFilter === "This Week"
        ? new Date(task.dueDate) >= new Date(new Date().setDate(new Date().getDate() - 7))
        : dueDateFilter === "This Month"
        ? new Date(task.dueDate).getMonth() === new Date().getMonth()
        : true;
    return categoryMatch && dueDateMatch;
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setActiveTaskId(task.id!); // Set the active task ID
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (editingTask) {
      const taskRef = doc(db, "tasks", editingTask.id!);
      try {
        await updateDoc(taskRef, {
          title: editingTask.title,
          category: editingTask.category,
          dueDate: editingTask.dueDate,
        });
        setIsEditing(false);
        setEditingTask(null);
        setActiveTaskId(null); // Reset active task ID
        console.log("Task updated successfully");
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleDelete = async (taskId: string) => {
    const taskRef = doc(db, "tasks", taskId);
    try {
      await deleteDoc(taskRef);
      setActiveTaskId(null); // Reset active task ID when deleted
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <span>Filter by:</span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded"
        >
          
          <option value="">Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
        <select
          value={dueDateFilter}
          onChange={(e) => setDueDateFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Due Date</option>
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
      </div>

      {/* Edit Modal */}
      {isEditing && editingTask && (
        <div className="fixed inset-0 flex items-center justify-center  bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Edit Task</h3>
            <input
              type="text"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
              className="p-2 border rounded mb-4 w-full"
              placeholder="Task Title"
            />
            <input
              type="text"
              value={editingTask.category}
              onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
              className="p-2 border rounded mb-4 w-full"
              placeholder="Category"
            />
            <input
              type="date"
              value={editingTask.dueDate}
              onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
              className="p-2 border rounded mb-4 w-full"
            />
            <div className="flex gap-4">
              <button
                onClick={handleSaveEdit}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {["To-Do", "In-Progress", "Completed"].map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`w-1/3 p-4 border rounded ${status === 'To-Do' ? 'bg-pink-200' : status === 'In-Progress' ? 'bg-blue-200' : 'bg-green-200'}`}
                >
                  <h3 className="text-lg font-bold mb-2">{status}</h3>
                  {/* Empty State */}
                  {filteredTasks.filter((task) => task.status === status).length === 0 ? (
                    <div className=" text-center mt-2">
                      No tasks in this column.
                    </div>
                  ) : (
                    filteredTasks
                      .filter((task) => task.status === status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id!} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="p-2  my-2 rounded"
                              onClick={() => setActiveTaskId(task.id!)} 
                            >
                              <div className="flex justify-between">
                                <span>{task.title}</span>
                                {activeTaskId === task.id && ( 
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleEdit(task)}
                                      className="text-blue-500"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(task.id!)}
                                      className="text-red-500"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskBoard;


