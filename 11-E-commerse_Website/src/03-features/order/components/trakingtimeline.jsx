 import { useLocation } from "react-router-dom";
import { 
  FaCheckCircle, 
  FaTruck, 
  FaWarehouse, 
  FaShippingFast,
  FaBoxOpen,
  FaInfoCircle
} from "react-icons/fa";

export default function TrackingOrderPage() {
  const { state } = useLocation();
  const trackingDetails = state?.trackingDetails || [];

  // Reverse the array to show chronological order (oldest first, newest last)
  const chronologicalEvents = [...trackingDetails].reverse();

  if (!chronologicalEvents.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <FaInfoCircle className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-center text-gray-600 font-normal text-lg">
          No tracking updates available.
        </p>
      </div>
    );
  }

  const getStatusIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('delivered')) return <FaCheckCircle className="w-6 h-6 text-green-500" />;
    if (desc.includes('picked up')) return <FaBoxOpen className="w-6 h-6 text-blue-500" />;
    if (desc.includes('on vehicle') || desc.includes('for delivery')) return <FaTruck className="w-6 h-6 text-orange-500" />;
    if (desc.includes('arrived') || desc.includes('at local')) return <FaWarehouse className="w-6 h-6 text-purple-500" />;
    if (desc.includes('departed') || desc.includes('left')) return <FaShippingFast className="w-6 h-6 text-red-500" />;
    if (desc.includes('in transit')) return <FaShippingFast className="w-6 h-6 text-yellow-500" />;
    if (desc.includes('shipment information')) return <FaInfoCircle className="w-6 h-6 text-gray-500" />;
    return <FaInfoCircle className="w-6 h-6 text-gray-500" />;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    
    return {
      date: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }).toLowerCase()
    };
  };

  const latestEvent = chronologicalEvents[chronologicalEvents.length - 1];
  const isDelivered = latestEvent.eventDescription.toLowerCase().includes('delivered');

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 font-normal">
      {/* Header - Simplified like in the image */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Package Tracking</h1>
        <div className={`inline-flex items-center px-4 py-1 rounded-full border ${
          isDelivered ? 'bg-green-50 border-green-200 text-green-700' : 'bg-blue-50 border-blue-200 text-blue-700'
        }`}>
          <span className="text-sm font-medium">
            {isDelivered ? 'Delivered' : 'In Transit'}
          </span>
        </div>
      </div>

      {/* Timeline - Simplified vertical layout */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
        
        <div className="space-y-4">
          {chronologicalEvents.map((item, index) => {
            const datetime = formatDateTime(item.date);
            const isLatest = index === chronologicalEvents.length - 1;
            
            return (
              <div key={index} className="relative flex items-start">
                {/* Icon with connecting dot */}
                <div className="flex-shrink-0 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isLatest ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(item.eventDescription)}
                  </div>
                </div>

                {/* Content - Simplified like the image */}
                <div className="ml-4 flex-1 min-w-0">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className={`font-semibold text-base ${
                      isLatest ? 'text-green-700' : 'text-gray-800'
                    }`}>
                      {item.eventDescription}
                    </h3>
                    
                    {item.city !== 'Unknown' && (
                      <p className="text-sm text-gray-600 mt-1">
                        {item.city}{item.state !== 'Unknown' ? `, ${item.state}` : ''}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {datetime.date}
                      </span>
                      <span className="text-xs text-gray-400">
                        {datetime.time}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple Summary - Like in the image */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">Shipping Summary</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>From:</span>
            <span className="font-medium">
              {chronologicalEvents.find(item => item.eventDescription.includes('Picked up'))?.city || 'SPOKANE'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>To:</span>
            <span className="font-medium">
              {chronologicalEvents.find(item => item.eventDescription.includes('Delivered'))?.city || 'NORTON'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-medium ${
              isDelivered ? 'text-green-600' : 'text-blue-600'
            }`}>
              {isDelivered ? 'Delivered' : 'In Transit'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}