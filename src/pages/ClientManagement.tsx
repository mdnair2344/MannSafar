import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Users,
  ArrowLeft,
  Trash2,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useClientContext } from "./ClientContext";

export const ClientManagement: React.FC = () => {
  const { clients, deleteClient } = useClientContext();
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  /** Helper: Generate initials for a name */
  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    return parts.map((p) => p[0].toUpperCase()).slice(0, 2).join("");
  };

  /** Curated Indian avatar image URLs */
  const indianAvatars = [
    "https://i.ibb.co/vJXw6k4/indian-man-1.jpg",
    "https://i.ibb.co/9yCFwMQ/indian-man-2.jpg",
    "https://i.ibb.co/VpFqQ2N/indian-woman-1.jpg",
    "https://i.ibb.co/6NwPftz/indian-woman-2.jpg",
    "https://i.ibb.co/LR6wBv3/indian-man-3.jpg",
    "https://i.ibb.co/jGgZbM6/indian-woman-3.jpg",
    "https://i.ibb.co/yQyRt9v/indian-man-4.jpg",
  ];

  /** Decide whether to show profileImage, random avatar, or initials */
  const getDisplayImage = (clientId: string, name: string, index: number) => {
    if (clients[index]?.profileImage) {
      return { type: "image", value: clients[index].profileImage };
    }
    return index % 2 === 0
      ? { type: "image", value: indianAvatars[index % indianAvatars.length] }
      : { type: "initials", value: getInitials(name) };
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link to="/">
          <Button variant="outline" className="mb-6 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header Section */}
        <Card className="bg-card/40 backdrop-blur-md border border-primary/20 shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-start md:items-center space-x-4">
              <div className="p-4 rounded-xl bg-purple-500/10">
                <Users className="h-7 w-7 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Client Management
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  View and manage your clients, schedule sessions, and track
                  reports.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Empty State */}
        {clients.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground border-2 border-dashed rounded-2xl bg-card/30">
            <Users className="mx-auto h-10 w-10 mb-3 text-purple-400" />
            <p className="text-lg">No clients yet. Add a client to get started.</p>
          </div>
        ) : (
          /* Client Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => {
              const display = getDisplayImage(client.id, client.name, index);

              return (
                <Card
                  key={client.id}
                  className="p-4 rounded-2xl border border-primary/10 bg-card/50 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {/* Profile Section */}
                  <div className="flex items-center space-x-4 mb-4">
                    {display.type === "image" ? (
                      <img
                        src={display.value}
                        alt={client.name}
                        className="h-16 w-16 rounded-full border border-primary/20 object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-purple-100 border border-primary/20 flex items-center justify-center text-purple-600 text-lg font-bold">
                        {display.value}
                      </div>
                    )}

                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {client.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {client.childEmail}
                      </p>
                      <p className="text-sm text-purple-500 flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2" />{" "}
                        {client.childPhone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Parent Contact Info */}
                  <div className="space-y-2 text-sm text-muted-foreground mt-2">
                    <p className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-purple-400" />{" "}
                      {client.parentEmail || "N/A"}
                    </p>
                    <p className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-pink-400" />{" "}
                      {client.parentPhone || "N/A"}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {/* Schedule Button */}
                    <Button
                      variant="secondary"
                      className="flex-1 flex items-center gap-2 rounded-xl"
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule
                    </Button>

                    {/* View Report Button */}
                    <Link to="/dummyprogress-tracker" className="flex-1">
                      <Button className="w-full flex items-center justify-center rounded-xl">
                        View Report
                      </Button>
                    </Link>
                  </div>

                  {/* Delete Button */}
                  <Button
                    className="w-full flex items-center justify-center rounded-xl bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors mt-3"
                    onClick={() => deleteClient(client.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
