
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/contexts/TaskContext';
import { Download, Upload, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DataManager = () => {
  const { tasks, goals, rewards, habitStreaks, totalPoints, notificationSettings } = useTaskContext();
  const [importFile, setImportFile] = useState<File | null>(null);

  const exportData = () => {
    const data = {
      tasks,
      goals,
      rewards,
      habitStreaks,
      totalPoints,
      notificationSettings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your task data has been downloaded as a backup file.",
    });
  };

  const importData = async () => {
    if (!importFile) return;

    try {
      const text = await importFile.text();
      const data = JSON.parse(text);

      // Validate data structure
      if (!data.tasks || !Array.isArray(data.tasks)) {
        throw new Error('Invalid backup file format');
      }

      // Store in localStorage (the context will reload from localStorage)
      localStorage.setItem('taskTracker-tasks', JSON.stringify(data.tasks));
      localStorage.setItem('taskTracker-goals', JSON.stringify(data.goals || []));
      localStorage.setItem('taskTracker-rewards', JSON.stringify(data.rewards || []));
      localStorage.setItem('taskTracker-streaks', JSON.stringify(data.habitStreaks || []));
      localStorage.setItem('taskTracker-points', (data.totalPoints || 0).toString());
      localStorage.setItem('taskTracker-settings', JSON.stringify(data.notificationSettings || {}));

      toast({
        title: "Data Imported",
        description: "Your backup has been restored. Please refresh the page to see changes.",
      });

      // Refresh the page to reload data
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Could not import the backup file. Please check the file format.",
        variant: "destructive"
      });
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast({
        title: "Data Cleared",
        description: "All data has been cleared. Refreshing page...",
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Reset to default sample data? This will overwrite your current data.')) {
      localStorage.clear();
      toast({
        title: "Reset Complete",
        description: "Application reset to default state. Refreshing page...",
      });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-sm text-gray-600">Download a backup of all your tasks, goals, and settings.</p>
              <Button onClick={exportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Backup
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Import Data</h3>
              <p className="text-sm text-gray-600">Restore from a previously exported backup file.</p>
              <Input
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="mb-2"
              />
              <Button 
                onClick={importData} 
                disabled={!importFile}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Backup
              </Button>
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold text-red-600">Danger Zone</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Defaults
              </Button>

              <Button
                variant="destructive"
                onClick={clearAllData}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Data Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
              <div className="text-sm text-blue-700">Total Tasks</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{goals.length}</div>
              <div className="text-sm text-green-700">Weekly Goals</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{rewards.length}</div>
              <div className="text-sm text-purple-700">Rewards</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{totalPoints}</div>
              <div className="text-sm text-yellow-700">Total Points</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
