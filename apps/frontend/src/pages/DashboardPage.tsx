import { useAuth } from '@/contexts/useAuth';
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DashboardPage() {
  const { user, isAdmin, isPembeli } = useAuth();

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Card>
          <CardHeader>
             <CardTitle className="text-3xl">Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">
                Welcome, <span className="font-semibold">{user?.email}</span>!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {isAdmin && (
                <>
                    <Link to="/users" className="block h-full">
                        <Card className="h-full hover:shadow-md transition bg-blue-50 border-blue-100">
                            <CardHeader>
                                <CardTitle className="text-blue-900 text-xl">Manage Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700">View, create, update, and delete users</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/products" className="block h-full">
                         <Card className="h-full hover:shadow-md transition bg-green-50 border-green-100">
                            <CardHeader>
                                <CardTitle className="text-green-900 text-xl">Manage Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-green-700">View, create, update, and delete products</p>
                            </CardContent>
                        </Card>
                    </Link>
                </>
                )}

                {isPembeli && (
                <>
                    <Link to="/products" className="block h-full">
                        <Card className="h-full hover:shadow-md transition bg-purple-50 border-purple-100">
                            <CardHeader>
                                <CardTitle className="text-purple-900 text-xl">Browse Products</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-purple-700">View available products</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/cart" className="block h-full">
                        <Card className="h-full hover:shadow-md transition bg-yellow-50 border-yellow-100">
                            <CardHeader>
                                <CardTitle className="text-yellow-900 text-xl">Shopping Cart</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-yellow-700">View your cart items</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link to="/transactions" className="block h-full">
                         <Card className="h-full hover:shadow-md transition bg-indigo-50 border-indigo-100">
                            <CardHeader>
                                <CardTitle className="text-indigo-900 text-xl">Transaction History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-indigo-700">View your purchase history</p>
                            </CardContent>
                        </Card>
                    </Link>
                </>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
