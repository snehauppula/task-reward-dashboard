
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTaskContext } from '@/contexts/TaskContext';
import { Calendar, Clock, Star, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TaskManager = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useTaskContext();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') return task.completed;
      if (filter === 'pending') return !task.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Work': 'bg-blue-100 text-blue-800',
      'Study': 'bg-purple-100 text-purple-800',
      'Personal': 'bg-gray-100 text-gray-800',
      'Health': 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Add New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <AddTaskForm onClose={() => setIsAddingTask(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map(task => (
          <Card key={task.id} className={cn(
            "transition-all duration-200 hover:shadow-md",
            task.completed && "opacity-60"
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className={cn(
                      "font-semibold text-lg",
                      task.completed && "line-through text-gray-500"
                    )}>
                      {task.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-gray-600 text-sm">{task.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <Badge variant="outline" className={getCategoryColor(task.category)}>
                      {task.category}
                    </Badge>
                    
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {task.dueDate}
                      </div>
                    )}
                    
                    {task.estimatedTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.estimatedTime}m
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {task.points} pts
                    </div>

                    {task.recurring && (
                      <Badge variant="outline" className="text-blue-600">
                        Recurring
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Calendar className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No tasks found
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "Add your first task to get started!" 
                  : `No ${filter} tasks to show.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const AddTaskForm = ({ onClose }: { onClose: () => void }) => {
  const { addTask } = useTaskContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    category: 'Personal',
    dueDate: '',
    estimatedTime: '',
    recurring: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addTask({
      name: formData.name,
      description: formData.description || undefined,
      priority: formData.priority,
      category: formData.category,
      dueDate: formData.dueDate || undefined,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
      recurring: formData.recurring
    });

    setFormData({
      name: '',
      description: '',
      priority: 'Medium',
      category: 'Personal',
      dueDate: '',
      estimatedTime: '',
      recurring: false
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="taskName">Task Name *</Label>
        <Input
          id="taskName"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter task name"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Optional description"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, priority: value as 'High' | 'Medium' | 'Low' }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High (10 pts)</SelectItem>
              <SelectItem value="Medium">Medium (5 pts)</SelectItem>
              <SelectItem value="Low">Low (3 pts)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category</Label>
          <Select value={formData.category} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, category: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Study">Study</SelectItem>
              <SelectItem value="Personal">Personal</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          />
        </div>

        <div>
          <Label htmlFor="estimatedTime">Time (minutes)</Label>
          <Input
            id="estimatedTime"
            type="number"
            value={formData.estimatedTime}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
            placeholder="60"
            min="1"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="recurring"
          checked={formData.recurring}
          onCheckedChange={(checked) => 
            setFormData(prev => ({ ...prev, recurring: checked as boolean }))
          }
        />
        <Label htmlFor="recurring">Recurring task</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Add Task
        </Button>
      </div>
    </form>
  );
};
