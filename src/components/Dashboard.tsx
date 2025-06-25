
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTaskContext } from '@/contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, Target, Trophy, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export const Dashboard = () => {
  const { tasks, goals, rewards, totalPoints } = useTaskContext();

  // Calculate stats
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
  const completedGoals = goals.filter(g => g.completed);
  const redeemedRewards = rewards.filter(r => r.redeemed);

  // Daily completion data for the week
  const getDailyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });
      const completed = dayTasks.filter(t => t.completed).length;
      
      weekData.push({
        day: days[date.getDay()],
        completed,
        total: dayTasks.length,
        date: date.toISOString().split('T')[0]
      });
    }
    return weekData;
  };

  // Category distribution
  const getCategoryData = () => {
    const categories = {};
    tasks.forEach(task => {
      categories[task.category] = (categories[task.category] || 0) + 1;
    });
    
    const colors = {
      'Work': '#3b82f6',
      'Study': '#8b5cf6',
      'Personal': '#6b7280',
      'Health': '#10b981'
    };

    return Object.entries(categories).map(([category, count]) => ({
      name: category,
      value: count,
      color: colors[category] || '#6b7280'
    }));
  };

  // Points over time (mock data for demo)
  const getPointsData = () => {
    const days = [];
    let cumulativePoints = 0;
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Mock daily points (in real app, this would be calculated from actual data)
      const dailyPoints = Math.floor(Math.random() * 50) + 20;
      cumulativePoints += dailyPoints;
      
      days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        points: cumulativePoints,
        daily: dailyPoints
      });
    }
    
    return days;
  };

  const dailyData = getDailyData();
  const categoryData = getCategoryData();
  const pointsData = getPointsData();

  const todayCompleted = dailyData[dailyData.length - 1]?.completed || 0;
  const todayTotal = dailyData[dailyData.length - 1]?.total || 0;
  const completionRate = todayTotal > 0 ? (todayCompleted / todayTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
                <p className="text-xs text-gray-500">Today: {todayCompleted}/{todayTotal}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">{goals.length - completedGoals.length}</p>
                <p className="text-xs text-gray-500">{completedGoals.length} completed</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Points</p>
                <p className="text-2xl font-bold">{totalPoints.toLocaleString()}</p>
                <p className="text-xs text-gray-500">
                  {redeemedRewards.length} rewards redeemed
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Daily Tasks</p>
                <p className="text-2xl font-bold">
                  {(completedTasks.length / 7).toFixed(1)}
                </p>
                <p className="text-xs text-gray-500">This week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Task Completion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Daily Task Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'completed' ? 'Completed' : 'Total']}
                  labelFormatter={(day) => `Day: ${day}`}
                />
                <Bar dataKey="completed" fill="#10b981" name="completed" />
                <Bar dataKey="total" fill="#e5e7eb" name="total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Task Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Points Accumulation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Points Accumulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={pointsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'points' ? 'Total Points' : 'Daily Points']}
                />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Goals Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Weekly Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map(goal => {
                  const progressPercentage = Math.min((goal.progress / goal.target) * 100, 100);
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{goal.name}</span>
                          <Badge 
                            variant="outline" 
                            className="ml-2 text-xs"
                          >
                            {goal.category}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600">
                          {goal.progress}/{goal.target}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="text-xs text-gray-500">
                        {progressPercentage.toFixed(0)}% complete
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No goals set for this week</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((completedTasks.length / tasks.length) * 100) || 0}%
              </div>
              <div className="text-sm text-blue-700">Overall Completion Rate</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {completedTasks.reduce((sum, task) => sum + task.points, 0)}
              </div>
              <div className="text-sm text-green-700">Points from Completed Tasks</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(goals.reduce((sum, goal) => sum + (goal.progress / goal.target) * 100, 0) / goals.length) || 0}%
              </div>
              <div className="text-sm text-purple-700">Average Goal Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
