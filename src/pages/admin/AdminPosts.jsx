import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { formatDate } from '../../lib/utils';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/admin/posts');
      setPosts(response.data.posts);
    } catch (error) {
      // Mock data for demo
      setPosts([
        {
          id: 1,
          content: 'Just launched my new product line! Check it out in my store.',
          author: { name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=1' },
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          likes: 234,
          comments: 45,
          status: 'active',
          reported: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          content: 'Amazing weekend sale happening now! 50% off everything.',
          author: { name: 'Mike Chen', avatar: 'https://i.pravatar.cc/150?img=2' },
          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
          likes: 189,
          comments: 23,
          status: 'active',
          reported: true,
          reportReason: 'Spam content',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          content: 'New arrivals in stock! Limited edition items available.',
          author: { name: 'Emily Davis', avatar: 'https://i.pravatar.cc/150?img=3' },
          image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
          likes: 156,
          comments: 34,
          status: 'hidden',
          reported: true,
          reportReason: 'Inappropriate content',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 4,
          content: 'Behind the scenes of our latest photoshoot!',
          author: { name: 'Alex Rivera', avatar: 'https://i.pravatar.cc/150?img=4' },
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          likes: 312,
          comments: 67,
          status: 'active',
          reported: false,
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updatePostStatus = async (postId, newStatus) => {
    try {
      await api.patch(`/admin/posts/${postId}`, { status: newStatus });
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, status: newStatus, reported: false } : post
      ));
    } catch (error) {
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, status: newStatus, reported: false } : post
      ));
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/admin/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      setPosts(posts.filter(post => post.id !== postId));
    }
  };

  const getStatusBadge = (status, reported) => {
    if (reported) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Reported</span>;
    }
    if (status === 'hidden') {
      return <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">Hidden</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">Active</span>;
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === 'all') return matchesSearch;
    if (filter === 'reported') return matchesSearch && post.reported;
    if (filter === 'hidden') return matchesSearch && post.status === 'hidden';
    if (filter === 'active') return matchesSearch && post.status === 'active' && !post.reported;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Posts Management</h1>
        <p className="text-muted-foreground mt-1">
          {posts.filter(p => p.reported).length} reported posts need review
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'reported', 'active', 'hidden'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-2 bg-card border border-border rounded-xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-muted-foreground">No posts found</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-xl overflow-hidden">
              {post.image && (
                <img
                  src={post.image}
                  alt=""
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                  {getStatusBadge(post.status, post.reported)}
                </div>

                <p className="text-foreground mb-3 line-clamp-2">{post.content}</p>

                {post.reported && post.reportReason && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Report reason:</span> {post.reportReason}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments}
                  </span>
                </div>

                <div className="flex gap-2">
                  {post.status === 'hidden' ? (
                    <button
                      onClick={() => updatePostStatus(post.id, 'active')}
                      className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => updatePostStatus(post.id, 'hidden')}
                      className="flex-1 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    onClick={() => deletePost(post.id)}
                    className="px-3 py-2 text-destructive hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
