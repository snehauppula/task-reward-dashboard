import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TaskManager } from '@/components/TaskManager';
import { WeeklyGoals } from '@/components/WeeklyGoals';
import { RewardSystem } from '@/components/RewardSystem';
import { Dashboard } from '@/components/Dashboard';
import { TaskProvider, useTaskContext } from '@/contexts/TaskContext';
import { Trophy, Target, Calendar, Star, Sparkles, Brain, Bell } from 'lucide-react';
import { ProductivityInsights } from '@/components/ProductivityInsights';
import { SmartReminders } from '@/components/SmartReminders';

const Index = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Task Tracker Pro
              </h1>
            </div>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Master your productivity with gamified task management, smart insights, and powerful habit tracking
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Main Content */}
          <Tabs defaultValue="tasks" className="mt-12">
            <TabsList className="grid w-full grid-cols-6 mb-8 h-14 bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl p-2">
              <TabsTrigger 
                value="tasks" 
                className="flex items-center gap-2 rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Calendar className="w-4 h-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                className="flex items-center gap-2 rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Target className="w-4 h-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger 
                value="rewards" 
                className="flex items-center gap-2 rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Trophy className="w-4 h-4" />
                Rewards
              </TabsTrigger>
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Star className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="flex items-center gap-2 rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Brain className="w-4 h-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger 
                value="reminders" 
                className="flex items-center gap-2 rounded-xl font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Bell className="w-4 h-4" />
                Reminders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="mt-0">
              <TaskManager />
            </TabsContent>

            <TabsContent value="goals" className="mt-0">
              <WeeklyGoals />
            </TabsContent>

            <TabsContent value="rewards" className="mt-0">
              <RewardSystem />
            </TabsContent>

            <TabsContent value="dashboard" className="mt-0">
              <Dashboard />
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <ProductivityInsights />
            </TabsContent>

            <TabsContent value="reminders" className="mt-0">
              <SmartReminders />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TaskProvider>
  );
};

const QuickStats = () => {
  const { tasks, goals, totalPoints, rewards } = useTaskContext();
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const completedGoals = goals.filter(g => g.completed).length;
  const availableRewards = rewards.filter(r => !r.redeemed).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Tasks Progress</p>
              <p className="text-4xl font-bold mt-2">{completedTasks}/{totalTasks}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <Progress value={completionRate} className="mt-4 h-2 bg-blue-400/30" />
          <p className="text-blue-100 text-xs mt-2 font-medium">{completionRate}% Complete</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">Weekly Goals</p>
              <p className="text-4xl font-bold mt-2">{completedGoals}/{goals.length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <Progress value={goals.length > 0 ? (completedGoals / goals.length) * 100 : 0} className="mt-4 h-2 bg-green-400/30" />
          <p className="text-green-100 text-xs mt-2 font-medium">
            {goals.length > 0 ? `${Math.round((completedGoals / goals.length) * 100)}% Complete` : 'No goals set'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Points</p>
              <p className="text-4xl font-bold mt-2">{totalPoints.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <span className="text-purple-100 text-sm font-medium">
                +{tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0)} earned
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-amber-100 text-sm font-medium">Rewards</p>
              <p className="text-4xl font-bold mt-2">{rewards.filter(r => r.redeemed).length}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
              <span className="text-amber-100 text-sm font-medium">{availableRewards} available</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
