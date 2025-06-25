
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Task {
  id: string;
  name: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  dueDate?: string;
  estimatedTime?: number;
  completed: boolean;
  createdAt: string;
  recurring?: boolean;
  points: number;
}

export interface WeeklyGoal {
  id: string;
  name: string;
  category: string;
  target: number;
  progress: number;
  type: 'tasks' | 'hours';
  weekStart: string;
  completed: boolean;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  redeemed: boolean;
  redeemedAt?: string;
}

interface TaskContextType {
  tasks: Task[];
  goals: WeeklyGoal[];
  rewards: Reward[];
  totalPoints: number;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'points'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addGoal: (goal: Omit<WeeklyGoal, 'id' | 'progress' | 'completed'>) => void;
  addReward: (reward: Omit<Reward, 'id' | 'redeemed'>) => void;
  redeemReward: (id: string) => void;
  updateGoalProgress: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalPoints, setTotalPoints] = useState(1250);

  // Initialize with sample data
  useEffect(() => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        name: 'Review quarterly reports',
        description: 'Analyze Q4 financial data',
        priority: 'High',
        category: 'Work',
        dueDate: '2025-06-25',
        estimatedTime: 120,
        completed: true,
        createdAt: '2025-06-24',
        points: 10
      },
      {
        id: '2',
        name: 'Morning workout',
        priority: 'Medium',
        category: 'Health',
        estimatedTime: 60,
        completed: true,
        createdAt: '2025-06-25',
        recurring: true,
        points: 5
      },
      {
        id: '3',
        name: 'Learn React hooks',
        description: 'Complete advanced hooks tutorial',
        priority: 'High',
        category: 'Study',
        estimatedTime: 90,
        completed: false,
        createdAt: '2025-06-25',
        points: 10
      },
      {
        id: '4',
        name: 'Grocery shopping',
        priority: 'Low',
        category: 'Personal',
        completed: false,
        createdAt: '2025-06-25',
        points: 3
      }
    ];

    const sampleGoals: WeeklyGoal[] = [
      {
        id: '1',
        name: 'Complete work tasks',
        category: 'Work',
        target: 10,
        progress: 7,
        type: 'tasks',
        weekStart: '2025-06-23',
        completed: false
      },
      {
        id: '2',
        name: 'Exercise hours',
        category: 'Health',
        target: 5,
        progress: 3,
        type: 'hours',
        weekStart: '2025-06-23',
        completed: false
      }
    ];

    const sampleRewards: Reward[] = [
      {
        id: '1',
        name: 'Coffee break',
        description: 'Enjoy a premium coffee',
        pointCost: 50,
        redeemed: false
      },
      {
        id: '2',
        name: 'Movie night',
        description: 'Watch a movie with snacks',
        pointCost: 100,
        redeemed: false
      },
      {
        id: '3',
        name: 'New book',
        description: 'Buy a book you\'ve been wanting',
        pointCost: 200,
        redeemed: true,
        redeemedAt: '2025-06-20'
      }
    ];

    setTasks(sampleTasks);
    setGoals(sampleGoals);
    setRewards(sampleRewards);
  }, []);

  const getPointsForPriority = (priority: string): number => {
    switch (priority) {
      case 'High': return 10;
      case 'Medium': return 5;
      case 'Low': return 3;
      default: return 3;
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'points'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      completed: false,
      points: getPointsForPriority(taskData.priority)
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        // Award points when completing task
        if (updatedTask.completed && !task.completed) {
          setTotalPoints(current => current + task.points);
        } else if (!updatedTask.completed && task.completed) {
          setTotalPoints(current => current - task.points);
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addGoal = (goalData: Omit<WeeklyGoal, 'id' | 'progress' | 'completed'>) => {
    const newGoal: WeeklyGoal = {
      ...goalData,
      id: Date.now().toString(),
      progress: 0,
      completed: false
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const addReward = (rewardData: Omit<Reward, 'id' | 'redeemed'>) => {
    const newReward: Reward = {
      ...rewardData,
      id: Date.now().toString(),
      redeemed: false
    };
    setRewards(prev => [...prev, newReward]);
  };

  const redeemReward = (id: string) => {
    const reward = rewards.find(r => r.id === id);
    if (reward && totalPoints >= reward.pointCost) {
      setTotalPoints(prev => prev - reward.pointCost);
      setRewards(prev => prev.map(r => 
        r.id === id 
          ? { ...r, redeemed: true, redeemedAt: new Date().toISOString().split('T')[0] }
          : r
      ));
    }
  };

  const updateGoalProgress = () => {
    setGoals(prev => prev.map(goal => {
      const relevantTasks = tasks.filter(task => 
        task.category === goal.category && task.completed
      );
      
      let progress = 0;
      if (goal.type === 'tasks') {
        progress = relevantTasks.length;
      } else if (goal.type === 'hours') {
        progress = relevantTasks.reduce((sum, task) => 
          sum + (task.estimatedTime || 0) / 60, 0
        );
      }
      
      return {
        ...goal,
        progress: Math.min(progress, goal.target),
        completed: progress >= goal.target
      };
    }));
  };

  useEffect(() => {
    updateGoalProgress();
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      goals,
      rewards,
      totalPoints,
      addTask,
      toggleTask,
      deleteTask,
      addGoal,
      addReward,
      redeemReward,
      updateGoalProgress
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
