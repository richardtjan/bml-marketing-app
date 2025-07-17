import React, { useState, useEffect } from 'react'; // FIX: Menghapus 'useCallback' yang tidak terpakai

// --- PENGATURAN ---
const SCRIPT_URL = process.env.REACT_APP_APPS_SCRIPT_URL;
const ADMIN_PHONE_NUMBER = "6282196657271"; // Ganti dengan nomor WA admin

// --- KOMPONEN UTAMA (ROUTER) ---
export default function App() {
  const [page, setPage] = useState('login'); // Halaman default adalah login
  const [user, setUser] = useState(null); // Menyimpan data pengguna yang login

  // Cek apakah ada data user di local storage saat aplikasi dimuat
  useEffect(() => {
    const loggedInUser = localStorage.getItem('bmlUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setPage('selection'); // Langsung ke halaman pilihan jika sudah login
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('bmlUser', JSON.stringify(userData)); // Simpan data user
    setPage('selection');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('bmlUser'); // Hapus data user
    setPage('login');
  };

  // Logika untuk menampilkan halaman yang sesuai
  switch (page) {
    case 'selection':
      return <SelectionPage setPage={setPage} handleLogout={handleLogout} />;
    case 'form':
      return <FormPage user={user} setPage={setPage} handleLogout={handleLogout} />;
    case 'dashboard':
      return <DashboardPage setPage={setPage} handleLogout={handleLogout} />;
    case 'login':
    default:
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
}

// --- HALAMAN-HALAMAN APLIKASI ---

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'login',
          payload: { email, password }
        }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      });

      const result = await response.json();

      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${ADMIN_PHONE_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-lg rounded-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">BML Marketing App</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Alamat Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Kata Sandi</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-blue-300">
            {isLoading ? 'Loading...' : 'Masuk'}
          </button>
        </form>
        <div className="text-center text-sm mt-4">
          <button onClick={() => openWhatsApp('Halo Admin, saya lupa kata sandi saya.')} className="text-blue-600 hover:underline">Lupa Kata Sandi?</button>
          <span className="mx-2">|</span>
          <button onClick={() => openWhatsApp('Halo Admin, saya ingin mendaftar untuk aplikasi marketing.')} className="text-blue-600 hover:underline">Kontak Admin</button>
        </div>
      </div>
    </div>
  );
}

function SelectionPage({ setPage, handleLogout }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8">Pilih Halaman</h1>
      <div className="flex gap-4">
        <button onClick={() => setPage('dashboard')} className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
          Dashboard
        </button>
        <button onClick={() => setPage('form')} className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600">
          Form
        </button>
      </div>
      <button onClick={handleLogout} className="mt-8 text-sm text-gray-600 hover:underline">Keluar</button>
    </div>
  );
}

function FormPage({ user, setPage, handleLogout }) {
  const [step, setStep] = useState(1);
  const [customerData, setCustomerData] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [projectData, setProjectData] = useState({});
  
  const [projects, setProjects] = useState({});
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    fetch(`${SCRIPT_URL}?action=getProjects`)
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, []);

  const handleProjectChange = (projectName) => {
    setProjectData({ ...projectData, proyek: projectName });
    setClusters(projects[projectName] || []);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSave = async () => {
    const finalData = {
      ...customerData,
      ...transactionData,
      ...projectData,
      nama_sales: user.nama_lengkap,
    };

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'addClosing', payload: finalData }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      });
      setStep('success');
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Gagal menyimpan data.");
    }
  };

  const resetForm = () => {
    setCustomerData({});
    setTransactionData({});
    setProjectData({});
    setStep(1);
  };
  
  const renderStep = () => {
    switch(step) {
      case 1:
        return <CustomerForm data={customerData} setData={setCustomerData} nextStep={nextStep} />;
      case 2:
        return <PaymentForm data={transactionData} setData={setTransactionData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <ProjectForm data={projectData} setData={setProjectData} nextStep={nextStep} prevStep={prevStep} projects={projects} clusters={clusters} handleProjectChange={handleProjectChange} />;
      case 4:
        return <RecapPage data={{...customerData, ...transactionData, ...projectData}} handleSave={handleSave} prevStep={prevStep} />;
      case 'success':
        return <SuccessPage resetForm={resetForm} handleLogout={handleLogout} />;
      default:
        return <CustomerForm data={customerData} setData={setCustomerData} nextStep={nextStep} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Form Input Data Closing</h1>
          <button onClick={() => setPage('selection')} className="text-sm text-blue-600 hover:underline">Kembali ke Pilihan</button>
        </div>
        {renderStep()}
      </div>
    </div>
  );
}

function DashboardPage({ setPage, handleLogout }) {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Data dashboard akan ditampilkan di sini.</p>
            <button onClick={() => alert('Fitur Unduh PDF akan dibuat.')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                Unduh PDF
            </button>
            <button onClick={() => setPage('selection')} className="ml-4 text-sm text-blue-600 hover:underline">
                Kembali ke Pilihan
            </button>
             <button onClick={handleLogout} className="ml-4 text-sm text-gray-600 hover:underline">Keluar</button>
        </div>
    );
}


// --- KOMPONEN-KOMPONEN FORM ---

function CustomerForm({ data, setData, nextStep }) {
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      if(!data.nama_customer || !data.telepon_customer || !data.alamat_ktp || !data.pekerjaan) {
          alert("Harap isi semua kolom wajib.");
          return;
      }
      nextStep();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">Data Customer (Sesuai KTP)</h2>
      <input name="nama_customer" value={data.nama_customer || ''} onChange={handleChange} placeholder="Nama Customer" className="w-full p-2 border rounded mb-2" required />
      <input name="telepon_customer" value={data.telepon_customer || ''} onChange={handleChange} placeholder="Nomor Telepon" className="w-full p-2 border rounded mb-2" required />
      <input name="alamat_ktp" value={data.alamat_ktp || ''} onChange={handleChange} placeholder="Alamat Sesuai KTP" className="w-full p-2 border rounded mb-2" required />
      <input name="pekerjaan" value={data.pekerjaan || ''} onChange={handleChange} placeholder="Pekerjaan" className="w-full p-2 border rounded mb-2" required />
      <input name="instansi" value={data.instansi || ''} onChange={handleChange} placeholder="Instansi (Jika Berkenan)" className="w-full p-2 border rounded mb-4" />
      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">Lanjut</button>
    </form>
  );
}

