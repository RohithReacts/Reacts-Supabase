"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SaleUser {
  id: string;
  today_sales: string;
  total_sales: string;
  created_at: string;
}

export function SalesTable() {
  const [users, setUsers] = useState<SaleUser[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    todaySales: "",
    totalSales: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to fetch sales data");
    } else {
      setUsers(data || []);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (user: SaleUser) => {
    setEditingId(user.id);
    setFormData({
      todaySales: user.today_sales,
      totalSales: user.total_sales,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    const { error } = await supabase.from("sales").delete().eq("id", id);

    if (error) {
      console.error("Error deleting sale:", error);
      toast.error("Failed to delete sale");
    } else {
      toast.success("Sale deleted successfully");
      fetchSales();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("sales")
          .update({
            today_sales: formData.todaySales,
            total_sales: formData.totalSales,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Sale updated successfully");
      } else {
        const { error } = await supabase.from("sales").insert([
          {
            today_sales: formData.todaySales,
            total_sales: formData.totalSales,
          },
        ]);

        if (error) throw error;
        toast.success("Sale added successfully");
      }

      setFormData({ todaySales: "", totalSales: "" });
      setOpen(false);
      setEditingId(null);
      fetchSales();
    } catch (error) {
      console.error("Error saving sale:", error);
      toast.error("Failed to save sale");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setEditingId(null);
      setFormData({ todaySales: "", totalSales: "" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Sales Dashboard</h2>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Add New User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Sale" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Edit the sales details below."
                  : "Enter the sales details for the new user here."}{" "}
                Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="todaySales" className="text-right">
                    Today Sales
                  </Label>
                  <Input
                    id="todaySales"
                    name="todaySales"
                    value={formData.todaySales}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalSales" className="text-right">
                    Total Sales
                  </Label>
                  <Input
                    id="totalSales"
                    name="totalSales"
                    value={formData.totalSales}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Today Sales</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead className="text-right">Date Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.today_sales}</TableCell>
                  <TableCell>{user.total_sales}</TableCell>
                  <TableCell className="text-right">
                    {new Date(user.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
