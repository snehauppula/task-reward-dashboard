
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTaskContext } from '@/contexts/TaskContext';
import { Bell, Clock, Calendar, Mail, Smartphone, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SmartReminders = () => {
  const { notificationSettings, updateNotificationSettings, tasks } = useTaskContext();
  const [testNotification, setTestNotification] = useState(false);

  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours > 0 && diffHours <= 24;
  });

  const handleSettingChange = (key: keyof typeof notificationSettings, value: any) => {
    updateNotificationSettings({ [key]: value });
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const sendTestNotification = () => {
    setTestNotification(true);
    
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Test Notification', {
          body: 'This is how your task reminders will look!',
          icon: '/favicon.ico'
        });
        toast({
          title: "Test Notification Sent",
          description: "Check your browser notifications!",
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Test Notification', {
              body: 'This is how your task reminders will look!',
              icon: '/favicon.ico'
            });
          }
        });
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Please enable notifications in your browser settings.",
          variant: "destructive"
        });
      }
    }
    
    setTimeout(() => setTestNotification(false), 2000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive task reminders!",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Smart Reminders</h2>
          <p className="text-gray-600">Stay on top of your tasks with intelligent notifications</p>
        </div>
      </div>

      {/* Notification Permission */}
      {('Notification' in window && Notification.permission !== 'granted') && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-semibold text-amber-800">Enable Browser Notifications</h3>
                  <p className="text-sm text-amber-700">Allow notifications to receive task reminders</p>
                </div>
              </div>
              <Button onClick={requestNotificationPermission} className="bg-amber-600 hover:bg-amber-700">
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Enable Notifications</h4>
                <p className="text-sm text-gray-600">Master switch for all notifications</p>
              </div>
              <Switch
                checked={notificationSettings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Due Date Reminders</h4>
                <p className="text-sm text-gray-600">Get notified before tasks are due</p>
              </div>
              <Switch
                checked={notificationSettings.dueDateReminders}
                onCheckedChange={(checked) => handleSettingChange('dueDateReminders', checked)}
                disabled={!notificationSettings.enabled}
              />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Reminder Timing</h4>
              <Select 
                value={notificationSettings.reminderHours.toString()} 
                onValueChange={(value) => handleSettingChange('reminderHours', parseInt(value))}
                disabled={!notificationSettings.enabled || !notificationSettings.dueDateReminders}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="2">2 hours before</SelectItem>
                  <SelectItem value="4">4 hours before</SelectItem>
                  <SelectItem value="8">8 hours before</SelectItem>
                  <SelectItem value="24">1 day before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Daily Motivation</h4>
                <p className="text-sm text-gray-600">Morning motivation messages</p>
              </div>
              <Switch
                checked={notificationSettings.dailyMotivation}
                onCheckedChange={(checked) => handleSettingChange('dailyMotivation', checked)}
                disabled={!notificationSettings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Goal Deadlines</h4>
                <p className="text-sm text-gray-600">Weekly goal deadline reminders</p>
              </div>
              <Switch
                checked={notificationSettings.goalDeadlines}
                onCheckedChange={(checked) => handleSettingChange('goalDeadlines', checked)}
                disabled={!notificationSettings.enabled}
              />
            </div>

            <Button 
              onClick={sendTestNotification} 
              variant="outline" 
              className="w-full"
              disabled={!notificationSettings.enabled || testNotification}
            >
              {testNotification ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sent!
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 mr-2" />
                  Send Test Notification
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => {
                  const dueDate = new Date(task.dueDate!);
                  const now = new Date();
                  const diffHours = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
                  const reminderTime = diffHours - notificationSettings.reminderHours;
                  
                  return (
                    <div key={task.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-blue-900">{task.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            diffHours <= 2 ? 'border-red-200 text-red-600' : 
                            diffHours <= 8 ? 'border-yellow-200 text-yellow-600' : 
                            'border-blue-200 text-blue-600'
                          }`}
                        >
                          {diffHours <= 1 ? 'Due soon' : `${diffHours}h left`}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-blue-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {dueDate.toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          Reminder: {reminderTime > 0 ? `in ${reminderTime}h` : 'Now'}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No upcoming task reminders</p>
                  <p className="text-sm">Tasks with due dates will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Integration (Future Feature) */}
      <Card className="border-dashed border-gray-300 bg-gray-50">
        <CardContent className="p-6 text-center">
          <Mail className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <h3 className="font-semibold text-gray-600 mb-2">Email Reminders</h3>
          <p className="text-sm text-gray-500 mb-4">
            Get task reminders delivered to your email inbox
          </p>
          <Badge variant="outline" className="text-gray-500">
            Coming Soon
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};
