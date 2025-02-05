import { useEffect, useState } from "react";
import { getTasks, addTask, updateTaskStatus, deleteTask, updateTask } from "../../utils/tasks"; // Add updateTask function
import { Task } from "../../tasks/task";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", dueDate: "", status: "To-Do", category: "" });
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null); // Track which task is being edited
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    try {
      const addedTask = await addTask({ ...newTask });
      if (addedTask && addedTask.id) {
        setTasks((prevTasks) => [...prevTasks, addedTask]);
        setNewTask({ title: "", dueDate: "", status: "To-Do", category: "" });
        setShowAddTask(false);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCheckboxChange = (taskId: string, status: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        task.status = status;
      }
      return task;
    });
    setTasks(updatedTasks);
    updateTaskStatus(taskId, status); // Assuming this function updates the task status on the server.
  };

  const handleTaskClick = (taskId: string) => {
    if (activeTaskId === taskId) {
      setActiveTaskId(null); // Hide buttons if clicked again
    } else {
      setActiveTaskId(taskId); // Show buttons for clicked task
    }
  };

  const handleEditTask = (taskId: string) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setNewTask(taskToEdit);
      setEditingTaskId(taskId); // Set the task that is being edited
      setShowAddTask(true); // Show the Add Task form to update the task.
    }
  };

  const handleSaveEdit = async () => {
    if (editingTaskId) {
      const updatedFields = { ...newTask }; // Get the updated fields from the form
      try {
        await updateTask(editingTaskId, updatedFields); // Pass taskId and updated fields separately
        const updatedTasks = tasks.map((task) =>
          task.id === editingTaskId ? { ...task, ...updatedFields } : task
        );
        setTasks(updatedTasks); // Update state with the new task
        setShowAddTask(false); // Close the add/edit form
        setEditingTaskId(null); // Clear the editing state
        setNewTask({ title: "", dueDate: "", status: "To-Do", category: "" }); // Reset form fields
      } catch (error) {
        console.error("Error saving task:", error);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId); // Assuming this function deletes the task from the server.
      setTasks(tasks.filter((task) => task.id !== taskId)); // Remove task from the state.
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    // If there is no destination (user canceled drag), return
    if (!destination) return;

    // If the task was dropped in the same position, return
    if (destination.index === source.index && destination.droppableId === source.droppableId) return;

    const updatedTasks = [...tasks];
    const [removed] = updatedTasks.splice(source.index, 1);
    removed.status = destination.droppableId; // Update the task status
    updatedTasks.splice(destination.index, 0, removed);

    setTasks(updatedTasks);

    // Optionally update the task status on the server
    updateTaskStatus(removed.id, removed.status);
  };

  return (
    <div className="p-2">
      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <label className="font-medium">Filter by:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border px-2 py-1 rounded-full">
            <option value="">Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <select value={dueDateFilter} onChange={(e) => setDueDateFilter(e.target.value)} className="border p-1 rounded-full">
            <option value="">Due Date</option>
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-1 rounded-full" />
          <button onClick={() => setShowAddTask(true)} className="bg-purple-800 text-white p-2 rounded-full">+ Add Task</button>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-300 py-2 font-semibold text-gray-700">
        <span className="w-1/4">Task Name</span>
        <span className="w-1/4">Due On</span>
        <span className="w-1/4">Task Status</span>
        <span className="w-1/4">Task Category</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {['To-Do', 'In Progress', 'Completed'].map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={`mb-6 rounded ${status === 'To-Do' ? 'bg-gray-100' : ` ${status === 'In Progress' ? 'bg-blue-200' : 'bg-green-200'}`}`}>

                {/* Title Section for status */}
                <div className={`p-2 rounded-t w-full ${status === 'To-Do' ? 'bg-pink-200' : status === 'In Progress' ? 'bg-blue-200' : 'bg-green-200'}`}>
                  <h2 className="text-xl font-semibold">{status} ({tasks.filter(task => task.status === status).length})</h2>
                </div>

                {/* Add Task Section for status */}
                {status === 'To-Do' && (
                  <div className="p-2 mb-0.5">
                    <button onClick={() => setShowAddTask(true)} className="text-black font-semibold w-1/8">
                      + Add Task
                    </button>
                  </div>
                )}
                 {/* Add Task Form for To-Do when button is clicked */}
          {status === 'To-Do' && showAddTask && (
            <div>
              <div className="flex mb-4 justify-around">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <button onClick={() => setDatePickerVisible(!datePickerVisible)}>
                  + Add Date
                </button>
                {datePickerVisible && (
                  <input
                    type="date"
                    className="ml-2"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                )}
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  <option value="To-Do">To-Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                >
                  <option value="">+ Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div className="flex px-10 gap-2">
                <button onClick={handleAddTask} className="bg-purple-500 text-white p-1 rounded w-1/16 mb-4">
                  Add
                </button>
                <button onClick={() => setShowAddTask(false)} className="bg-gray-400 text-white p-1 rounded w-1/16 mb-4">
                  Cancel
                </button>
              </div>
            </div>
          )}


                {/* Task List */}
                {tasks.filter(task => task.status === status).map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-gray-100 p-3 rounded mb-2 flex justify-between shadow-md"
                    >
                      {/* Task Item */}
                      <div>
                        <input
                          type="checkbox"
                          checked={task.status === "Completed"}
                          onChange={() =>
                            handleCheckboxChange(
                              task.id,
                              task.status === "To-Do" ? "In Progress" : "Completed"
                            )
                          }
                          className="mt-1"
                        />
                        <span
                          onClick={() => handleTaskClick(task.id)}
                          className="cursor-pointer"
                        >
                          {task.title}
                        </span>
                      </div>

                      <span>{task.dueDate}</span>
                      <span>{task.status}</span>
                      <span>{task.category}</span>

                      {/* Conditionally render Edit/Delete buttons */}
                      {activeTaskId === task.id && (
                        <div className="flex flex-col mt-2 space-y-2">
                          <button
                            onClick={() => handleEditTask(task.id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>

                ))}
                 {provided.placeholder}

                {/* Edit Task Form */}
                {showAddTask && editingTaskId && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                      <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
                      <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full border p-2 mb-2" />
                      <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full border p-2 mb-2" />
                      <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} className="w-full border p-2 mb-2">
                        <option value="">Select Category</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                      </select>
                      <select
        value={newTask.status}
        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
        className="w-full border p-2 mb-2"
      >
        <option value="To-Do">To-Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      
                      <div className="flex justify-between">
                        <button onClick={handleSaveEdit} className="bg-blue-500 text-white p-2 rounded">Save</button>
                        <button onClick={() => setShowAddTask(false)} className="bg-gray-400 text-white p-2 rounded">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default TaskListPage;



