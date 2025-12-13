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
import { Checkbox } from "@/components/ui/checkbox";

interface SaleUser {
  id: string;
  today_sales: string;
  total_sales: string;
  created_at: string;
}

export function SalesTable() {
  const [users, setUsers] = useState<SaleUser[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    todaySales: "",
    totalSales: "",
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [calculationResult, setCalculationResult] = useState<{
    count: number;
    today: number;
    total: number;
  } | null>(null);
  const [showSelectedDialog, setShowSelectedDialog] = useState(false);

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

  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", userToDelete);

    if (error) {
      console.error("Error deleting sale:", error);
      toast.error("Failed to delete sale");
    } else {
      toast.success("Sale deleted successfully");
      fetchSales();
    }
    setDeleteDialogOpen(false);
    setUserToDelete(null);
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

  const toggleSelectAll = () => {
    if (selectedRows.size === users.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(users.map((u) => u.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleCalculate = () => {
    const selected = users.filter((u) => selectedRows.has(u.id));
    const today = selected.reduce(
      (sum, u) => sum + parseFloat(u.today_sales || "0"),
      0
    );
    const total = selected.reduce(
      (sum, u) => sum + parseFloat(u.total_sales || "0"),
      0
    );
    setCalculationResult({ count: selected.length, today, total });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">Sales Reports</h2>
          {selectedRows.size > 0 && (
            <div className="flex gap-2">
              <Button
                className="cursor-pointer"
                onClick={handleCalculate}
                variant="secondary"
              >
                Calculate
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => setShowSelectedDialog(true)}
                variant="outline"
              >
                Show
              </Button>
            </div>
          )}
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Add New User</Button>
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
                    className="col-span-2"
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
                    className="col-span-2"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="cursor-pointer"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="h-[200px] w-full sm:w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete the
                sale entry.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="lg"
                onClick={() => setDeleteDialogOpen(false)}
              >
                No
              </Button>
              <Button
                className="cursor-pointer"
                variant="destructive"
                size="lg"
                onClick={confirmDelete}
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!calculationResult}
        onOpenChange={(open) => !open && setCalculationResult(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calculation Result</DialogTitle>
            <DialogDescription>
              Summary of {calculationResult?.count} selected rows.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Today Sales</Label>
              <div className="col-span-3 font-medium">
                {calculationResult?.today.toFixed(2)}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Sales</Label>
              <div className="col-span-3 font-medium">
                {calculationResult?.total.toFixed(2)}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSelectedDialog} onOpenChange={setShowSelectedDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Selected Rows</DialogTitle>
            <DialogDescription>
              Details of {selectedRows.size} selected rows.
            </DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Today Sales</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead className="text-right">Date Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter((u) => selectedRows.has(u.id))
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.today_sales}</TableCell>
                    <TableCell>{user.total_sales}</TableCell>
                    <TableCell className="text-right">
                      {new Date(user.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    users.length > 0 && selectedRows.size === users.length
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Today Sales</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead className="text-right">Date Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(user.id)}
                      onCheckedChange={() => toggleSelectRow(user.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
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
