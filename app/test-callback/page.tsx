'use client'

export default function TestCallback() {
  const testCallback = () => {
    // Test if our callback route is accessible
    window.location.href = '/auth/callback?test=true';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-2xl mb-4">Test OAuth Callback</h1>
        <button 
          onClick={testCallback}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Test Callback Route
        </button>
        <p className="mt-4 text-sm text-gray-400">
          This will test if the /auth/callback route is working
        </p>
      </div>
    </div>
  );
}