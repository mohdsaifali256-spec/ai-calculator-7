import { useState } from "react";
import { Plus, Trash2, Download, Store, User, RotateCcw } from "lucide-react";
import { Button } from "../ui/Button";
import { formatCurrency } from "../../lib/utils";
import jsPDF from "jspdf";
import { useTranslation, useInteractions } from "../../lib/hooks";

interface InvoiceItem {
  id: string;
  desc: string;
  qty: number;
  price: number;
}

export function InvoiceGenerator() {
  const [shopName, setShopName] = useState("");
  const [clientName, setClientName] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', desc: 'Sample Item', qty: 1, price: 100 }
  ]);
  const { T } = useTranslation();
  const { playInteraction } = useInteractions();

  const addItem = () => {
    playInteraction('tap');
    setItems([...items, { id: Date.now().toString(), desc: '', qty: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    playInteraction('delete');
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const exportPDF = () => {
    playInteraction('success');
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(shopName || 'TAX INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Customer: ${clientName || 'N/A'}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 40);
    
    doc.line(20, 45, 190, 45);
    doc.text('Item Description', 20, 52);
    doc.text('Qty', 100, 52);
    doc.text('Price', 130, 52);
    doc.text('Total', 160, 52);
    doc.line(20, 55, 190, 55);

    let y = 62;
    items.forEach(item => {
      doc.text(item.desc || 'Untitled', 20, y);
      doc.text(item.qty.toString(), 100, y);
      doc.text(item.price.toString(), 130, y);
      doc.text((item.qty * item.price).toString(), 160, y);
      y += 8;
    });

    doc.line(20, y, 190, y);
    y += 10;
    doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 140, y);
    y += 8;
    doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 140, y);
    y += 8;
    doc.setFontSize(14);
    doc.text(`Total: ₹${total.toFixed(2)}`, 140, y);

    doc.save(`${clientName || 'invoice'}.pdf`);
  };

  const handleReset = () => {
    playInteraction('back');
    setShopName("");
    setClientName("");
    setItems([{ id: '1', desc: '', qty: 1, price: 0 }]);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="bg-bg-card rounded-[32px] p-6 border border-white/5 space-y-6">
        <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
          <Store className="w-5 h-5 text-primary" />
          <input 
            type="text" 
            placeholder="Your Business Name" 
            value={shopName} 
            onChange={e => setShopName(e.target.value)}
            className="bg-transparent w-full outline-none font-bold text-white placeholder:text-slate-700"
          />
        </div>
        <div className="flex items-center gap-4 bg-zinc-950/50 p-4 rounded-2xl border border-white/5">
          <User className="w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Customer Name" 
            value={clientName} 
            onChange={e => setClientName(e.target.value)}
            className="bg-transparent w-full outline-none text-white placeholder:text-slate-700"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Bill Items</h3>
          <button onClick={addItem} className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-widest hover:opacity-80">
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-bg-card p-4 rounded-2xl border border-white/5 space-y-4 group">
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  placeholder="Item description" 
                  value={item.desc}
                  onChange={e => updateItem(item.id, 'desc', e.target.value)}
                  className="bg-zinc-950 border border-white/5 p-2 rounded-xl outline-none flex-1 text-sm text-white placeholder:text-slate-700"
                />
                <button onClick={() => removeItem(item.id)} className="w-9 h-9 rounded-xl bg-red-400/5 hover:bg-red-400/10 flex items-center justify-center transition-all">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-600 ml-1">Qty</p>
                  <input 
                    type="number" 
                    value={item.qty}
                    onChange={e => updateItem(item.id, 'qty', parseFloat(e.target.value) || 0)}
                    className="bg-zinc-950 border border-white/5 p-2 rounded-xl outline-none w-full text-center font-mono text-white"
                  />
                </div>
                <div className="flex-[2] space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-600 ml-1">Price (₹)</p>
                  <input 
                    type="number" 
                    value={item.price}
                    onChange={e => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                    className="bg-zinc-950 border border-white/5 p-2 rounded-xl outline-none w-full text-right font-mono text-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/10 rounded-[32px] p-8 border border-primary/20 space-y-4">
        <div className="flex justify-between text-sm text-slate-400">
          <span>Subtotal</span>
          <span className="font-mono">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-slate-400">
          <span>GST (18%)</span>
          <span className="font-mono">{formatCurrency(gst)}</span>
        </div>
        <div className="flex justify-between items-end pt-4 border-t border-white/10">
          <span className="text-sm font-bold text-white uppercase tracking-widest">Grand Total</span>
          <span className="text-3xl font-mono font-bold text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleReset} className="flex-1 py-4 h-14 rounded-2xl bg-zinc-900 border-white/5">
          <RotateCcw className="w-4 h-4 mr-2" /> {T('reset')}
        </Button>
        <Button variant="primary" onClick={exportPDF} className="flex-[2] py-4 h-14 rounded-2xl neon-blue font-bold uppercase tracking-widest">
          <Download className="w-4 h-4 mr-2" /> Download PDF
        </Button>
      </div>
    </div>
  );
}
