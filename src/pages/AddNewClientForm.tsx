import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientContext } from "./ClientContext";  // updated path

export const AddNewClientForm: React.FC = () => {
  const { addClient } = useClientContext();

  const [formData, setFormData] = useState({
    name: "",
    childPhone: "",
    childEmail: "",
    parentEmail: "",
    parentPhone: "",
    profileImage: "https://randomuser.me/api/portraits/lego/1.jpg",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(formData);
    setFormData({
      name: "",
      childPhone: "",
      childEmail: "",
      parentEmail: "",
      parentPhone: "",
      profileImage: "https://randomuser.me/api/portraits/lego/1.jpg",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Full Name</Label>
        <Input id="name" placeholder="Jane Doe" value={formData.name} onChange={handleChange} className="col-span-3" required />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="childPhone" className="text-right">Child Phone</Label>
        <Input id="childPhone" placeholder="9876543210" value={formData.childPhone} onChange={handleChange} className="col-span-3" required />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="childEmail" className="text-right">Child Email</Label>
        <Input id="childEmail" type="email" placeholder="child@example.com" value={formData.childEmail} onChange={handleChange} className="col-span-3" required />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parentEmail" className="text-right">Parent Email</Label>
        <Input id="parentEmail" type="email" placeholder="parent@example.com" value={formData.parentEmail} onChange={handleChange} className="col-span-3" required />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parentPhone" className="text-right">Parent Phone</Label>
        <Input id="parentPhone" placeholder="9876500000" value={formData.parentPhone} onChange={handleChange} className="col-span-3" required />
      </div>

      <Button type="submit" className="w-full mt-4">Save Client</Button>
    </form>
  );
};
