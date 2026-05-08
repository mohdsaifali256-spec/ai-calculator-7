import { useState } from "react";
import { Plus, Trash2, Download, ReceiptText } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../lib/utils";

interface Item {
  desc: string;
  qty: number;
  price: number;
}

export function InvoiceGenerator() {
  const [shopName, setShopName] = useState("My Business");
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState<Item[]>([{ desc: "", qty: 1, price: 0 }]);

  const addItem = () => setItems([...items, { desc: "", qty: 1, price: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const updateItem = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const tax = subtotal * 0.18; // Default 18% GST
  const total = subtotal + tax;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(shopName, 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`INVOICE`, 105, 30, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    doc.text(`Bill To: ${customerName}`, 20, 52);

    // Table Header
    doc.line(20, 60, 190, 60);
    doc.text("Description", 25, 67);
    doc.text("Qty", 120, 67);
    doc.text("Price", 145, 67);
    doc.text("Total", 175, 67);
    doc.line(20, 70, 190, 70);

    let y = 77;
    items.forEach((item) => {
      doc.text(item.desc, 25, y);
      doc.text(item.qty.toString(), 122, y);
      doc.text(item.price.toString(), 147, y);
      doc.text((item.qty * item.price).toString(), 177, y);
      y += 8;
    });

    doc.line(20, y, 190, y);
    y += 10;
    doc.text(`Subtotal: ${formatCurrency(subtotal)}`, 145, y);
    y += 7;
    doc.text(`GST (18%): ${formatCurrency(tax)}`, 145, y);
    y += 7;
    doc.setFontSize(12);
    doc.text(`Total: ${formatCurrency(total)}`, 145, y);

    doc.save(`Invoice_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Shop Name</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-yellow-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-1">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-zinc-400">Items</h4>
            <Button size="sm" variant="secondary" onClick={addItem} className="gap-2">
              <Plus className="w-4 h-4" /> Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  placeholder="Item description"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 outline-none"
                  value={item.desc}
                  onChange={(e) => updateItem(i, 'desc', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  className="w-16 bg-white/5 border border-white/10 rounded-xl p-2 outline-none text-center"
                  value={item.qty}
                  onChange={(e) => updateItem(i, 'qty', parseInt(e.target.value) || 0)}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="w-24 bg-white/5 border border-white/10 rounded-xl p-2 outline-none text-right"
                  value={item.price}
                  onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value) || 0)}
                />
                <Button size="icon" variant="ghost" onClick={() => removeItem(i)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
        <ReceiptText className="absolute -left-4 -bottom-4 w-32 h-32 text-yellow-500/5 rotate-12" />
        <div className="space-y-1 relative z-10">
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Grand Total</p>
          <p className="text-3xl font-mono font-bold text-yellow-500">{formatCurrency(total)}</p>
        </div>
        <Button size="lg" variant="primary" className="gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold relative z-10" onClick={generatePDF}>
          <Download className="w-5 h-5" /> Generate PDF
        </Button>
      </div>
    </div>
  );
}
