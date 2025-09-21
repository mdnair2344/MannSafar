import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Client {
  id: string;
  name: string;
  childPhone: string;
  childEmail: string;
  parentEmail: string;
  parentPhone: string;
  profileImage: string; // Optional, can be empty for initials
}

interface ClientContextProps {
  clients: Client[];
  addClient: (client: Omit<Client, "id">) => void;
  deleteClient: (id: string) => void;
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClientContext must be used within ClientProvider");
  }
  return context;
};

export const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ✅ Replace randomuser.me with real Indian images
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Jaismeen",
      childPhone: "9876543210",
      childEmail: "jaissawhney123@gmail.com",
      parentEmail: "parent@gmail.com",
      parentPhone: "9876500001",
      profileImage: "",
    },
    {
      id: "2",
      name: "Rithvik Kumar",
      childPhone: "+91 9876543222",
      childEmail: "rithvik@gmail.com",
      parentEmail: "puneetkumar@gmail.com",
      parentPhone: "9876500002",
      profileImage: "https://th.bing.com/th/id/OIP.BF53JJaUE9-gWgwz6h-odwHaEJ?w=302&h=180&c=7&r=0&o=5&dpr=1.1&pid=1.7",
    },
    {
      id: "3",
      name: "Kashish Balana",
      childPhone: "9876543233",
      childEmail: "kashish@gmail.com",
      parentEmail: "ashwanibalana@gmail.com",
      parentPhone: "9876500003",
      profileImage: "https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.webp?a=1&b=1&s=612x612&w=0&k=20&c=u5RPl326UFf1oyrM1iLFJtqdQ3K28TdBdSaSPKeCrdc=",
    },
    {
      id: "4",
      name: "Devika Nair",
      childPhone: "+91 9876543244",
      childEmail: "devikanair345@gmail.com",
      parentEmail: "deepak@gmail.com",
      parentPhone: "+91 9876500004",
      profileImage: "https://i.pinimg.com/originals/0a/0b/90/0a0b908c5b6e999347734af2262d9074.jpg",
    },
    {
      id: "5",
      name: "Rohan Gupta",
      childPhone: "9876543255",
      childEmail: "rohangupta@gmail.com",
      parentEmail: "sandeep@gmail.com",
      parentPhone: "+91 9876500005",
      profileImage: "https://i1.rgstatic.net/ii/profile.image/459558561816576-1486578707350_Q512/Adam-Jakab.jpg",
    },
  ]);

  /** Add new client dynamically */
  const addClient = (client: Omit<Client, "id">) => {
    const newClient = { ...client, id: Date.now().toString() };
    setClients((prev) => [...prev, newClient]);
  };

  /** Delete client by ID */
  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  return (
    <ClientContext.Provider value={{ clients, addClient, deleteClient }}>
      {children}
    </ClientContext.Provider>
  );
};
