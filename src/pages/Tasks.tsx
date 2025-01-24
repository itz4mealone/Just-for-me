import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Task {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  description: string;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  useEffect(() => {
    fetchTasks();
    setupNotifications();
  }, []);

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('deadline', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      return;
    }

    setTasks(data || []);
  }

  function setupNotifications() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    Notification.requestPermission();

    // Check tasks every minute
    const interval = setInterval(() => {
      tasks.forEach(task => {
        if (!task.completed) {
          const deadline = new Date(task.deadline);
          const now = new Date();
          
          if (deadline.getTime() <= now.getTime()) {
            new Notification("Task Deadline!", {
              body: `The task "${task.title}" has reached its deadline!`,
              icon: "/notification-icon.png"
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const { error } = await supabase
      .from('tasks')
      .insert([{
        ...newTask,
        completed: false
      }]);

    if (error) {
      console.error('Error adding task:', error);
      return;
    }

    setNewTask({ title: '', description: '', deadline: '' });
    setShowForm(false);
    fetchTasks();
  }

  async function toggleTaskCompletion(taskId: string, completed: boolean) {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    fetchTasks();
  }

  async function extendDeadline(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newDeadline = new Date(task.deadline);
    newDeadline.setHours(newDeadline.getHours() + 24); // Extend by 24 hours

    const { error } = await supabase
      .from('tasks')
      .update({ deadline: newDeadline.toISOString() })
      .eq('id', taskId);

    if (error) {
      console.error('Error extending deadline:', error);
      return;
    }

    fetchTasks();
  }
  async function deleteTask(taskId: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
  
    if (error) {
      console.error('Error deleting task:', error);
      return;
    }
  
    // Refresh the tasks list
    fetchTasks();
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-playfair text-gray-800">Our Tasks</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Task</span>
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-2xl font-playfair mb-4">New Task</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-rose-500 text-white py-2 rounded-md hover:bg-rose-600"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task) => {
            const deadline = new Date(task.deadline);
            const now = new Date();
            const isOverdue = !task.completed && deadline < now;

            return (
              <div
                key={task.id}
                className={`bg-white p-6 rounded-lg shadow-md ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 flex items-center space-x-2">
                      <span>{task.title}</span>
                      {isOverdue && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </h3>
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {deadline.toLocaleDateString()} at{' '}
                          {deadline.toLocaleTimeString()}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleTaskCompletion(task.id, task.completed)}
                      className={`p-2 rounded-full ${
                        task.completed
                          ? 'text-green-500 hover:text-green-600'
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <XCircle className="h-6 w-6" />
                      )}
                    </button>
                    {!task.completed && (
                      <button
                        onClick={() => extendDeadline(task.id)}
                        className="text-blue-500 hover:text-blue-600 text-sm"
                      >
                        +24h
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          deleteTask(task.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" /> {/* Add Trash2 to your imports */}
                      </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}