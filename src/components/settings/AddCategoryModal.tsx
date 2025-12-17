
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Plus } from "lucide-react";

interface AddCategoryModalProps {
  onAddCategory: (name: string, id?: string) => void;
  cname?: string;
  id?: string;
}

export function AddCategoryModal({ onAddCategory, cname, id }: AddCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(cname || "");

  useEffect(() => {
    if (cname) {
      setCategoryName(cname);
    }
  }, [cname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim(), id);
      setCategoryName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? <Button variant="ghost" size="sm" className="gap-1">
          <Edit className="h-3 w-3" />
        </Button> : <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? "Edit Category" : "Add New Category"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., India, US, Canada"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!categoryName.trim()}>
              {id ? "Save" : "Add Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