function PaymentForm({ data, setData, nextStep, prevStep }) {
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!data.metode_pembayaran || (data.metode_pembayaran === 'Lainnya' && !data.metode_pembayaran_lainnya) || !data.nominal_transaksi) {
            alert("Harap isi semua kolom.");
            return;
        }
        nextStep();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Data Transaksi - Pembayaran</h2>
            <select name="metode_pembayaran" value={data.metode_pembayaran || ''} onChange={handleChange} className="w-full p-2 border rounded mb-2" required>
                <option value="">Pilih Metode Pembayaran</option>
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
                <option value="Lainnya">Lainnya</option>
            </select>
            {data.metode_pembayaran === 'Lainnya' && (
                <input name="metode_pembayaran_lainnya" value={data.metode_pembayaran_lainnya || ''} onChange={handleChange} placeholder="Sebutkan Metode Lainnya" className="w-full p-2 border rounded mb-2" required />
            )}
            <input name="nominal_transaksi" type="number" value={data.nominal_transaksi || ''} onChange={handleChange} placeholder="Nominal Transaksi" className="w-full p-2 border rounded mb-4" required />
            <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="p-2 bg-gray-300 rounded">Kembali</button>
                <button type="submit" className="p-2 bg-blue-600 text-white rounded">Lanjut</button>
            </div>
        </form>
    );
}

function ProjectForm({ data, setData, nextStep, prevStep, projects, clusters, handleProjectChange }) {
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!data.proyek || !data.cluster || !data.lb || !data.lt) {
            alert("Harap isi semua kolom.");
            return;
        }
        nextStep();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Data Transaksi - Proyek</h2>
            <div className="mb-2">
                <p className="font-medium mb-1">Proyek</p>
                {Object.keys(projects).map(proj => (
                    <label key={proj} className="flex items-center">
                        <input type="radio" name="proyek" value={proj} checked={data.proyek === proj} onChange={(e) => handleProjectChange(e.target.value)} />
                        <span className="ml-2">{proj}</span>
                    </label>
                ))}
            </div>
            <select name="cluster" value={data.cluster || ''} onChange={handleChange} className="w-full p-2 border rounded mb-2" required disabled={!data.proyek}>
                <option value="">Pilih Cluster</option>
                {clusters.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input name="lb" type="number" value={data.lb || ''} onChange={handleChange} placeholder="Luas Bangunan (LB)" className="w-full p-2 border rounded mb-2" required />
            <input name="lt" type="number" value={data.lt || ''} onChange={handleChange} placeholder="Luas Tanah (LT)" className="w-full p-2 border rounded mb-4" required />
            <div className="flex justify-between">
                <button type="button" onClick={prevStep} className="p-2 bg-gray-300 rounded">Kembali</button>
                <button type="submit" className="p-2 bg-blue-600 text-white rounded">Lanjut</button>
            </div>
        </form>
    );
}

function RecapPage({ data, handleSave, prevStep }) {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Rekap Data</h2>
            <div className="space-y-2 bg-gray-50 p-4 rounded">
                {Object.entries(data).map(([key, value]) => (
                    <p key={key}><strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {value}</p>
                ))}
            </div>
            <div className="flex justify-between mt-4">
                <button type="button" onClick={prevStep} className="p-2 bg-gray-300 rounded">Kembali</button>
                <button type="button" onClick={handleSave} className="p-2 bg-green-600 text-white rounded">Simpan</button>
            </div>
        </div>
    );
}

function SuccessPage({ resetForm, handleLogout }) {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Data Berhasil Disimpan!</h2>
            <div className="flex justify-center gap-4">
                <button onClick={resetForm} className="px-6 py-2 bg-blue-600 text-white rounded">Tambah Data Baru</button>
                <button onClick={handleLogout} className="px-6 py-2 bg-gray-400 text-white rounded">Keluar</button>
            </div>
        </div>
    );
}
