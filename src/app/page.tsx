import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav id="navbar" className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" id="home-logo" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">API Practice</span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link id="features-link" href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Fitur
              </Link>
              <Link id="tech-stack-link" href="#tech-stack" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Teknologi
              </Link>
              <Link id="api-docs-link" href="#api-docs" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Dokumentasi
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link id="login-btn" href="/login">
                <Button variant="ghost" className="text-gray-600 dark:text-gray-300">
                  Masuk
                </Button>
              </Link>
              <Link id="register-btn" href="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Daftar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div id="hero-badge" className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Platform Latihan API Terbaik
              </span>
            </div>
            <h1 id="hero-title" className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Kuasai API Testing
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Dengan Praktik Nyata
              </span>
            </h1>
            <p id="hero-description" className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Platform pembelajaran interaktif untuk melatih kemampuan API testing dengan fokus pada domain Siswa.
              Belajar dengan cara yang menyenangkan dan efektif.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link id="start-now-btn" href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6">
                  Mulai Sekarang
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link id="view-docs-btn" href="/api-docs">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2">
                  Lihat Dokumentasi
                </Button>
              </Link>
            </div>
            <div id="hero-features" className="mt-12 flex items-center justify-center space-x-8 text-gray-500 dark:text-gray-400">
              <div id="hero-feature-free" className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Gratis</span>
              </div>
              <div id="hero-feature-interactive" className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Interaktif</span>
              </div>
              <div id="hero-feature-easy" className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Mudah Dipahami</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-title" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Fitur Unggulan
            </h2>
            <p id="features-description" className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dilengkapi dengan berbagai fitur modern untuk pengalaman belajar yang optimal
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card id="feature-card-1" className="p-6 border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sistem autentikasi lengkap dengan Register, Login, dan Logout yang aman menggunakan JWT.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card id="feature-card-2" className="p-6 border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                CRUD Operations
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kelola data siswa dengan lengkap: Create, Read, Update, dan Delete operations.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card id="feature-card-3" className="p-6 border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Filtering
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pagination, Search, Filter, dan Sorting untuk manajemen data yang efisien.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card id="feature-card-4" className="p-6 border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Input Validation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Validasi input yang kuat menggunakan Zod untuk memastikan data yang valid.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card id="feature-card-5" className="p-6 border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                API Documentation
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dokumentasi API interaktif yang memudahkan pengembang memahami endpoint.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card id="feature-card-6" className="p-6 border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-xl group">
              <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Dark Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dukungan tema gelap untuk kenyamanan mata saat belajar dalam kondisi cahaya rendah.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 id="tech-stack-title" className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Teknologi Modern
            </h2>
            <p id="tech-stack-description" className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dibangun dengan teknologi terkini untuk performa dan pengalaman terbaik
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Tech Stack Items */}
            <div id="tech-item-1" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">⚛️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Next.js</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">React Framework</p>
            </div>
            <div id="tech-item-2" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🗄️</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Supabase</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">PostgreSQL</p>
            </div>
            <div id="tech-item-3" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Tailwind CSS</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Styling</p>
            </div>
            <div id="tech-item-4" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Zod</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Validation</p>
            </div>
            <div id="tech-item-5" className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">JWT</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Authentication</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="cta-title" className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Siap Memulai Perjalanan Belajar?
            </h2>
            <p id="cta-description" className="text-xl text-blue-100 mb-10">
              Bergabunglah dengan ribuan pengembang yang telah meningkatkan kemampuan API testing mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link id="cta-register-btn" href="/register">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Daftar Gratis
                </Button>
              </Link>
              <Link id="cta-learn-btn" href="/api-docs">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                  Pelajari Lebih Lanjut
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-950">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div id="footer-about" className="md:col-span-2">
              <div id="footer-logo" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AP</span>
                </div>
                <span className="text-xl font-bold text-white">API Practice</span>
              </div>
              <p id="footer-description" className="text-gray-400 mb-4 max-w-md">
                Platform pembelajaran interaktif untuk melatih kemampuan API testing dengan fokus pada domain Siswa.
              </p>
            </div>
            <div id="footer-nav">
              <h3 id="footer-nav-title" className="text-white font-semibold mb-4">Navigasi</h3>
              <ul className="space-y-2">
                <li>
                  <Link id="footer-nav-login" href="/login" className="text-gray-400 hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link id="footer-nav-register" href="/register" className="text-gray-400 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link id="footer-nav-dashboard" href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link id="footer-nav-api-docs" href="/api-docs" className="text-gray-400 hover:text-white transition-colors">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div id="footer-features">
              <h3 id="footer-features-title" className="text-white font-semibold mb-4">Fitur</h3>
              <ul className="space-y-2">
                <li>
                  <span id="footer-feature-auth" className="text-gray-400">Authentication</span>
                </li>
                <li>
                  <span id="footer-feature-crud" className="text-gray-400">CRUD Operations</span>
                </li>
                <li>
                  <span id="footer-feature-docs" className="text-gray-400">API Documentation</span>
                </li>
                <li>
                  <span id="footer-feature-dark-mode" className="text-gray-400">Dark Mode</span>
                </li>
              </ul>
            </div>
          </div>
          <div id="footer-copyright" className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} API Practice. Dibuat dengan ❤️ untuk komunitas developer Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
