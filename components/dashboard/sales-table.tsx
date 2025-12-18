"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import Papa from "papaparse";
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
import { Pencil, Trash2, Search, Upload } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SaleUser {
  id: string;
  product: string;
  status: string;
  method: string;
  amount: string;
  created_at: string;
}

export function SalesTable() {
  const [users, setUsers] = useState<SaleUser[]>([]);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    product: "",
    status: "",
    method: "",
    amount: "",
  });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [calculationResult, setCalculationResult] = useState<{
    count: number;
    totalAmount: number;
  } | null>(null);
  const [showSelectedDialog, setShowSelectedDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      product: user.product,
      status: user.status,
      method: user.method,
      amount: user.amount,
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

  const confirmBulkDelete = async () => {
    const idsToDelete = Array.from(selectedRows);

    if (idsToDelete.length === 0) return;

    const { error } = await supabase
      .from("sales")
      .delete()
      .in("id", idsToDelete);

    if (error) {
      console.error("Error deleting sales:", error);
      toast.error("Failed to delete selected sales");
    } else {
      toast.success(`Successfully deleted ${idsToDelete.length} sale(s)`);
      setSelectedRows(new Set());
      fetchSales();
    }
    setBulkDeleteDialogOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("sales")
          .update({
            product: formData.product,
            status: formData.status,
            method: formData.method,
            amount: formData.amount,
          })
          .eq("id", editingId);

        if (error) throw error;
        toast.success("Sale updated successfully");
      } else {
        const { error } = await supabase.from("sales").insert([
          {
            product: formData.product,
            status: formData.status,
            method: formData.method,
            amount: formData.amount,
          },
        ]);

        if (error) throw error;
        toast.success("Sale added successfully");
      }

      setFormData({ product: "", status: "", method: "", amount: "" });
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
      setFormData({ product: "", status: "", method: "", amount: "" });
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
    const totalAmount = selected.reduce((sum, u) => {
      const cleanAmount = (u.amount || "0").replace(/[^\d.]/g, "").trim();
      const parsedAmount = parseFloat(cleanAmount);
      return sum + (isNaN(parsedAmount) ? 0 : parsedAmount);
    }, 0);
    setCalculationResult({ count: selected.length, totalAmount });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Sales Report", 14, 22);

    const selectedUsers = users.filter((u) => selectedRows.has(u.id));
    const tableData = selectedUsers.map((user) => [
      user.product,
      user.status,
      user.method,
      user.amount,
      new Date(user.created_at).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    ]);

    autoTable(doc, {
      head: [["Product", "Status", "Method", "Amount", "Date Time"]],
      body: tableData,
      startY: 30,
    });

    doc.save("sales-report.pdf");
    toast.success("PDF exported successfully");
  };

  const handleExportExcel = () => {
    const selectedUsers = users.filter((u) => selectedRows.has(u.id));
    const tableData = selectedUsers.map((user) => ({
      Product: user.product,
      Status: user.status,
      Method: user.method,
      Amount: user.amount,
      "Date Time": new Date(user.created_at).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

    XLSX.writeFile(workbook, "sales-report.xlsx");
    toast.success("Excel exported successfully");
  };

  const handleCSVImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const data = results.data as Array<{
            product?: string;
            amount?: string;
            status?: string;
            method?: string;
          }>;

          // Validate and prepare data
          const validData = data
            .filter((row) => row.product && row.amount)
            .map((row) => ({
              product: row.product || "",
              amount: row.amount || "",
              status: row.status || "Pending",
              method: row.method || "UPI",
            }));

          if (validData.length === 0) {
            toast.error("No valid data found in CSV file");
            return;
          }

          // Bulk insert to Supabase
          const { error } = await supabase.from("sales").insert(validData);

          if (error) {
            console.error("Error importing CSV:", error);
            toast.error("Failed to import CSV data");
          } else {
            toast.success(
              `Successfully imported ${validData.length} record(s)`
            );
            fetchSales();
            setOpen(false);
          }
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast.error("Failed to process CSV file");
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        toast.error("Failed to parse CSV file");
      },
    });
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.product.toLowerCase().includes(searchLower) ||
      user.status.toLowerCase().includes(searchLower) ||
      user.method.toLowerCase().includes(searchLower) ||
      user.amount.toLowerCase().includes(searchLower) ||
      new Date(user.created_at)
        .toLocaleString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .toLowerCase()
        .includes(searchLower)
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-sans tracking-wider">Sales Reports</h2>
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
              <Button
                className="cursor-pointer"
                onClick={handleExportPDF}
                variant="outline"
              >
                Export PDF
              </Button>
              <Button
                className="cursor-pointer"
                onClick={handleExportExcel}
                variant="outline"
              >
                Export Excel
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => setBulkDeleteDialogOpen(true)}
                variant="destructive"
              >
                Delete All
              </Button>
            </div>
          )}
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">Add New User</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] dark:bg-black">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Sale" : "Add New User"}
              </DialogTitle>
              <DialogDescription>
                {editingId
                  ? "Edit the sales details below."
                  : "Enter the sales details for the new user here, or import from CSV."}{" "}
                Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">
                    Product
                  </Label>
                  <Input
                    id="product"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                    className="col-span-2"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select a Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Payment Status</SelectLabel>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="UnPaid">UnPaid</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="method" className="text-right">
                    Method
                  </Label>
                  <Select
                    value={formData.method}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, method: value }))
                    }
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Select a Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Payment Method</SelectLabel>
                        <SelectItem value="G Pay">G Pay</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="EMI">EMI</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="PhonePe">PhonePe</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="col-span-2"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                {!editingId && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCSVImport}
                      className="hidden"
                      id="csv-upload"
                    />
                    <Button
                      className="cursor-pointer mr-30"
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Import CSV
                    </Button>
                  </>
                )}
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
          <DialogContent className="h-[200px] w-full sm:w-[425px] dark:bg-black">
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
                variant="default"
                size="lg"
                onClick={confirmDelete}
              >
                Yes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
        >
          <DialogContent className="h-[200px] w-full sm:w-[425px] dark:bg-black">
            <DialogHeader>
              <DialogTitle>
                Delete {selectedRows.size} selected item(s)?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete all
                selected sale entries.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="cursor-pointer"
                variant="outline"
                size="lg"
                onClick={() => setBulkDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="cursor-pointer"
                variant="destructive"
                size="lg"
                onClick={confirmBulkDelete}
              >
                Delete All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!calculationResult}
        onOpenChange={(open) => !open && setCalculationResult(null)}
      >
        <DialogContent className="dark:bg-black">
          <DialogHeader>
            <DialogTitle>Calculation Result</DialogTitle>
            <DialogDescription>
              Summary of {calculationResult?.count} selected rows.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Total Amount</Label>
              <div className="col-span-3 font-medium">
                ₹
                {calculationResult?.totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Date Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter((u) => selectedRows.has(u.id))
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.product}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    <TableCell>{user.method}</TableCell>
                    <TableCell>{user.amount}</TableCell>
                    <TableCell className="text-right">
                      {new Date(user.created_at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search sales..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    filteredUsers.length > 0 &&
                    selectedRows.size === filteredUsers.length
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Date Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(user.id)}
                      onCheckedChange={() => toggleSelectRow(user.id)}
                      aria-label="Select row"
                    />
                  </TableCell>
                  <TableCell>{user.product}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.method}</TableCell>
                  <TableCell>{user.amount}</TableCell>
                  <TableCell className="text-right">
                    {new Date(user.created_at).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
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
