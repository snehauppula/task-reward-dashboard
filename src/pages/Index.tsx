
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
import { TaskProvider } from '@/contexts/TaskContext';
import { Trophy, Target, Calendar, Star } from 'lucide-react';

const Index = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Task Tracker
            </h1>
            <p className="text-gray-600 text-lg">
              Boost your productivity with gamified task management
            </p>
          </div>

          {/* Quick Stats */}
          <QuickStats />

          {/* Main Content */}
          <Tabs defaultValue="tasks" className="mt-8">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Goals
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Rewards
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks">
              <TaskManager />
            </TabsContent>

            <TabsContent value="goals">
              <WeeklyGoals />
            </TabsContent>

            <TabsContent value="rewards">
              <RewardSystem />
            </TabsContent>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TaskProvider>
  );
};

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Today's Tasks</p>
              <p className="text-3xl font-bold">8/12</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
          <Progress value={67} className="mt-3 bg-blue-400" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Weekly Goals</p>
              <p className="text-3xl font-bold">2/3</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
          <Progress value={67} className="mt-3 bg-green-400" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total Points</p>
              <p className="text-3xl font-bold">1,250</p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
          <div className="mt-3 text-purple-100 text-sm">
            +85 this week
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100">Rewards Earned</p>
              <p className="text-3xl font-bold">15</p>
            </div>
            <Trophy className="w-8 h-8 text-amber-200" />
          </div>
          <div className="mt-3 text-amber-100 text-sm">
            3 available to redeem
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
