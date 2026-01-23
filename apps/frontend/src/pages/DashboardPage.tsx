import { useAuth } from '../contexts/useAuth';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isAdmin, isPembeli } = useAuth();

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome, <span className="font-semibold">{user?.email}</span>!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {isAdmin && (
              <>
                <Link
                  to="/users"
                  className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                >
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">Manage Users</h2>
                  <p className="text-blue-700">View, create, update, and delete users</p>
                </Link>
                <Link
                  to="/products"
                  className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <h2 className="text-xl font-semibold text-green-900 mb-2">Manage Products</h2>
                  <p className="text-green-700">View, create, update, and delete products</p>
                </Link>
              </>
            )}

            {isPembeli && (
              <>
                <Link
                  to="/products"
                  className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                >
                  <h2 className="text-xl font-semibold text-purple-900 mb-2">Browse Products</h2>
                  <p className="text-purple-700">View available products</p>
                </Link>
                <Link
                  to="/cart"
                  className="block p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
                >
                  <h2 className="text-xl font-semibold text-yellow-900 mb-2">Shopping Cart</h2>
                  <p className="text-yellow-700">View your cart items</p>
                </Link>
                <Link
                  to="/transactions"
                  className="block p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                >
                  <h2 className="text-xl font-semibold text-indigo-900 mb-2">Transaction History</h2>
                  <p className="text-indigo-700">View your purchase history</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
