'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { apiEndpoints, apiCategories, ApiEndpoint } from '@/lib/api-docs-data';

export default function ApiDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [tryItOpen, setTryItOpen] = useState(false);
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTryIt = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    setResponse('');

    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}${selectedEndpoint.path.replace('[id]', 'uuid-example')}`;
      
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">API Practice</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                API Documentation
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Dokumentasi lengkap untuk API Siswa Management
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="endpoints" className="space-y-6">
            {/* Categories */}
            {apiCategories.map((category) => (
              <Card key={category.id} className="border-2 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
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
                  <Accordion type="single" collapsible className="w-full">
                    {category.endpoints.map((endpointId) => {
                      const endpoint = apiEndpoints.find((e) => e.id === endpointId);
                      if (!endpoint) return null;

                      return (
                        <AccordionItem key={endpoint.id} value={endpoint.id}>
                          <AccordionTrigger className="hover:no-underline">
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
                          <AccordionContent className="space-y-4 pt-4">
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
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
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                      Headers
                                    </h4>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                                      <pre className="text-sm overflow-x-auto font-mono">
                                        {JSON.stringify(endpoint.request.headers, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                {endpoint.request.params && (
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                      </svg>
                                      Path Parameters
                                    </h4>
                                    <div className="rounded-md border overflow-hidden">
                                      <table className="w-full text-sm">
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
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                      </svg>
                                      Request Body
                                    </h4>
                                    <div className="rounded-md border overflow-hidden">
                                      <table className="w-full text-sm">
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
                                  <div>
                                    <h4 className="font-semibold mb-2 flex items-center">
                                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      Query Parameters
                                    </h4>
                                    <div className="rounded-md border overflow-hidden">
                                      <table className="w-full text-sm">
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

                            <div>
                              <h4 className="font-semibold mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Response
                              </h4>
                              <div className="rounded-md border overflow-hidden">
                                <table className="w-full text-sm">
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

                            <div className="flex gap-2 pt-2">
                              <Button
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

          <TabsContent value="examples" className="space-y-6">
            {apiEndpoints.map((endpoint) => (
              <Card key={endpoint.id} className="border-2 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getMethodColor(endpoint.method)} font-semibold`}>
                      {endpoint.method}
                    </Badge>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                      {endpoint.path}
                    </code>
                    <CardTitle className="ml-2">{endpoint.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      cURL
                    </h4>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                        {endpoint.examples.request.curl}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      JavaScript (Fetch)
                    </h4>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto font-mono">
                        {endpoint.examples.request.javascript}
                      </pre>
                    </div>
                  </div>
                  {endpoint.examples.request.java && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Java (Rest-Assured)
                      </h4>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
                        <pre className="text-sm overflow-x-auto font-mono">
                          {endpoint.examples.request.java}
                        </pre>
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Success Response
                    </h4>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-3">
                      <pre className="text-sm overflow-x-auto font-mono">
                        {endpoint.examples.response.success}
                      </pre>
                    </div>
                  </div>
                  {endpoint.examples.response.error && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Error Response
                      </h4>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-md p-3">
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
          <div className={`fixed inset-0 z-50 flex items-center justify-center ${tryItOpen ? 'bg-black/50 backdrop-blur-sm' : 'hidden'}`}>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Try It: {selectedEndpoint.title}
                    </h2>
                  </div>
                  <Button variant="outline" onClick={() => setTryItOpen(false)}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>

                {selectedEndpoint.request?.body && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Request Body (JSON)
                    </label>
                    <textarea
                      className="w-full h-48 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder='{"key": "value"}'
                    />
                  </div>
                )}

                <Button
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
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center text-gray-900 dark:text-white">
                      <svg className="w-4 h-4 mr-2 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Response
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-3">
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
