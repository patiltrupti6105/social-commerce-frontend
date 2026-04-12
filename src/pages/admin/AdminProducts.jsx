import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatPrice } from '../../lib/utils';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/admin/products');
      setProducts(response.data.products);
    } catch (error) {
      // Mock data for demo
      setProducts([
        { id: 1, name: 'Premium Wireless Headphones', seller: 'Tech Store', price: 129.99, status: 'active', featured: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
        { id: 2, name: 'Mechanical Gaming Keyboard', seller: 'Gaming Hub', price: 89.99, status: 'pending', featured: false, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=100' },
        { id: 3, name: 'Ergonomic Office Mouse', seller: 'Office Plus', price: 49.99, status: 'active', featured: false, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100' },
        { id: 4, name: 'USB-C Hub Adapter', seller: 'Tech Store', price: 39.99, status: 'rejected', featured: false, image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=100' },
        { id: 5, name: 'Laptop Stand Aluminum', seller: 'Home Office Co', price: 59.99, status: 'active', featured: true, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, newStatus) => {
    try {
      await api.patch(`/admin/products/${productId}`, { status: newStatus });
      setProducts(products.map(product => 
        product.id === productId ? { ...product, status: newStatus } : product
      ));
    } catch (error) {
      setProducts(products.map(product => 
        product.id === productId ? { ...product, status: newStatus } : product
      ));
    }
  };

  const toggleFeatured = async (productId) => {
    const product = products.find(p => p.id === productId);
    const newFeatured = !product.featured;
    
    try {
      await api.patch(`/admin/products/${productId}`, { featured: newFeatured });
      setProducts(products.map(p => 
        p.id === productId ? { ...p, featured: newFeatured } : p
      ));
    } catch (error) {
      setProducts(products.map(p => 
        p.id === productId ? { ...p, featured: newFeatured } : p
      ));
    }
  };

  const deleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/admin/products/${productId}`);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 text-xs rounded-full capitalize ${colors[status]}`}>{status}</span>;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
        <p className="text-muted-foreground mt-1">{products.length} total products</p>
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Product</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Seller</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Featured</th>
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
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-muted"
                        />
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{product.seller}</td>
                    <td className="px-6 py-4 text-foreground">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-1 rounded transition-colors ${product.featured ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500'}`}
                      >
                        <svg className="w-5 h-5" fill={product.featured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {product.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateProductStatus(product.id, 'active')}
                              className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => updateProductStatus(product.id, 'rejected')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                        <Link
                          to={`/products/${product.id}`}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          title="View"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          title="Delete"
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
