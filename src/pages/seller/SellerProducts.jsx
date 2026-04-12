import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatPrice } from '../../lib/utils';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/seller/products');
      setProducts(response.data.products);
    } catch (error) {
      // Mock data for demo
      setProducts([
        { id: 1, name: 'Premium Wireless Headphones', price: 129.99, stock: 45, status: 'active', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200', sales: 156 },
        { id: 2, name: 'Mechanical Gaming Keyboard', price: 89.99, stock: 32, status: 'active', image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200', sales: 98 },
        { id: 3, name: 'Ergonomic Office Mouse', price: 49.99, stock: 0, status: 'out_of_stock', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200', sales: 234 },
        { id: 4, name: 'USB-C Hub Adapter', price: 39.99, stock: 78, status: 'active', image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=200', sales: 67 },
        { id: 5, name: 'Laptop Stand Aluminum', price: 59.99, stock: 5, status: 'low_stock', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200', sales: 45 },
        { id: 6, name: 'Webcam HD 1080p', price: 79.99, stock: 22, status: 'draft', image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200', sales: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/seller/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      // For demo, just remove from state
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const getStatusBadge = (status, stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Out of Stock</span>;
    }
    if (stock <= 5) {
      return <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">Low Stock</span>;
    }
    if (status === 'draft') {
      return <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">Draft</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">Active</span>;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && product.status === 'active' && product.stock > 0;
    if (filter === 'out_of_stock') return matchesSearch && product.stock === 0;
    if (filter === 'draft') return matchesSearch && product.status === 'draft';
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Products</h1>
          <p className="text-muted-foreground mt-1">{products.length} products</p>
        </div>
        <Link
          to="/seller/products/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Products</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Sales</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-muted"
                        />
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 text-foreground">{product.stock}</td>
                    <td className="px-6 py-4 text-foreground">{product.sales}</td>
                    <td className="px-6 py-4">{getStatusBadge(product.status, product.stock)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/seller/products/${product.id}/edit`}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
