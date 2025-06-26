
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
  completedAt?: string;
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

export interface HabitStreak {
  category: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface NotificationSettings {
  enabled: boolean;
  dueDateReminders: boolean;
  reminderHours: number;
  dailyMotivation: boolean;
  goalDeadlines: boolean;
}

interface TaskContextType {
  tasks: Task[];
  goals: WeeklyGoal[];
  rewards: Reward[];
  habitStreaks: HabitStreak[];
  notificationSettings: NotificationSettings;
  totalPoints: number;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'points'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addGoal: (goal: Omit<WeeklyGoal, 'id' | 'progress' | 'completed'>) => void;
  addReward: (reward: Omit<Reward, 'id' | 'redeemed'>) => void;
  redeemReward: (id: string) => void;
  updateGoalProgress: () => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  getProductivityInsights: () => any;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [habitStreaks, setHabitStreaks] = useState<HabitStreak[]>([]);
  const [totalPoints, setTotalPoints] = useState(1250);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    dueDateReminders: true,
    reminderHours: 2,
    dailyMotivation: true,
    goalDeadlines: true
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskTracker-tasks');
    const savedGoals = localStorage.getItem('taskTracker-goals');
    const savedRewards = localStorage.getItem('taskTracker-rewards');
    const savedStreaks = localStorage.getItem('taskTracker-streaks');
    const savedPoints = localStorage.getItem('taskTracker-points');
    const savedSettings = localStorage.getItem('taskTracker-settings');

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.log('Error loading tasks:', e);
      }
    } else {
      // Initialize with sample data only if no saved data
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
          completedAt: '2025-06-24T15:30:00.000Z',
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
          completedAt: '2025-06-25T07:00:00.000Z',
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
      setTasks(sampleTasks);
    }

    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (e) {
        console.log('Error loading goals:', e);
      }
    } else {
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
      setGoals(sampleGoals);
    }

    if (savedRewards) {
      try {
        setRewards(JSON.parse(savedRewards));
      } catch (e) {
        console.log('Error loading rewards:', e);
      }
    } else {
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
      setRewards(sampleRewards);
    }

    if (savedStreaks) {
      try {
        setHabitStreaks(JSON.parse(savedStreaks));
      } catch (e) {
        console.log('Error loading streaks:', e);
      }
    }

    if (savedPoints) {
      try {
        setTotalPoints(parseInt(savedPoints));
      } catch (e) {
        console.log('Error loading points:', e);
      }
    }

    if (savedSettings) {
      try {
        setNotificationSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.log('Error loading settings:', e);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('taskTracker-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('taskTracker-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('taskTracker-rewards', JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem('taskTracker-streaks', JSON.stringify(habitStreaks));
  }, [habitStreaks]);

  useEffect(() => {
    localStorage.setItem('taskTracker-points', totalPoints.toString());
  }, [totalPoints]);

  useEffect(() => {
    localStorage.setItem('taskTracker-settings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

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
        const updatedTask = { 
          ...task, 
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined
        };
        
        // Award points when completing task
        if (updatedTask.completed && !task.completed) {
          setTotalPoints(current => current + task.points);
          updateHabitStreaks(task.category);
        } else if (!updatedTask.completed && task.completed) {
          setTotalPoints(current => current - task.points);
        }
        return updatedTask;
      }
      return task;
    }));
  };

  const updateHabitStreaks = (category: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabitStreaks(prev => {
      const existing = prev.find(streak => streak.category === category);
      
      if (existing) {
        const lastDate = new Date(existing.lastCompletedDate || '');
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = existing.currentStreak;
        if (diffDays === 1) {
          // Consecutive day
          newStreak = existing.currentStreak + 1;
        } else if (diffDays > 1) {
          // Streak broken
          newStreak = 1;
        }
        
        return prev.map(streak => 
          streak.category === category 
            ? {
                ...streak,
                currentStreak: newStreak,
                longestStreak: Math.max(streak.longestStreak, newStreak),
                lastCompletedDate: today
              }
            : streak
        );
      } else {
        return [...prev, {
          category,
          currentStreak: 1,
          longestStreak: 1,
          lastCompletedDate: today
        }];
      }
    });
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
      return true;
    }
    return false;
  };

  const updateGoalProgress = () => {
    setGoals(prev => prev.map(goal => {
      const currentWeekStart = new Date(goal.weekStart);
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const relevantTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return task.category === goal.category && 
               task.completed && 
               taskDate >= currentWeekStart && 
               taskDate < weekEnd;
      });
      
      let progress = 0;
      if (goal.type === 'tasks') {
        progress = relevantTasks.length;
      } else if (goal.type === 'hours') {
        progress = relevantTasks.reduce((sum, task) => 
          sum + (task.estimatedTime || 0) / 60, 0
        );
      }
      
      const wasCompleted = goal.completed;
      const isNowCompleted = progress >= goal.target;
      
      // Award bonus points for completing goal
      if (isNowCompleted && !wasCompleted) {
        setTotalPoints(current => current + 50);
      }
      
      return {
        ...goal,
        progress: Math.min(progress, goal.target),
        completed: isNowCompleted
      };
    }));
  };

  const updateNotificationSettings = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings(prev => ({ ...prev, ...settings }));
  };

  const getProductivityInsights = () => {
    const completedTasks = tasks.filter(t => t.completed);
    const totalTasks = tasks.length;
    
    // Calculate average completion time
    const avgCompletionTime = completedTasks.reduce((sum, task) => 
      sum + (task.estimatedTime || 30), 0
    ) / (completedTasks.length || 1);

    // Most productive category
    const categoryStats: Record<string, number> = {};
    completedTasks.forEach(task => {
      categoryStats[task.category] = (categoryStats[task.category] || 0) + 1;
    });
    const mostProductiveCategory = Object.entries(categoryStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'N/A';

    // Task completion by hour (enhanced with real data where possible)
    const hourlyStats: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourlyStats[i] = 0;
    }
    
    // Add some real completion data based on completed tasks
    completedTasks.forEach(task => {
      if (task.completedAt) {
        const hour = new Date(task.completedAt).getHours();
        hourlyStats[hour] = (hourlyStats[hour] || 0) + 1;
      }
    });
    
    // Fill remaining hours with mock data for demo
    Object.keys(hourlyStats).forEach(hour => {
      if (hourlyStats[parseInt(hour)] === 0) {
        hourlyStats[parseInt(hour)] = Math.floor(Math.random() * 3);
      }
    });
    
    const mostProductiveHour = Object.entries(hourlyStats)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || '9';

    // Weekly productivity trend
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayTasks = completedTasks.filter(task => {
        const taskDate = new Date(task.completedAt || task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });
      weeklyData.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed: dayTasks.length,
        points: dayTasks.reduce((sum, task) => sum + task.points, 0)
      });
    }

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      completionRate: totalTasks > 0 ? (completedTasks.length / totalTasks * 100).toFixed(1) : '0',
      avgCompletionTime: avgCompletionTime.toFixed(0),
      mostProductiveCategory,
      mostProductiveHour: `${mostProductiveHour}:00`,
      categoryStats,
      hourlyStats,
      weeklyData,
      totalPointsEarned: completedTasks.reduce((sum, task) => sum + task.points, 0),
      averageDailyTasks: (completedTasks.length / 7).toFixed(1)
    };
  };

  // Enhanced notification system with more features
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      
      // Due date reminders
      if (notificationSettings.dueDateReminders) {
        const reminderTime = notificationSettings.reminderHours * 60 * 60 * 1000;
        
        tasks.forEach(task => {
          if (task.dueDate && !task.completed) {
            const dueDate = new Date(task.dueDate);
            const timeDiff = dueDate.getTime() - now.getTime();
            
            if (timeDiff > 0 && timeDiff <= reminderTime) {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`Task Due Soon: ${task.name}`, {
                  body: `Due in ${Math.floor(timeDiff / (1000 * 60 * 60))} hours - ${task.points} points available`,
                  icon: '/favicon.ico'
                });
              }
            }
          }
        });
      }

      // Goal deadline reminders
      if (notificationSettings.goalDeadlines) {
        goals.forEach(goal => {
          if (!goal.completed) {
            const weekEnd = new Date(goal.weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);
            const timeToDeadline = weekEnd.getTime() - now.getTime();
            const hoursToDeadline = timeToDeadline / (1000 * 60 * 60);
            
            if (hoursToDeadline > 0 && hoursToDeadline <= 24 && hoursToDeadline > 23) {
              if ('Notification' in window && Notification.permission === 'granted') {
                const progressPercent = Math.round((goal.progress / goal.target) * 100);
                new Notification(`Goal Deadline Approaching: ${goal.name}`, {
                  body: `${progressPercent}% complete - 1 day remaining`,
                  icon: '/favicon.ico'
                });
              }
            }
          }
        });
      }

      // Daily motivation (once per day at 9 AM)
      if (notificationSettings.dailyMotivation && now.getHours() === 9 && now.getMinutes() === 0) {
        const pendingTasks = tasks.filter(t => !t.completed).length;
        const motivationalMessages = [
          `Good morning! You have ${pendingTasks} tasks waiting. Let's make today productive! 🌟`,
          `Rise and shine! Time to tackle your ${pendingTasks} pending tasks. You've got this! 💪`,
          `Morning motivation: Complete your tasks today and earn valuable points! ⭐`,
          `New day, new opportunities! ${pendingTasks} tasks are ready for your attention. 🚀`
        ];
        
        if ('Notification' in window && Notification.permission === 'granted') {
          const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
          new Notification('Daily Motivation', {
            body: randomMessage,
            icon: '/favicon.ico'
          });
        }
      }
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, goals, notificationSettings]);

  // Request notification permission on first load
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Update goal progress whenever tasks change
  useEffect(() => {
    updateGoalProgress();
  }, [tasks]);

  // Auto-reset weekly goals
  useEffect(() => {
    const checkWeeklyReset = () => {
      const now = new Date();
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay());
      currentWeekStart.setHours(0, 0, 0, 0);
      
      setGoals(prev => prev.map(goal => {
        const goalWeekStart = new Date(goal.weekStart);
        const weeksPassed = Math.floor((currentWeekStart.getTime() - goalWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000));
        
        if (weeksPassed >= 1) {
          return {
            ...goal,
            weekStart: currentWeekStart.toISOString().split('T')[0],
            progress: 0,
            completed: false
          };
        }
        return goal;
      }));
    };

    // Check daily at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    const timeoutId = setTimeout(() => {
      checkWeeklyReset();
      // Then check every 24 hours
      const intervalId = setInterval(checkWeeklyReset, 24 * 60 * 60 * 1000);
      return () => clearInterval(intervalId);
    }, timeUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      goals,
      rewards,
      habitStreaks,
      notificationSettings,
      totalPoints,
      addTask,
      toggleTask,
      deleteTask,
      addGoal,
      addReward,
      redeemReward,
      updateGoalProgress,
      updateNotificationSettings,
      getProductivityInsights
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
