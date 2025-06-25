
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTaskContext } from '@/contexts/TaskContext';
import { Target, Calendar, CheckCircle, Clock } from 'lucide-react';

export const WeeklyGoals = () => {
  const { goals, addGoal } = useTaskContext();
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const getProgressPercentage = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Goals</h2>
              <p className="text-gray-600">Track your progress towards weekly objectives</p>
            </div>
            
            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Target className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Weekly Goal</DialogTitle>
                </DialogHeader>
                <AddGoalForm onClose={() => setIsAddingGoal(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid gap-6">
        {goals.map(goal => {
          const progressPercentage = getProgressPercentage(goal.progress, goal.target);
          
          return (
            <Card key={goal.id} className={`transition-all duration-200 hover:shadow-md ${
              goal.completed ? 'ring-2 ring-green-200 bg-green-50' : ''
            }`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                        {goal.name}
                        {goal.completed && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline" className="text-blue-600">
                          {goal.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Week of {new Date(goal.weekStart).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {goal.progress}/{goal.target}
                      </div>
                      <div className="text-sm text-gray-500">
                        {goal.type === 'tasks' ? 'tasks' : 'hours'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-3"
                    />
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-between items-center">
                    <Badge 
                      className={
                        goal.completed 
                          ? 'bg-green-100 text-green-800' 
                          : progressPercentage >= 75
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {goal.completed 
                        ? 'Completed!' 
                        : progressPercentage >= 75 
                        ? 'Almost there!' 
                        : 'In progress'
                      }
                    </Badge>
                    
                    {goal.completed && (
                      <div className="text-sm text-green-600 font-medium">
                        +50 bonus points earned!
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {goals.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Target className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No goals set yet
              </h3>
              <p className="text-gray-500 mb-4">
                Set your first weekly goal to start tracking progress!
              </p>
              <Button 
                onClick={() => setIsAddingGoal(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const AddGoalForm = ({ onClose }: { onClose: () => void }) => {
  const { addGoal } = useTaskContext();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Work',
    target: '',
    type: 'tasks' as 'tasks' | 'hours'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.target) return;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    addGoal({
      name: formData.name,
      category: formData.category,
      target: parseInt(formData.target),
      type: formData.type,
      weekStart: startOfWeek.toISOString().split('T')[0]
    });

    setFormData({
      name: '',
      category: 'Work',
      target: '',
      type: 'tasks'
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="goalName">Goal Name *</Label>
        <Input
          id="goalName"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Complete work tasks"
          required
        />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Goal Type</Label>
          <Select value={formData.type} onValueChange={(value) => 
            setFormData(prev => ({ ...prev, type: value as 'tasks' | 'hours' }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tasks">Number of tasks</SelectItem>
              <SelectItem value="hours">Hours spent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="target">Target *</Label>
          <Input
            id="target"
            type="number"
            value={formData.target}
            onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
            placeholder={formData.type === 'tasks' ? '10' : '8'}
            min="1"
            required
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Goal Preview</span>
        </div>
        Complete {formData.target || '0'} {formData.type} in {formData.category} category this week
        {formData.target && (
          <div className="text-green-600 mt-1">
            Reward: +50 bonus points when completed!
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
          Create Goal
        </Button>
      </div>
    </form>
  );
};
