
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTaskContext } from '@/contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Brain, Clock, Target, TrendingUp, Award, Calendar } from 'lucide-react';

export const ProductivityInsights = () => {
  const { getProductivityInsights, habitStreaks } = useTaskContext();
  const insights = getProductivityInsights();

  // Prepare hourly data for chart
  const hourlyData = Object.entries(insights.hourlyStats).map(([hour, count]) => ({
    hour: `${hour}:00`,
    tasks: count
  }));

  // Prepare category data for pie chart
  const categoryData = Object.entries(insights.categoryStats).map(([category, count]) => ({
    name: category,
    value: count,
    color: getCategoryColor(category)
  }));

  function getCategoryColor(category: string) {
    const colors = {
      Work: '#3b82f6',
      Study: '#8b5cf6',
      Personal: '#6b7280',
      Health: '#10b981'
    };
    return colors[category] || '#6b7280';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Productivity Insights</h2>
          <p className="text-gray-600">Understand your work patterns and optimize your productivity</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-blue-800">{insights.completionRate}%</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Avg. Task Time</p>
                <p className="text-2xl font-bold text-green-800">{insights.avgCompletionTime}m</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Top Category</p>
                <p className="text-2xl font-bold text-purple-800">{insights.mostProductiveCategory}</p>
              </div>
              <Award className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Peak Hour</p>
                <p className="text-2xl font-bold text-orange-800">{insights.mostProductiveHour}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Productivity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Productivity by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyData.slice(6, 22)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Focus */}
        <Card>
          <CardHeader>
            <CardTitle>Category Focus Distribution</CardTitle>
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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

      {/* Habit Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Current Habit Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {habitStreaks.map(streak => (
              <div key={streak.category} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                    {streak.category}
                  </Badge>
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Streak</span>
                    <span className="font-semibold text-indigo-600">{streak.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Best Streak</span>
                    <span className="font-semibold text-purple-600">{streak.longestStreak} days</span>
                  </div>
                </div>
              </div>
            ))}
            
            {habitStreaks.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Complete recurring tasks to start building streaks!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-1">🎯 Focus Recommendation</h4>
              <p className="text-blue-700 text-sm">
                Your highest completion rate is in <strong>{insights.mostProductiveCategory}</strong> tasks. 
                Consider scheduling similar tasks during your peak hour ({insights.mostProductiveHour}).
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-800 mb-1">⏰ Time Management</h4>
              <p className="text-green-700 text-sm">
                Your average task completion time is {insights.avgCompletionTime} minutes. 
                Try breaking down larger tasks into {Math.ceil(parseInt(insights.avgCompletionTime) * 0.7)}-minute chunks for better focus.
              </p>
            </div>
            
            {habitStreaks.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-800 mb-1">🔥 Consistency Boost</h4>
                <p className="text-purple-700 text-sm">
                  Great job maintaining streaks! Your longest streak is {Math.max(...habitStreaks.map(s => s.longestStreak))} days. 
                  Keep it up to build lasting habits.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
