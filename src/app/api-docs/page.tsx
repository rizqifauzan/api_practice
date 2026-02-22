'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { apiEndpoints, apiCategories, ApiEndpoint } from '@/lib/api-docs-data';
import { Download, ExternalLink, BookOpen, CheckCircle, Code, Zap, Shield } from 'lucide-react';

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [tryItOpen, setTryItOpen] = useState(false);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bearerToken, setBearerToken] = useState('');

  const handleTryIt = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    setResponse('');

    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}${selectedEndpoint.path.replace('[id]', 'uuid-example')}`;
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Tambahkan Bearer token jika diisi
      if (bearerToken.trim()) {
        headers['Authorization'] = `Bearer ${bearerToken.trim()}`;
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers,
      };

      if (selectedEndpoint.method !== 'GET' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(url, options);
      const data = await res.text();
      setResponse(data);
    } catch (error) {
      setResponse(JSON.stringify({ error: 'Terjadi kesalahan saat mencoba request' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-500 text-white';
      case 'POST':
        return 'bg-blue-500 text-white';
      case 'PUT':
        return 'bg-yellow-500 text-white';
      case 'DELETE':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
      <nav id="api-docs-navbar" className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link id="api-docs-home-link" href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">API Practice</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link id="api-docs-back-btn" href="/">
                <Button id="api-docs-back-button" variant="ghost" className="text-gray-600 dark:text-gray-300">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div id="api-docs-main" className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div id="api-docs-header" className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div id="api-docs-header-icon" className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 id="api-docs-title" className="text-3xl font-bold text-gray-900 dark:text-white">
                API Documentation
              </h1>
              <p id="api-docs-subtitle" className="text-gray-600 dark:text-gray-300">
                Dokumentasi lengkap untuk API Siswa Management
              </p>
            </div>
          </div>
        </div>

        <Tabs id="api-docs-tabs" defaultValue="endpoints" className="space-y-6">
          <TabsList id="api-docs-tabs-list" className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger id="api-docs-tab-endpoints" value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger id="api-docs-tab-examples" value="examples">Examples</TabsTrigger>
            <TabsTrigger id="api-docs-tab-postman" value="postman">Postman</TabsTrigger>
          </TabsList>

          <TabsContent id="api-docs-tabcontent-postman" value="postman" className="space-y-6">
            {/* Postman Collection Download Section */}
            <Card id="api-docs-postman-download-card" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent id="api-docs-postman-download-content" className="p-8">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <div id="api-docs-postman-title-wrapper" className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-white/20 rounded-lg">
                        <Download className="w-8 h-8" />
                      </div>
                      <h2 id="api-docs-postman-title" className="text-3xl font-bold">Download Postman Collection</h2>
                    </div>
                    <p className="text-lg mb-6 text-blue-50 leading-relaxed">
                      Download Postman collection untuk mencoba API automation test.
                      Collection ini berisi semua endpoint API yang tersedia dengan
                      contoh request dan response yang lengkap.
                    </p>
                    <div id="api-docs-postman-features" className="mb-6">
                      <p id="api-docs-postman-features-title" className="text-base font-semibold mb-3 text-blue-100">
                        Fitur Collection:
                      </p>
                      <div id="api-docs-postman-features-grid" className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Semua endpoint API (Auth & Siswa)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Auto-save token setelah login</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Pagination, search, filter, sorting</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Error handling dan validation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Collection variables</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Automation test ready</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="api-docs-postman-download-actions" className="flex flex-col gap-3 min-w-[200px]">
                    <Button
                      id="api-docs-download-btn"
                      asChild
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                    >
                      <a
                        href="/postman-collection.json"
                        download="api-siswa-management-collection.json"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Collection
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Features */}
            <div id="api-docs-features" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card id="api-docs-feature-auth" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 id="api-docs-feature-auth-title" className="text-xl font-bold">Authentication</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• JWT-based authentication</li>
                  <li>• Register & Login endpoints</li>
                  <li>• Token management</li>
                  <li>• Protected routes</li>
                </ul>
              </Card>
              <Card id="api-docs-feature-crud" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 id="api-docs-feature-crud-title" className="text-xl font-bold">CRUD Operations</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Create, Read, Update, Delete</li>
                  <li>• Bulk operations</li>
                  <li>• Validation & error handling</li>
                  <li>• Data integrity</li>
                </ul>
              </Card>
              <Card id="api-docs-feature-advanced" className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Code className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 id="api-docs-feature-advanced-title" className="text-xl font-bold">Advanced Features</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pagination</li>
                  <li>• Search & filter</li>
                  <li>• Sorting</li>
                  <li>• Response caching</li>
                </ul>
              </Card>
            </div>

            {/* Tutorial Section */}
            <Card id="api-docs-tutorial-card">
              <CardContent id="api-docs-tutorial-content" className="p-6">
                <h3 id="api-docs-tutorial-title" className="text-2xl font-bold mb-6 flex items-center">
                  <BookOpen className="w-6 h-6 mr-3" />
                  Cara Menggunakan Postman Collection
                </h3>
                <div id="api-docs-tutorial-steps" className="space-y-6">
                  <div id="api-docs-tutorial-step-1" className="flex gap-4">
                    <div id="api-docs-tutorial-step-1-number" className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      1
                    </div>
                    <div>
                      <h4 id="api-docs-tutorial-step-1-title" className="font-semibold text-lg mb-2">Download dan Import Collection</h4>
                      <p id="api-docs-tutorial-step-1-desc" className="text-gray-600">
                        Download Postman collection dan import ke Postman Desktop atau Web.
                        Buka Postman, klik Import, dan pilih file JSON yang sudah didownload.
                      </p>
                    </div>
                  </div>
                  <div id="api-docs-tutorial-step-2" className="flex gap-4">
                    <div id="api-docs-tutorial-step-2-number" className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      2
                    </div>
                    <div>
                      <h4 id="api-docs-tutorial-step-2-title" className="font-semibold text-lg mb-2">Setup Environment Variables</h4>
                      <p id="api-docs-tutorial-step-2-desc" className="text-gray-600">
                        Buat environment baru dengan variables: baseUrl (https://api.rizqifauzan.com),
                        token (kosong), userId (kosong). Token akan diisi otomatis setelah login.
                      </p>
                    </div>
                  </div>
                  <div id="api-docs-tutorial-step-3" className="flex gap-4">
                    <div id="api-docs-tutorial-step-3-number" className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      3
                    </div>
                    <div>
                      <h4 id="api-docs-tutorial-step-3-title" className="font-semibold text-lg mb-2">Jalankan Request Login</h4>
                      <p id="api-docs-tutorial-step-3-desc" className="text-gray-600">
                        Jalankan request login dengan email dan password yang valid.
                        Token akan disimpan otomatis ke collection variables.
                      </p>
                    </div>
                  </div>
                  <div id="api-docs-tutorial-step-4" className="flex gap-4">
                    <div id="api-docs-tutorial-step-4-number" className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      4
                    </div>
                    <div>
                      <h4 id="api-docs-tutorial-step-4-title" className="font-semibold text-lg mb-2">Coba Endpoint Lainnya</h4>
                      <p id="api-docs-tutorial-step-4-desc" className="text-gray-600">
                        Setelah login, coba endpoint lain seperti Get All Siswa, Create Siswa,
                        Update Siswa, dan Delete Siswa. Semua endpoint menggunakan token yang sudah disimpan.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tutorial Links */}
            <Card id="api-docs-tutorial-links-card">
              <CardContent id="api-docs-tutorial-links-content" className="p-6">
                <h3 id="api-docs-tutorial-links-title" className="text-2xl font-bold mb-6">Tutorial Lengkap</h3>
                <div id="api-docs-tutorial-links-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    id="api-docs-tutorial-link-download"
                    href="/docs/tutorial-download-postman"
                    className="block p-6 border rounded-lg hover:bg-gray-50 transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Download className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-blue-600 mb-2">
                          Tutorial Download dan Import Postman Collection
                        </h4>
                        <p className="text-sm text-gray-600">
                          Panduan lengkap cara download dan import Postman collection.
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    id="api-docs-tutorial-link-automation"
                    href="/docs/tutorial-automation-test-api"
                    className="block p-6 border rounded-lg hover:bg-gray-50 transition hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Zap className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg text-blue-600 mb-2">
                          Tutorial Automation Test API dengan Postman
                        </h4>
                        <p className="text-sm text-gray-600">
                          Panduan lengkap cara membuat automation test dengan Postman.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* API Endpoints Summary */}
            <Card id="api-docs-endpoints-summary-card">
              <CardContent id="api-docs-endpoints-summary-content" className="p-6">
                <h3 id="api-docs-endpoints-summary-title" className="text-2xl font-bold mb-6">API Endpoints</h3>
                <div id="api-docs-endpoints-summary" className="space-y-4">
                  <div id="api-docs-endpoints-auth-section">
                    <h4 id="api-docs-endpoints-auth-title" className="font-semibold text-lg mb-3">Authentication</h4>
                    <div id="api-docs-endpoints-auth-table-wrapper" className="bg-gray-50 rounded-lg p-4">
                      <table id="api-docs-endpoints-auth-table" className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Method</th>
                            <th className="text-left py-2">Endpoint</th>
                            <th className="text-left py-2">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">POST</span></td>
                            <td className="py-2 font-mono text-xs">/api/auth/register</td>
                            <td className="py-2">Register user baru</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">POST</span></td>
                            <td className="py-2 font-mono text-xs">/api/auth/login</td>
                            <td className="py-2">Login user</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">GET</span></td>
                            <td className="py-2 font-mono text-xs">/api/auth/me</td>
                            <td className="py-2">Get current user</td>
                          </tr>
                          <tr>
                            <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">POST</span></td>
                            <td className="py-2 font-mono text-xs">/api/auth/logout</td>
                            <td className="py-2">Logout user</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div id="api-docs-endpoints-siswa-section">
                    <h4 id="api-docs-endpoints-siswa-title" className="font-semibold text-lg mb-3">Siswa Management</h4>
                    <div id="api-docs-endpoints-siswa-table-wrapper" className="bg-gray-50 rounded-lg p-4">
                      <table id="api-docs-endpoints-siswa-table" className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Method</th>
                            <th className="text-left py-2">Endpoint</th>
                            <th className="text-left py-2">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">GET</span></td>
                            <td className="py-2 font-mono text-xs">/api/siswa</td>
                            <td className="py-2">Get all siswa</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">POST</span></td>
                            <td className="py-2 font-mono text-xs">/api/siswa</td>
                            <td className="py-2">Create siswa baru</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">GET</span></td>
                            <td className="py-2 font-mono text-xs">/api/siswa/[id]</td>
                            <td className="py-2">Get siswa by ID</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">PUT</span></td>
                            <td className="py-2 font-mono text-xs">/api/siswa/[id]</td>
                            <td className="py-2">Update siswa</td>
                          </tr>
                          <tr>
                            <td className="py-2"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">DELETE</span></td>
                            <td className="py-2 font-mono text-xs">/api/siswa/[id]</td>
                            <td className="py-2">Delete siswa</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent id="api-docs-tabcontent-endpoints" value="endpoints" className="space-y-6">
            {/* Categories */}
            {apiCategories.map((category) => (
              <Card id={`api-docs-category-${category.id}`} key={category.id} className="border-2 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div id={`api-docs-category-icon-${category.id}`} className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      <CardDescription>
                        {category.endpoints.length} endpoint{category.endpoints.length > 1 ? 's' : ''} tersedia
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion id={`api-docs-accordion-${category.id}`} type="single" collapsible className="w-full">
                    {category.endpoints.map((endpointId) => {
                      const endpoint = apiEndpoints.find((e) => e.id === endpointId);
                      if (!endpoint) return null;

                      return (
                        <AccordionItem id={`api-docs-accordion-item-${endpoint.id}`} key={endpoint.id} value={endpoint.id}>
                          <AccordionTrigger id={`api-docs-accordion-trigger-${endpoint.id}`} className="hover:no-underline">
                            <div className="flex items-center gap-3 w-full">
                              <Badge className={`${getMethodColor(endpoint.method)} font-semibold`}>
                                {endpoint.method}
                              </Badge>
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                                {endpoint.path}
                              </code>
                              <span className="flex-1 text-left font-medium">
                                {endpoint.title}
                              </span>
                              {endpoint.requiresAuth && (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-600 dark:text-yellow-400">
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                  Auth Required
                                </Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent id={`api-docs-accordion-content-${endpoint.id}`} className="space-y-4 pt-4">
                            <div id={`api-docs-endpoint-description-${endpoint.id}`}>
                              <h4 id={`api-docs-endpoint-description-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Deskripsi
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {endpoint.description}
                              </p>
                            </div>

                            {endpoint.request && (
                              <>
                                {endpoint.request.headers && (
                                  <div id={`api-docs-endpoint-headers-${endpoint.id}`}>
                                    <h4 id={`api-docs-endpoint-headers-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                      Headers
                                    </h4>
                                    <div id={`api-docs-endpoint-headers-code-${endpoint.id}`} className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                                      <pre className="text-sm overflow-x-auto font-mono">
                                        {JSON.stringify(endpoint.request.headers, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                {endpoint.request.params && (
                                  <div id={`api-docs-endpoint-params-${endpoint.id}`}>
                                    <h4 id={`api-docs-endpoint-params-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                      Path Parameters
                                    </h4>
                                    <div id={`api-docs-endpoint-params-table-wrapper-${endpoint.id}`} className="rounded-md border overflow-hidden">
                                      <table id={`api-docs-endpoint-params-table-${endpoint.id}`} className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b bg-gray-100 dark:bg-gray-800">
                                            <th className="p-2 text-left font-semibold">Nama</th>
                                            <th className="p-2 text-left font-semibold">Tipe</th>
                                            <th className="p-2 text-left font-semibold">Deskripsi</th>
                                            <th className="p-2 text-left font-semibold">Required</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Object.entries(endpoint.request.params).map(([name, info]) => (
                                            <tr key={name} className="border-b">
                                              <td className="p-2 font-mono">{name}</td>
                                              <td className="p-2">
                                                <Badge variant="secondary">{info.type}</Badge>
                                              </td>
                                              <td className="p-2">{info.description}</td>
                                              <td className="p-2">
                                                {info.required ? (
                                                  <span className="text-green-600 dark:text-green-400">Ya</span>
                                                ) : (
                                                  <span className="text-gray-500">Tidak</span>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {endpoint.request.body && (
                                  <div id={`api-docs-endpoint-body-${endpoint.id}`}>
                                    <h4 id={`api-docs-endpoint-body-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                      </svg>
                                      Request Body
                                    </h4>
                                    <div id={`api-docs-endpoint-body-table-wrapper-${endpoint.id}`} className="rounded-md border overflow-hidden">
                                      <table id={`api-docs-endpoint-body-table-${endpoint.id}`} className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b bg-gray-100 dark:bg-gray-800">
                                            <th className="p-2 text-left font-semibold">Nama</th>
                                            <th className="p-2 text-left font-semibold">Tipe</th>
                                            <th className="p-2 text-left font-semibold">Deskripsi</th>
                                            <th className="p-2 text-left font-semibold">Required</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Object.entries(endpoint.request.body).map(([name, info]) => (
                                            <tr key={name} className="border-b">
                                              <td className="p-2 font-mono">{name}</td>
                                              <td className="p-2">
                                                <Badge variant="secondary">{info.type}</Badge>
                                              </td>
                                              <td className="p-2">{info.description}</td>
                                              <td className="p-2">
                                                {info.required ? (
                                                  <span className="text-green-600 dark:text-green-400">Ya</span>
                                                ) : (
                                                  <span className="text-gray-500">Tidak</span>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {endpoint.request.query && (
                                  <div id={`api-docs-endpoint-query-${endpoint.id}`}>
                                    <h4 id={`api-docs-endpoint-query-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      Query Parameters
                                    </h4>
                                    <div id={`api-docs-endpoint-query-table-wrapper-${endpoint.id}`} className="rounded-md border overflow-hidden">
                                      <table id={`api-docs-endpoint-query-table-${endpoint.id}`} className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b bg-gray-100 dark:bg-gray-800">
                                            <th className="p-2 text-left font-semibold">Nama</th>
                                            <th className="p-2 text-left font-semibold">Tipe</th>
                                            <th className="p-2 text-left font-semibold">Deskripsi</th>
                                            <th className="p-2 text-left font-semibold">Required</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {Object.entries(endpoint.request.query).map(([name, info]) => (
                                            <tr key={name} className="border-b">
                                              <td className="p-2 font-mono">{name}</td>
                                              <td className="p-2">
                                                <Badge variant="secondary">{info.type}</Badge>
                                              </td>
                                              <td className="p-2">{info.description}</td>
                                              <td className="p-2">
                                                {info.required ? (
                                                  <span className="text-green-600 dark:text-green-400">Ya</span>
                                                ) : (
                                                  <span className="text-gray-500">Tidak</span>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            <div id={`api-docs-endpoint-response-${endpoint.id}`}>
                              <h4 id={`api-docs-endpoint-response-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Response
                              </h4>
                              <div id={`api-docs-endpoint-response-table-wrapper-${endpoint.id}`} className="rounded-md border overflow-hidden">
                                <table id={`api-docs-endpoint-response-table-${endpoint.id}`} className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b bg-gray-100 dark:bg-gray-800">
                                      <th className="p-2 text-left font-semibold">Nama</th>
                                      <th className="p-2 text-left font-semibold">Tipe</th>
                                      <th className="p-2 text-left font-semibold">Deskripsi</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(endpoint.response.success).map(([name, info]) => (
                                      <tr key={name} className="border-b">
                                        <td className="p-2 font-mono">{name}</td>
                                        <td className="p-2">
                                          <Badge variant="secondary">{info.type}</Badge>
                                        </td>
                                        <td className="p-2">{info.description}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div id={`api-docs-endpoint-actions-${endpoint.id}`} className="flex gap-2 pt-2">
                              <Button
                                id={`api-docs-try-it-btn-${endpoint.id}`}
                                onClick={() => {
                                  setSelectedEndpoint(endpoint);
                                  setTryItOpen(true);
                                  const body = endpoint.request?.body
                                    ? JSON.stringify(
                                        Object.fromEntries(
                                          Object.entries(endpoint.request.body).map(([k]) => [k, ''])
                                        ),
                                        null,
                                        2
                                      )
                                    : '';
                                  setRequestBody(body);
                                  setResponse('');
                                }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Try It
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent id="api-docs-tabcontent-examples" value="examples" className="space-y-6">
            {apiEndpoints.map((endpoint) => (
              <Card id={`api-docs-example-card-${endpoint.id}`} key={endpoint.id} className="border-2 shadow-lg">
                <CardHeader>
                  <div id={`api-docs-example-header-${endpoint.id}`} className="flex items-center gap-3">
                    <Badge className={`${getMethodColor(endpoint.method)} font-semibold`}>
                      {endpoint.method}
                    </Badge>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                      {endpoint.path}
                    </code>
                    <CardTitle className="ml-2">{endpoint.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent id={`api-docs-example-content-${endpoint.id}`} className="space-y-4">
                  <div id={`api-docs-example-curl-${endpoint.id}`}>
                    <h4 id={`api-docs-example-curl-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      cURL
                    </h4>
                    <div id={`api-docs-example-curl-code-${endpoint.id}`} className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                        {endpoint.examples.request.curl}
                      </pre>
                    </div>
                  </div>
                  <div id={`api-docs-example-js-${endpoint.id}`}>
                    <h4 id={`api-docs-example-js-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      JavaScript (Fetch)
                    </h4>
                    <div id={`api-docs-example-js-code-${endpoint.id}`} className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto font-mono">
                        {endpoint.examples.request.javascript}
                      </pre>
                    </div>
                  </div>
                  {endpoint.examples.request.java && (
                    <div id={`api-docs-example-java-${endpoint.id}`}>
                      <h4 id={`api-docs-example-java-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Java (Rest-Assured)
                      </h4>
                      <div id={`api-docs-example-java-code-${endpoint.id}`} className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                        <pre className="text-sm overflow-x-auto font-mono">
                          {endpoint.examples.request.java}
                        </pre>
                      </div>
                    </div>
                  )}
                  <div id={`api-docs-example-success-${endpoint.id}`}>
                    <h4 id={`api-docs-example-success-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Success Response
                    </h4>
                    <div id={`api-docs-example-success-code-${endpoint.id}`} className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto font-mono">
                        {endpoint.examples.response.success}
                      </pre>
                    </div>
                  </div>
                  {endpoint.examples.response.error && (
                    <div id={`api-docs-example-error-${endpoint.id}`}>
                      <h4 id={`api-docs-example-error-title-${endpoint.id}`} className="font-semibold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Error Response
                      </h4>
                      <div id={`api-docs-example-error-code-${endpoint.id}`} className="bg-red-50 dark:bg-red-900/20 rounded-md p-3">
                        <pre className="text-sm overflow-x-auto font-mono">
                          {endpoint.examples.response.error}
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Try It Dialog */}
        {selectedEndpoint && (
          <div id="api-docs-try-it-overlay" className={`fixed inset-0 z-50 flex items-center justify-center ${tryItOpen ? 'bg-black/50 backdrop-blur-sm' : 'hidden'}`}>
            <div id="api-docs-try-it-dialog" className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2">
              <div id="api-docs-try-it-content" className="p-6">
                <div id="api-docs-try-it-header" className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div id="api-docs-try-it-icon" className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 id="api-docs-try-it-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                      Try It: {selectedEndpoint.title}
                    </h2>
                  </div>
                  <Button id="api-docs-try-it-close-btn" variant="outline" onClick={() => setTryItOpen(false)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>

                {/* Bearer Token Input - Hanya muncul untuk endpoint yang membutuhkan auth */}
                {selectedEndpoint.requiresAuth && (
                  <div id="api-docs-try-it-token-section" className="mb-4">
                    <label id="api-docs-try-it-token-label" htmlFor="api-docs-try-it-token-input" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Bearer Token <span className="text-red-500">*</span>
                    </label>
                    <div id="api-docs-try-it-token-wrapper" className="relative">
                      <input
                        id="api-docs-try-it-token-input"
                        name="bearerToken"
                        type="text"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        value={bearerToken}
                        onChange={(e) => setBearerToken(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      />
                      {bearerToken && (
                        <button
                          id="api-docs-try-it-token-clear-btn"
                          type="button"
                          onClick={() => setBearerToken('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {!bearerToken && (
                      <p id="api-docs-try-it-token-error" className="text-xs text-red-500 mt-1">
                        ⚠️ Endpoint ini memerlukan Bearer token untuk authentication
                      </p>
                    )}
                  </div>
                )}

                {selectedEndpoint.request?.body && (
                  <div id="api-docs-try-it-body-section" className="mb-4">
                    <label id="api-docs-try-it-body-label" htmlFor="api-docs-try-it-body-textarea" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Request Body (JSON)
                    </label>
                    <textarea
                      id="api-docs-try-it-body-textarea"
                      name="requestBody"
                      className="w-full h-48 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder='{"key": "value"}'
                    />
                  </div>
                )}

                <Button
                  id="api-docs-try-it-submit-btn"
                  onClick={handleTryIt}
                  disabled={isLoading}
                  className="w-full mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send {selectedEndpoint.method} Request
                    </span>
                  )}
                </Button>

                {response && (
                  <div id="api-docs-try-it-response-section">
                    <h3 id="api-docs-try-it-response-title" className="font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                      <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Response
                    </h3>
                    <div id="api-docs-try-it-response-code" className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                        {response}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
