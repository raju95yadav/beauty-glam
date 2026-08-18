import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import orderService from '../services/orderService';
import Loader from '../components/ui/Loader';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [orderToCancel, setOrderToCancel] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        setOrders(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      setCancellingId(orderToCancel._id);
      const updatedOrder = await orderService.cancelOrder(orderToCancel._id);
      setOrders(prev => prev.map(o => o._id === orderToCancel._id ? { ...o, ...updatedOrder, orderStatus: 'Cancelled' } : o));
      toast.success('Order cancelled successfully!');
      setOrderToCancel(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Processing': return <Clock className="size-4 text-orange-500" />;
      case 'Shipped': return <Truck className="size-4 text-blue-500" />;
      case 'Delivered': return <CheckCircle2 className="size-4 text-green-500" />;
      case 'Cancelled': return <XCircle className="size-4 text-red-500" />;
      default: return <Package className="size-4 text-pink-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-pink-50 rounded-2xl text-pink-600">
          <Package className="size-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-widest">My Orders</h1>
      </div>

      {loading ? (
        <Loader fullScreen />
      ) : error ? (
        <div className="text-center py-24 bg-red-50 rounded-3xl border-2 border-dashed border-red-200">
           <p className="text-red-500 font-medium">{error}</p>
           <button 
             onClick={() => window.location.reload()} 
             className="mt-4 bg-red-600 text-white font-bold px-8 py-2 rounded-xl hover:bg-red-700 transition-all uppercase tracking-widest text-xs"
           >
             Retry
           </button>
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus = order.orderStatus || (order.isDelivered ? 'Delivered' : 'Confirmed');
            const canCancel = currentStatus !== 'Delivered' && currentStatus !== 'Cancelled';

            return (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-4 md:p-6 bg-gray-50 border-b flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Order Placed</p>
                      <p className="text-sm font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Total</p>
                      <p className="text-sm font-bold text-gray-900">₹{order.totalPrice}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Order ID</p>
                      <p className="text-sm font-medium text-gray-700 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${
                    currentStatus === 'Cancelled' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white'
                  }`}>
                    {getStatusIcon(currentStatus)}
                    <span className="text-xs font-bold uppercase tracking-wider">{currentStatus}</span>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="space-y-6">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="size-20 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-gray-800 text-sm md:text-base mb-1">{item.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                            <p className="text-sm font-bold text-gray-900 mt-2 md:hidden">₹{item.price}</p>
                          </div>
                          <div className="hidden md:block text-right">
                            <p className="font-bold text-gray-900">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="mt-8 flex flex-wrap justify-end gap-3 border-t pt-6">
                    {canCancel && (
                      <button 
                        onClick={() => setOrderToCancel(order)}
                        className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-red-100 transition-all uppercase tracking-widest flex items-center gap-2"
                      >
                        <XCircle className="size-4" />
                        Cancel Order
                      </button>
                    )}

                    <Link to={`/orders/${order._id}`} className="bg-gray-900 text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-black transition-all uppercase tracking-widest flex items-center gap-2">
                      <Truck className="size-3.5" />
                      Track Order
                    </Link>

                    <button 
                      onClick={async () => {
                        try {
                          for (const item of order.orderItems) {
                            await addToCart({ _id: item.product, name: item.name, price: item.price, images: item.image ? [{ url: item.image }] : [] }, item.qty);
                          }
                          toast.success('Items added to bag!');
                          navigate('/cart');
                        } catch (err) {
                          toast.error('Failed to add items to bag.');
                        }
                      }}
                      className="bg-pink-600 text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-pink-700 transition-all uppercase tracking-widest"
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
           <p className="text-gray-500 mb-6 font-medium">You haven&apos;t placed any orders yet.</p>
           <button onClick={() => navigate('/products')} className="bg-pink-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-pink-700 transition-all uppercase tracking-widest">
             Start Shopping
           </button>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-6">
            <div className="size-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-500">
              <XCircle className="size-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Cancel Order?</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Are you sure you want to cancel order <span className="font-bold text-gray-800">#{orderToCancel._id.slice(-8).toUpperCase()}</span>? This action will restore product stock and cannot be undone.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCancelOrder}
                disabled={cancellingId === orderToCancel._id}
                className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-md disabled:opacity-50"
              >
                {cancellingId === orderToCancel._id ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
              <button 
                onClick={() => setOrderToCancel(null)}
                disabled={cancellingId === orderToCancel._id}
                className="w-full text-gray-500 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:text-gray-800 transition-colors"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
