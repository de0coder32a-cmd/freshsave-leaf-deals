import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@/lib/store";
import { SETTINGS } from "@/lib/pricing";

export function RestockView({ manager }: { manager?: boolean }) {
  const { products } = useStore();
  const [q, setQ] = useState("");
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.code.includes(q));
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search by product name or code" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Product</TableHead><TableHead>Code</TableHead><TableHead>Stock</TableHead>{manager && <TableHead />}</TableRow></TableHeader>
          <TableBody>
            {list.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No products found</TableCell></TableRow>}
            {list.map((p) => {
              const low = p.stock < SETTINGS.lowStock;
              return (
                <TableRow key={p.code}>
                  <TableCell className="font-medium">{p.emoji} {p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.code}</TableCell>
                  <TableCell>{p.stock} {low && <Badge variant="destructive" className="ml-2">Low</Badge>}</TableCell>
                  {manager && <TableCell className="text-right">{low && <Button size="sm" asChild><Link to="/manager/wholesalers" search={{ code: p.code }}>Request restock</Link></Button>}</TableCell>}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
