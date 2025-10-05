"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Image, Download, Copy } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIToolsPanelProps {
  userCredits?: number;
  onCreditsUpdate?: (newCredits: number) => void;
}

export default function AIToolsPanel({ userCredits = 0, onCreditsUpdate }: AIToolsPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("llama2");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const models = [
    { value: "llama2", label: "Llama 2", cost: 1 },
    { value: "codellama", label: "Code Llama", cost: 2 },
    { value: "mistral", label: "Mistral", cost: 1 },
    { value: "neural-chat", label: "Neural Chat", cost: 1 },
  ];

  const handleTextGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string;

    if (!prompt.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate text');
      }

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update credits
      if (onCreditsUpdate) {
        onCreditsUpdate(result.remainingCredits);
      }

      // Clear form
      (e.target as HTMLFormElement).reset();

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageGeneration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");
    setGeneratedImage(null);

    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("imagePrompt") as string;
    const width = parseInt(formData.get("width") as string) || 512;
    const height = parseInt(formData.get("height") as string) || 512;
    const style = formData.get("style") as string || "realistic";

    try {
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({
          prompt,
          width,
          height,
          style,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate image');
      }

      setGeneratedImage(result.imageUrl);

      // Update credits
      if (onCreditsUpdate) {
        onCreditsUpdate(result.remainingCredits);
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Tools</h2>
        <Badge variant="secondary" className="text-sm">
          {userCredits} Credits
        </Badge>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Text Generation
          </TabsTrigger>
          <TabsTrigger value="image" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Image Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Generation</CardTitle>
              <CardDescription>
                Generate text using advanced AI models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="model-select">Model:</Label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label} ({model.cost} credit{model.cost > 1 ? 's' : ''})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <form onSubmit={handleTextGeneration} className="space-y-4">
                <div>
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    name="prompt"
                    placeholder="Enter your prompt here..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                <Button type="submit" disabled={isGenerating || userCredits < 1}>
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Text
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <Card key={index} className={message.role === 'user' ? 'ml-12' : 'mr-12'}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={message.role === 'user' ? 'default' : 'secondary'}>
                          {message.role === 'user' ? 'You' : 'AI'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Generation</CardTitle>
              <CardDescription>
                Create stunning images with AI (5 credits per image)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleImageGeneration} className="space-y-4">
                <div>
                  <Label htmlFor="imagePrompt">Image Prompt</Label>
                  <Textarea
                    id="imagePrompt"
                    name="imagePrompt"
                    placeholder="Describe the image you want to generate..."
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Select name="width" defaultValue="512">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="256">256px</SelectItem>
                        <SelectItem value="512">512px</SelectItem>
                        <SelectItem value="768">768px</SelectItem>
                        <SelectItem value="1024">1024px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Select name="height" defaultValue="512">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="256">256px</SelectItem>
                        <SelectItem value="512">512px</SelectItem>
                        <SelectItem value="768">768px</SelectItem>
                        <SelectItem value="1024">1024px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="style">Style</Label>
                  <Select name="style" defaultValue="realistic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="cartoon">Cartoon</SelectItem>
                      <SelectItem value="abstract">Abstract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={isGenerating || userCredits < 5}>
                  {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Image (5 Credits)
                </Button>
              </form>

              {generatedImage && (
                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <img
                      src={generatedImage}
                      alt="Generated image"
                      className="w-full rounded-lg border"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline">
                      <a href={generatedImage} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(generatedImage)}
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy URL
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}