'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Siswa } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    kelas: '',
    jurusan: '',
    sortBy: 'created_at',
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    siswa: Siswa | null;
  }>({ open: false, siswa: null });

  // Get token from cookie
  const getToken = () => {
    const match = document.cookie.match(/(^|;)\s*token=([^;]+)/);
    return match ? match[2] : null;
  };

  const fetchSiswa = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        router.push('/login');
        return;
      }

      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.kelas && { kelas: filters.kelas }),
        ...(filters.jurusan && { jurusan: filters.jurusan }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`/api/siswa?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 401) {
        router.push('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSiswaList(data.data.data);
        setPagination(data.data.pagination);
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Gagal mengambil data siswa',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.siswa) return;

    try {
      const token = getToken();
      const response = await fetch(`/api/siswa/${deleteDialog.siswa.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Berhasil',
          description: 'Siswa berhasil dihapus',
        });
        setDeleteDialog({ open: false, siswa: null });
        fetchSiswa();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Gagal menghapus siswa',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan server',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  useEffect(() => {
    fetchSiswa();
  }, [pagination.page, filters.sortBy, filters.sortOrder]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pagination.page === 1) {
        fetchSiswa();
      } else {
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search, filters.kelas, filters.jurusan]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav id="dashboard-navbar" className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link id="dashboard-home-link" href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">API Practice</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link id="dashboard-api-docs-btn" href="/api-docs">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
                  API Docs
                </Button>
              </Link>
              <Button id="dashboard-logout-btn" variant="outline" onClick={handleLogout} className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div id="dashboard-main" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div id="dashboard-header" className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 id="dashboard-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p id="dashboard-subtitle" className="text-gray-600 dark:text-gray-300">
                Kelola data siswa dengan mudah dan efisien
              </p>
            </div>
            <Link id="dashboard-add-siswa-btn" href="/dashboard/tambah">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Siswa
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div id="dashboard-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card id="stat-total-card" className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle id="stat-total-title" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Siswa
              </CardTitle>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div id="stat-total-value" className="text-3xl font-bold text-gray-900 dark:text-white">
                {pagination.total}
              </div>
              <p id="stat-total-desc" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Siswa terdaftar
              </p>
            </CardContent>
          </Card>

          <Card id="stat-page-card" className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle id="stat-page-title" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Halaman Aktif
              </CardTitle>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div id="stat-page-value" className="text-3xl font-bold text-gray-900 dark:text-white">
                {pagination.page}
              </div>
              <p id="stat-page-desc" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Dari {pagination.totalPages} halaman
              </p>
            </CardContent>
          </Card>

          <Card id="stat-perpage-card" className="border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle id="stat-perpage-title" className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Data per Halaman
              </CardTitle>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div id="stat-perpage-value" className="text-3xl font-bold text-gray-900 dark:text-white">
                {siswaList.length}
              </div>
              <p id="stat-perpage-desc" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Menampilkan data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Card */}
        <Card id="dashboard-filters-card" className="mb-6 border-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div>
                <CardTitle id="filter-title">Filter & Pencarian</CardTitle>
                <CardDescription id="filter-description">
                  Cari dan filter data siswa
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label id="search-label" htmlFor="search" className="text-sm font-medium">Cari</Label>
                <div id="search-wrapper" className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <Input
                    id="search"
                    name="search"
                    placeholder="Nama, NIS, atau Email..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label id="kelas-label" htmlFor="kelas" className="text-sm font-medium">Kelas</Label>
                <Input
                  id="kelas"
                  name="kelas"
                  placeholder="X-IPA-1"
                  value={filters.kelas}
                  onChange={(e) => setFilters(prev => ({ ...prev, kelas: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label id="jurusan-label" htmlFor="jurusan" className="text-sm font-medium">Jurusan</Label>
                <Input
                  id="jurusan"
                  name="jurusan"
                  placeholder="IPA"
                  value={filters.jurusan}
                  onChange={(e) => setFilters(prev => ({ ...prev, jurusan: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label id="sortBy-label" htmlFor="sortBy" className="text-sm font-medium">Urutkan</Label>
                <select
                  id="sortBy"
                  name="sortBy"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({
                      ...prev,
                      sortBy,
                      sortOrder: sortOrder as 'asc' | 'desc',
                    }));
                  }}
                >
                  <option value="created_at-desc">Terbaru</option>
                  <option value="created_at-asc">Terlama</option>
                  <option value="nama-asc">Nama (A-Z)</option>
                  <option value="nama-desc">Nama (Z-A)</option>
                  <option value="kelas-asc">Kelas (A-Z)</option>
                  <option value="kelas-desc">Kelas (Z-A)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card id="dashboard-table-card" className="border-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle id="table-title">Data Siswa</CardTitle>
              <CardDescription id="table-description">
                Total {pagination.total} siswa
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div id="table-loading" className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                  <p id="table-loading-text" className="mt-4 text-gray-500 dark:text-gray-400">Memuat data...</p>
                </div>
              </div>
            ) : siswaList.length === 0 ? (
              <div id="table-empty" className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 id="table-empty-title" className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Tidak ada data siswa
                </h3>
                <p id="table-empty-desc" className="text-gray-600 dark:text-gray-300 mb-4">
                  Mulai dengan menambahkan siswa baru.
                </p>
                <Link id="table-empty-add-btn" href="/dashboard/tambah">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Siswa
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div id="table-wrapper" className="rounded-md border overflow-x-auto">
                  <Table id="siswa-table">
                    <TableHeader>
                      <TableRow id="table-header-row" className="bg-gray-50 dark:bg-gray-800">
                        <TableHead id="th-nama" className="font-semibold">Nama</TableHead>
                        <TableHead id="th-nis" className="font-semibold">NIS</TableHead>
                        <TableHead id="th-kelas" className="font-semibold">Kelas</TableHead>
                        <TableHead id="th-jurusan" className="font-semibold">Jurusan</TableHead>
                        <TableHead id="th-email" className="font-semibold">Email</TableHead>
                        <TableHead id="th-telepon" className="font-semibold">Telepon</TableHead>
                        <TableHead id="th-aksi" className="text-right font-semibold">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siswaList.map((siswa) => (
                        <TableRow key={siswa.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <TableCell className="font-medium">{siswa.nama}</TableCell>
                          <TableCell>{siswa.nis}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              {siswa.kelas}
                            </Badge>
                          </TableCell>
                          <TableCell>{siswa.jurusan}</TableCell>
                          <TableCell>{siswa.email || '-'}</TableCell>
                          <TableCell>{siswa.telepon || '-'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/dashboard/edit/${siswa.id}`}>
                                <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-700">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteDialog({ open: true, siswa })}
                                className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:border-red-700 text-red-600 dark:text-red-400"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div id="pagination" className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                    <p id="pagination-info" className="text-sm text-gray-600 dark:text-gray-400">
                      Halaman {pagination.page} dari {pagination.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        id="pagination-first-btn"
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                        disabled={pagination.page === 1}
                      >
                        Awal
                      </Button>
                      <Button
                        id="pagination-prev-btn"
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Sebelumnya
                      </Button>
                      <Button
                        id="pagination-next-btn"
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Selanjutnya
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                      <Button
                        id="pagination-last-btn"
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: pagination.totalPages }))}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Akhir
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog id="delete-dialog" open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, siswa: null })}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle id="delete-dialog-title" className="text-xl">Hapus Siswa</DialogTitle>
              <DialogDescription id="delete-dialog-description" className="text-base">
                Apakah Anda yakin ingin menghapus data siswa{' '}
                <strong>{deleteDialog.siswa?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Button
              id="delete-dialog-cancel-btn"
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, siswa: null })}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button id="delete-dialog-confirm-btn" variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
