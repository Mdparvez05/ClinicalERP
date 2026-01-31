import { Plus } from 'lucide-react';

export function Billing() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing</h1>
          <p className="text-gray-600">Manage invoices and payments</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          New Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">💳</div>
        <h3 className="text-2xl font-semibold mb-2">Billing Management</h3>
        <p className="text-gray-600 mb-6">Create invoices and track payments</p>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg">
          Create First Invoice
        </button>
      </div>
    </div>
  );
}
