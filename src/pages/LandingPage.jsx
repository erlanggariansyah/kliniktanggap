import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BarChart3, Settings, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">KlinikTanggap</span>
          </div>

          {/* CTA */}
          <Link
            to="/login"
            className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Masuk
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm mb-6">
              <Clock size={16} />
              Sistem Prioritas Pasien
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Prioritaskan Pasien <br />
              <span className="text-red-600">Secara Objektif & Cepat</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 max-w-lg">
              KlinikTanggap membantu klinik menentukan prioritas pasien berdasarkan tingkat urgensi medis menggunakan metode weighted scoring.
            </p>

            <div className="flex gap-4">
              <Link
                to="/login"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-red-700 transition"
              >
                Mulai Sekarang
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* RIGHT (SIMULATION CARD) */}
          <div className="bg-white border rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Antrian Prioritas</h3>
              <span className="text-sm text-red-600 font-medium">High Priority</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Siti Aminah</span>
                  <span className="text-red-600 font-semibold">9.2</span>
                </div>
                <p className="text-gray-600 text-sm">67 tahun • Sesak napas</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between text-sm mb-1">
                  <span>Ahmad Surya</span>
                  <span className="text-yellow-600">7.5</span>
                </div>
                <p className="text-gray-500 text-sm">Sedang</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between text-sm mb-1">
                  <span>Budi Santoso</span>
                  <span className="text-green-600">2.1</span>
                </div>
                <p className="text-gray-500 text-sm">Ringan</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-semibold mb-4">
            Fitur
          </h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">
            Dirancang untuk meningkatkan pelayanan klinik secara objektif
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {[
              { icon: Clock, title: "Priority Queue", desc: "Antrian berdasarkan urgensi" },
              { icon: BarChart3, title: "Scoring Engine", desc: "Perhitungan berbasis data" },
              { icon: Settings, title: "Real-time", desc: "Monitoring langsung" },
              { icon: CheckCircle, title: "Flexible", desc: "Bobot dapat diatur" }
            ].map((item, i) => (
              <div key={i} className="bg-white border rounded-2xl p-6 hover:shadow-md transition">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="text-red-600" size={20} />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* WORKFLOW (UPGRADED) */}
<section className="bg-white border-t py-24">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center mb-16">
      <h2 className="text-3xl font-semibold mb-4">
        Cara Kerja Sistem
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Alur sederhana namun powerful untuk memastikan pasien dengan kondisi kritis mendapatkan prioritas penanganan.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: "Input Pasien",
          desc: "Petugas memasukkan data dasar dan keluhan pasien ke sistem"
        },
        {
          title: "Analisis Kondisi",
          desc: "Sistem mengevaluasi tingkat keparahan berdasarkan parameter medis"
        },
        {
          title: "Perhitungan Skor",
          desc: "Weighted scoring menghitung nilai prioritas secara objektif"
        },
        {
          title: "Prioritas Otomatis",
          desc: "Pasien diurutkan otomatis berdasarkan skor tertinggi"
        }
      ].map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition">
          <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
            {i + 1}
          </div>
          <h3 className="font-semibold mb-2">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>

  </div>
</section>

<section className="bg-red-600 py-20">
  <div className="max-w-4xl mx-auto px-6 text-center text-white">

    <h2 className="text-3xl md:text-4xl font-bold mb-6">
      Siap Meningkatkan Pelayanan Klinik Anda?
    </h2>

    <p className="text-red-100 mb-8 text-lg">
      Gunakan KlinikTanggap untuk memastikan pasien dengan kondisi kritis mendapatkan penanganan lebih cepat dan tepat.
    </p>

    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <Link
        to="/login"
        className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Masuk
      </Link>

      <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition">
        Hubungi Kami
      </button>
    </div>

  </div>
</section>
<footer className="bg-gray-900 text-gray-400">
  <div className="max-w-7xl mx-auto px-6 py-16">

    <div className="grid md:grid-cols-4 gap-10">

      {/* Brand */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white font-semibold">KlinikTanggap</span>
        </div>
        <p className="text-sm">
          KlinikTanggap merupakan sistem antrian klinik yang dibuat untuk mengimplementasikan metode weighted scoring pada antrian pasien klinik.
        </p>
      </div>

      {/* Navigasi */}
      <div>
        <h4 className="text-white font-semibold mb-4">Navigasi</h4>
        <ul className="space-y-2 text-sm">
          <li className="hover:text-white cursor-pointer">Home</li>
          <li className="hover:text-white cursor-pointer">Fitur</li>
          <li className="hover:text-white cursor-pointer">Cara Kerja</li>
          <li className="hover:text-white cursor-pointer">Login</li>
        </ul>
      </div>

      {/* Sistem */}
      <div>
        <h4 className="text-white font-semibold mb-4">Sistem</h4>
        <ul className="space-y-2 text-sm">
          <li>Weighted Scoring</li>
          <li>Real-time Monitoring</li>
        </ul>
      </div>

      {/* Kontak */}
      <div>
        <h4 className="text-white font-semibold mb-4">Kontak</h4>
        <ul className="space-y-2 text-sm">
          <li>Email: info@kliniktanggap.com</li>
          <li>Telp: (021) 123-456</li>
          <li>Jakarta, Indonesia</li>
        </ul>
      </div>

    </div>

    <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm">
      © 2026 KlinikTanggap. All rights reserved.
    </div>

  </div>
</footer>

    </div>
  );
};

export default LandingPage;