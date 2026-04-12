import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { formatDate } from '../../lib/utils';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/admin/reports');
      setReports(response.data.reports);
    } catch (error) {
      // Mock data for demo
      setReports([
        {
          id: 1,
          type: 'post',
          reason: 'Inappropriate content',
          description: 'This post contains offensive language and inappropriate images.',
          reportedBy: { name: 'John Doe', email: 'john@example.com' },
          contentId: 123,
          contentPreview: 'Check out this amazing...',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          type: 'product',
          reason: 'Counterfeit product',
          description: 'This product appears to be a fake version of a popular brand.',
          reportedBy: { name: 'Jane Smith', email: 'jane@example.com' },
          contentId: 456,
          contentPreview: 'Premium Designer Bag',
          status: 'reviewing',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          type: 'user',
          reason: 'Spam',
          description: 'This user is sending spam messages to multiple people.',
          reportedBy: { name: 'Bob Wilson', email: 'bob@example.com' },
          contentId: 789,
          contentPreview: 'SpamUser123',
          status: 'resolved',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: 4,
          type: 'comment',
          reason: 'Harassment',
          description: 'Threatening and harassing comments directed at other users.',
          reportedBy: { name: 'Alice Brown', email: 'alice@example.com' },
          contentId: 101,
          contentPreview: 'You better watch out...',
          status: 'pending',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      await api.patch(`/admin/reports/${reportId}`, { status: newStatus });
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
    } catch (error) {
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status: newStatus } : report
      ));
    }
  };

  const getTypeBadge = (type) => {
    const colors = {
      post: 'bg-blue-100 text-blue-800',
      product: 'bg-purple-100 text-purple-800',
      user: 'bg-amber-100 text-amber-800',
      comment: 'bg-pink-100 text-pink-800',
    };
    return <span className={`px-2 py-1 text-xs rounded-full capitalize ${colors[type]}`}>{type}</span>;
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800',
      reviewing: 'bg-blue-100 text-blue-800',
      resolved: 'bg-emerald-100 text-emerald-800',
      dismissed: 'bg-muted text-muted-foreground',
    };
    return <span className={`px-2 py-1 text-xs rounded-full capitalize ${colors[status]}`}>{status}</span>;
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(report => report.status === filter);

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
        <h1 className="text-3xl font-bold text-foreground">Content Reports</h1>
        <p className="text-muted-foreground mt-1">{reports.filter(r => r.status === 'pending').length} pending reports</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'reviewing', 'resolved', 'dismissed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {status}
            {status !== 'all' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-background/20">
                {reports.filter(r => r.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center">
            <svg className="w-12 h-12 mx-auto text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-muted-foreground">No reports found</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeBadge(report.type)}
                    {getStatusBadge(report.status)}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{report.reason}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{report.description}</p>
                  
                  <div className="bg-muted/50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-muted-foreground">Reported Content:</p>
                    <p className="text-foreground font-medium">{report.contentPreview}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>Reported by: {report.reportedBy.name}</span>
                    <span>{formatDate(report.createdAt)}</span>
                  </div>
                </div>

                {report.status !== 'resolved' && report.status !== 'dismissed' && (
                  <div className="flex flex-col gap-2 sm:ml-4">
                    <button
                      onClick={() => updateReportStatus(report.id, 'resolved')}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => updateReportStatus(report.id, 'dismissed')}
                      className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      Dismiss
                    </button>
                    {report.status === 'pending' && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'reviewing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Mark Reviewing
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
