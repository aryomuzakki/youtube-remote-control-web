import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Link as LinkIcon, LogOut } from "lucide-react";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "YT Remote Control" },
    { name: "description", content: "Control YouTube remotely" },
  ];
}

export default function Home() {
  const [roomId, setRoomId] = useState<string>("");
  const [activeRoomId, setActiveRoomId] = useState<string>("");
  
  useEffect(() => {
    const saved = localStorage.getItem("yt_roomId");
    if (saved) setActiveRoomId(saved);
  }, []);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      setActiveRoomId(roomId.trim());
      localStorage.setItem("yt_roomId", roomId.trim());
    }
  };

  const handleDisconnect = () => {
    setActiveRoomId("");
    setRoomId("");
    localStorage.removeItem("yt_roomId");
  };

  if (!activeRoomId) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold tracking-tight">Connect to Extension</CardTitle>
            <CardDescription className="text-zinc-400">Enter the Room ID displayed on your extension.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnect} className="space-y-4">
              <Input
                placeholder="e.g. 123456"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 h-12 text-lg text-center tracking-widest"
              />
              <Button type="submit" className="w-full h-12 text-lg font-medium bg-zinc-100 text-zinc-950 hover:bg-zinc-200 border-none transition-colors">
                Connect
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <RemoteControl roomId={activeRoomId} onDisconnect={handleDisconnect} />;
}

function RemoteControl({ roomId, onDisconnect }: { roomId: string; onDisconnect: () => void }) {
  const pushCommand = useMutation(api.commands.pushCommand);
  const [url, setUrl] = useState("");

  const handleCommand = (action: "PLAY" | "PAUSE" | "NEXT" | "PREV") => {
    pushCommand({ roomId, action });
  };

  const handleOpenLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      pushCommand({ roomId, action: "OPEN_LINK", url: url.trim() });
      setUrl("");
    }
  };

  return (
    <main className="min-h-dvh bg-zinc-950 text-zinc-100 p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 backdrop-blur-xl">
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Connected to Room</p>
            <p className="text-lg font-bold text-white tracking-widest">{roomId}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onDisconnect} className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Media Controls */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Button 
                variant="outline" 
                className="h-28 sm:h-32 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 rounded-2xl"
                onClick={() => handleCommand("PLAY")}
              >
                <div className="flex flex-col items-center gap-3">
                  <Play className="w-10 h-10" />
                  <span className="font-medium text-sm sm:text-base">Play</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-28 sm:h-32 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 rounded-2xl"
                onClick={() => handleCommand("PAUSE")}
              >
                <div className="flex flex-col items-center gap-3">
                  <Pause className="w-10 h-10" />
                  <span className="font-medium text-sm sm:text-base">Pause</span>
                </div>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 sm:h-24 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 rounded-2xl"
                onClick={() => handleCommand("PREV")}
              >
                <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-white">
                  <SkipBack className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="text-xs sm:text-sm font-medium">Prev</span>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 sm:h-24 bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:text-white transition-all active:scale-95 rounded-2xl"
                onClick={() => handleCommand("NEXT")}
              >
                <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-white">
                  <SkipForward className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="text-xs sm:text-sm font-medium">Next</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* URL Form */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-zinc-100 flex items-center gap-2 text-base sm:text-lg">
              <LinkIcon className="w-5 h-5 text-zinc-400" />
              Open YouTube URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOpenLink} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 h-12 flex-1"
              />
              <Button type="submit" className="h-12 px-8 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-medium whitespace-nowrap">
                Open Link
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
