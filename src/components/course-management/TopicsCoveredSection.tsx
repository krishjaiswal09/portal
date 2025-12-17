
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, BookOpen } from "lucide-react";

interface TopicsCoveredSectionProps {
  topics: string[];
  onTopicsChange: (topics: string[]) => void;
}

export function TopicsCoveredSection({
  topics,
  onTopicsChange
}: TopicsCoveredSectionProps) {
  const [newTopic, setNewTopic] = useState('');

  const addTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      onTopicsChange([...topics, newTopic.trim()]);
      setNewTopic('');
    }
  };

  const removeTopic = (index: number) => {
    const updatedTopics = topics.filter((_, i) => i !== index);
    onTopicsChange(updatedTopics);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTopic();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Topics Covered
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter topic name"
            className="flex-1"
          />
          <Button type="button" onClick={addTopic} size="sm" className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Topic
          </Button>
        </div>

        {topics.length > 0 && (
          <div className="space-y-2">
            <Label>Current Topics:</Label>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {topic}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTopic(index)}
                    className="h-auto p-0 ml-1 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
