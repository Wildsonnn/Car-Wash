import React, { useState } from "react";
import { Car, Truck, Trash2, Printer, FileDown } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import "./styles.css";

export default function App() {
  const [cars, setCars] = useState([]);
  const [plate, setPlate] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("small");
  const [service, setService] = useState("inside_outside");
  const [filterDate, setFilterDate] = useState("");

  const addCar = () => {
    if (!plate.trim()) return;

    const price = calculatePrice(type, service);
    setCars([
      ...cars,
      {
        id: Date.now(),
        plate,
        phone,
        type,
        service,
        price,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setPlate("");
  };

  const removeCar = (id) => {
    setCars(cars.filter((c) => c.id !== id));
  };

  const calculatePrice = (type, service) => {
    if (type === "large") {
      if (service === "outside") return 250;
      if (service === "inside") return 250;
      if (service === "inside_outside") return 300;
    }
    if (type === "small") {
      if (service === "outside") return 150;
      if (service === "inside") return 150;
      if (service === "inside_outside") return 200;
    }                                          
    return 200;
    if (service === "inside_outside") return 150;
    return 150;
  };

  const filteredCars = filterDate
    ? cars.filter((car) => car.date === filterDate)
    : cars;

  const totalAmount = filteredCars.reduce((acc, car) => acc + car.price, 0);

  const printInvoice = (car) => {
    const invoiceWindow = window.open("", "_blank");
    invoiceWindow.document.write(`
      <html>
        <head><title>Factura</title></head>
        <body style="font-family: sans-serif;">
          <h2>Factura - Car Wash</h2>
          <p><strong>Matrícula:</strong> ${car.plate}</p>
           <p><strong>Telefone:</strong> ${car.plate}</p>
          <p><strong>Tipo:</strong> ${car.type === "large" ? "Carro Grande" : "Carro Pequeno"}</p>
          <p><strong>Serviço:</strong> ${car.service.replace("_", " + ")}</p>
          <p><strong>Preço:</strong> ${car.price} MT</p>
          <p><strong>Data:</strong> ${car.timestamp}</p>
          <hr />
          <p>Obrigado pela preferência!</p>
        </body>
      </html>
    `);
    invoiceWindow.print();
    invoiceWindow.close();
  };

  const exportAllInvoices = () => {
    if (filteredCars.length === 0) return alert("Nenhuma fatura para exportar nesta data!");

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(16);
    doc.text("Relatório - Car Wash", 10, 10);
    if (filterDate) doc.text(`Data: ${filterDate}`, 10, 16);

    filteredCars.forEach((car, index) => {
      doc.setFontSize(12);
      doc.text(`Carro ${index + 1}:`, 10, y);
      y += 6;
      doc.text(`Matrícula: ${car.plate}`, 10, y);
      y += 6;
      doc.text(`Telefone: ${car.phone}`, 10, y);
      y += 6;
      doc.text(`Tipo: ${car.type === "large" ? "Carro Grande" : "Carro Pequeno"}`, 10, y);
      y += 6;
      doc.text(`Serviço: ${car.service.replace("_", " + ")}`, 10, y);
      y += 6;
      doc.text(`Preço: ${car.price} MT`, 10, y);
      y += 6;
      doc.text(`Data: ${car.timestamp}`, 10, y);
      y += 10;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setFontSize(14);
    doc.text(`Total Arrecadado: ${totalAmount} MT`, 10, y);

    doc.save(`relatorio_carwash_${filterDate || "todos"}.pdf`);
  };

  return (
    <div className="app">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Divine Car Wash
      </motion.h1>

      <div className="card">
        <input placeholder="Matrícula do carro" value={plate} onChange={(e) => setPlate(e.target.value)} />
        <input placeholder="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="small">Carro Pequeno</option>
          <option value="large">Carro Grande</option>
        </select>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="outside">Lavar Apenas Fora</option>
          <option value="inside">Lavar Apenas Dentro</option>
          <option value="inside_outside">Lavar Dentro e Fora</option>
        </select>
        <button onClick={addCar}>Adicionar Carro</button>
      </div>

      <div className="filter card">
        <label>Filtrar por data:</label>
        <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
        <button onClick={() => setFilterDate("")}>Limpar Filtro</button>
      </div>

      <div className="summary card">
        <div>Total Arrecadado: {totalAmount} MT</div>
        <div>Carros lavados: {filteredCars.length}</div>
        <button onClick={exportAllInvoices}><FileDown /> Exportar Faturas</button>
      </div>

      <div className="list">
        {filteredCars.map((car) => (
          <motion.div key={car.id} className="item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="left">
              {car.type === "large" ? <Truck /> : <Car />}
              <div className="meta">
                <div className="plate">{car.plate}</div>
                <div className="phone">{car.phone}</div>
                <div className="small">Serviço: {car.service.replace("_", " + ")} | Preço: {car.price} MT</div>
                <div className="tiny">Data: {car.timestamp}</div>
              </div>
            </div>
            <div className="actions">
              <button onClick={() => printInvoice(car)} title="Imprimir"><Printer /></button>
              <button onClick={() => removeCar(car.id)} title="Remover"><Trash2 /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
