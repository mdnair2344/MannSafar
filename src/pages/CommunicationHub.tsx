import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  MessageSquare,
  ArrowLeft,
  Send,
  Calendar,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: number;
  sender: "therapist" | "parent";
  content: string;
  timestamp: Date;
}

export function CommunicationHub() {
  const [messages, setMessages] = useState<Message[]>([]); // 👈 initially empty
  const [newMessage, setNewMessage] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "schedule" | null>(null);

  // Therapist mock data
  const therapist = {
    name: "Dr. Anjali Sharma",
    email: "anjali.sharma@wellnesscare.com",
    address: "Karol Bagh, Delhi",
    freeSlots: ["10:00 AM - 10:30 AM", "2:00 PM - 2:30 PM", "5:00 PM - 5:30 PM"],
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      sender: "parent",
      content: newMessage.trim(),
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    // TODO: Save chat to backend
  };

  const handleSessionRequest = () => {
    if (!selectedSlot || !reason.trim()) return;

    // TODO: Save slot + reason to backend
    setIsDialogOpen(true);

    // reset
    setSelectedSlot("");
    setReason("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Link to="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to dashboard
          </Button>
        </Link>

        {/* Therapist Details */}
        <Card className="bg-card/40 backdrop-blur-sm border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold">
              <User className="h-5 w-5 text-primary" /> Therapist Details
            </CardTitle>
            <CardDescription>
              Below you can chat with the therapist or schedule a meeting.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" /> {therapist.email}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" /> {therapist.address}
            </p>

            {/* Action buttons */}
            <div className="flex gap-4 mt-6">
              <Button
                size="lg"
                className={`px-6 py-3 text-lg font-semibold rounded-xl transition ${
                  activeTab === "chat"
                    ? "bg-primary text-white"
                    : "bg-secondary text-foreground"
                }`}
                onClick={() =>
                  setActiveTab(activeTab === "chat" ? null : "chat")
                }
              >
                <MessageSquare className="h-5 w-5 mr-2" /> Chat
              </Button>

              <Button
                size="lg"
                className={`px-6 py-3 text-lg font-semibold rounded-xl transition ${
                  activeTab === "schedule"
                    ? "bg-primary text-white"
                    : "bg-secondary text-foreground"
                }`}
                onClick={() =>
                  setActiveTab(activeTab === "schedule" ? null : "schedule")
                }
              >
                <Calendar className="h-5 w-5 mr-2" /> Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Section */}
        {activeTab === "chat" && (
          <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-start md:items-center space-x-4">
                <div className="p-4 rounded-xl bg-teal-400/10">
                  <MessageSquare className="h-7 w-7 text-teal-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Communication Hub
                  </CardTitle>
                  <CardDescription>
                    Chat with your therapist regarding your child’s wellness journey.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="max-h-[400px] overflow-y-auto space-y-3 p-4 bg-background/50 rounded-lg border border-border">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Start the conversation by typing a message below.
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg max-w-[75%] ${
                        msg.sender === "therapist"
                          ? "bg-teal-100 text-teal-900 self-start"
                          : "bg-primary/20 text-primary self-end ml-auto"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <span className="text-xs text-muted-foreground block mt-1">
                        {msg.sender === "therapist" ? "Therapist" : "You"} •{" "}
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="flex gap-2 mt-4">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 resize-none"
                />
                <Button onClick={handleSend}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule Section */}
        {activeTab === "schedule" && (
          <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Schedule a Meeting
              </CardTitle>
              <CardDescription>
                Select a slot and provide reason for the session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select a slot" />
                </SelectTrigger>
                <SelectContent>
                  {therapist.freeSlots.map((slot, idx) => (
                    <SelectItem key={idx} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for session..."
                className="resize-none"
              />

              <Button
                onClick={handleSessionRequest}
                disabled={!selectedSlot || !reason.trim()}
              >
                Request Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Popup */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Sent</DialogTitle>
          </DialogHeader>
          <p>
            Your session request has been sent. Waiting for therapist approval.
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(false)}>
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}