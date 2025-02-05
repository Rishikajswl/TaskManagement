import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Task } from "../tasks/task";
// Define the Firestore collection reference
const tasksRef = collection(db, "tasks");

export const addTask = async (task: Omit<Task, "id">): Promise<Task> => {
    try {
      const docRef = await addDoc(tasksRef, task);
      return { id: docRef.id, ...task }; // 
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };
  
  

// Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
    try {
      const snapshot = await getDocs(tasksRef);
      return snapshot.docs.map((doc) => ({
        id: doc.id, 
        ...(doc.data() as Omit<Task, "id">),
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };
  
  export const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const taskDocRef = doc(db, "tasks", taskId);
      await updateDoc(taskDocRef, { status: newStatus });
      console.log(`Task ${taskId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };
  

// Delete a task
export const deleteTask = async (taskId: string) => {
  await deleteDoc(doc(db, "tasks", taskId));
};
export const updateTask = async (taskId: string, updatedFields: Partial<Task>) => {
  try {
    const taskDocRef = doc(db, "tasks", taskId);
    await updateDoc(taskDocRef, updatedFields);
    console.log(`Task ${taskId} updated successfully`);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

