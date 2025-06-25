
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTaskContext } from '@/contexts/TaskContext';
import { Trophy, Star, Gift, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const RewardSystem = () => {
  const { rewards, totalPoints, addReward, redeemReward } = useTaskContext();
  const [isAddingReward, setIsAddingReward] = useState(false);

  const availableRewards = rewards.filter(r => !r.redeemed);
  const redeemedRewards = rewards.filter(r => r.redeemed);

  const handleRedeem = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (reward && totalPoints >= reward.pointCost) {
      redeemReward(rewardId);
      toast.success(`🎉 You redeemed "${reward.name}"! Enjoy your reward!`);
    } else {
      toast.error('Not enough points to redeem this reward');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Points */}
      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Reward Center</h2>
              <p className="text-purple-100">Redeem your hard-earned points for rewards!</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold flex items-center gap-2">
                <Star className="w-8 h-8 text-yellow-300" />
                {totalPoints.toLocaleString()}
              </div>
              <div className="text-purple-100">Available Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Reward Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Manage Rewards</h3>
              <p className="text-gray-600">Create custom rewards to motivate yourself</p>
            </div>
            
            <Dialog open={isAddingReward} onOpenChange={setIsAddingReward}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Gift className="w-4 h-4 mr-2" />
                  Add Reward
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Reward</DialogTitle>
                </DialogHeader>
                <AddRewardForm onClose={() => setIsAddingReward(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Tabs */}
      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available" className="flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Available ({availableRewards.length})
          </TabsTrigger>
          <TabsTrigger value="redeemed" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Redeemed ({redeemedRewards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {availableRewards.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableRewards.map(reward => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  canAfford={totalPoints >= reward.pointCost}
                  onRedeem={() => handleRedeem(reward.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Gift className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No rewards available
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first reward to start motivating yourself!
                </p>
                <Button 
                  onClick={() => setIsAddingReward(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Your First Reward
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="redeemed" className="space-y-4">
          {redeemedRewards.length > 0 ? (
            <div className="space-y-4">
              {redeemedRewards.map(reward => (
                <Card key={reward.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-700">{reward.name}</h4>
                        <p className="text-sm text-gray-500">{reward.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800 mb-2">
                          Redeemed
                        </Badge>
                        <div className="text-sm text-gray-500">
                          {reward.redeemedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(reward.redeemedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Trophy className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No rewards redeemed yet
                </h3>
                <p className="text-gray-500">
                  Complete tasks to earn points and redeem your first reward!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const RewardCard = ({ 
  reward, 
  canAfford, 
  onRedeem 
}: { 
  reward: any; 
  canAfford: boolean; 
  onRedeem: () => void; 
}) => {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      canAfford ? 'ring-2 ring-purple-200' : 'opacity-60'
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">{reward.name}</h4>
            <p className="text-gray-600 text-sm">{reward.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-bold text-lg">{reward.pointCost}</span>
              <span className="text-gray-500 text-sm">points</span>
            </div>
            
            <Badge className={
              canAfford 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }>
              {canAfford ? 'Available' : 'Too expensive'}
            </Badge>
          </div>

          <Button
            onClick={onRedeem}
            disabled={!canAfford}
            className={`w-full ${
              canAfford 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {canAfford ? 'Redeem Reward' : 'Need more points'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AddRewardForm = ({ onClose }: { onClose: () => void }) => {
  const { addReward } = useTaskContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointCost: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.pointCost) return;

    addReward({
      name: formData.name,
      description: formData.description,
      pointCost: parseInt(formData.pointCost)
    });

    setFormData({
      name: '',
      description: '',
      pointCost: ''
    });
    onClose();
    toast.success('Reward created successfully!');
  };

  const suggestedRewards = [
    { name: 'Coffee break', cost: 50 },
    { name: 'Movie night', cost: 100 },
    { name: 'Takeout dinner', cost: 150 },
    { name: 'New book', cost: 200 },
    { name: 'Gaming session', cost: 75 },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="rewardName">Reward Name *</Label>
        <Input
          id="rewardName"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Coffee break"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="What makes this reward special?"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="pointCost">Point Cost *</Label>
        <Input
          id="pointCost"
          type="number"
          value={formData.pointCost}
          onChange={(e) => setFormData(prev => ({ ...prev, pointCost: e.target.value }))}
          placeholder="100"
          min="1"
          required
        />
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <h4 className="font-medium text-sm mb-2">💡 Suggested Rewards:</h4>
        <div className="grid grid-cols-2 gap-1 text-xs">
          {suggestedRewards.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                name: suggestion.name,
                pointCost: suggestion.cost.toString()
              }))}
              className="text-left p-1 hover:bg-blue-100 rounded"
            >
              {suggestion.name} ({suggestion.cost} pts)
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">
          Create Reward
        </Button>
      </div>
    </form>
  );
};
