import { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: 0, category: '', description: '' });

  useEffect(() => { load(); }, []);
  async function load() {
    const data = await fetchProducts();
    setProducts(data);
  }

  async function handleCreate(e) {
    e.preventDefault();
    await createProduct(form);
    setForm({ name: '', price: 0, category: '', description: '' });
    load();
  }

  async function handleUpdate(e) {
    e.preventDefault();
    await updateProduct(editing._id, form);
    setEditing(null);
    setForm({ name: '', price: 0, category: '', description: '' });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar?')) return;
    await deleteProduct(id);
    load();
  }

  function startEdit(p) {
    setEditing(p);
    setForm({ name: p.name, price: p.price, category: p.category, description: p.description });
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Panel</h2>

      <form onSubmit={editing ? handleUpdate : handleCreate}>
        <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input type="number" placeholder="Precio" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
        <input placeholder="Categoría" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <textarea placeholder="Descripción" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">{editing ? 'Guardar' : 'Crear'}</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: 0, category: '', description: '' }); }}>Cancelar</button>}
      </form>

      <h3>Productos</h3>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p.name} — ${p.price}
            <button onClick={() => startEdit(p)}>Editar</button>
            <button onClick={() => handleDelete(p._id)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}