import React from 'react';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Check,
  AlertCircle,
  XCircle,
  Sparkles,
  MapPin,
  Building2,
} from 'lucide-react';
import { Order } from '@/types';
import { SquareBadge } from '@/components/ui/SquareBadge';

interface OrderTrackingTimelineProps {
  status: Order['status'];
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber?: string;
  courierName?: string;
}

const STEPS = [
  {
    key: 'PENDING',
    title: 'Order Placed',
    description: 'Order registered & awaiting payment verification',
    icon: Clock,
  },
  {
    key: 'CONFIRMED',
    title: 'Order Confirmed',
    description: 'Payment verified & sent to Mangalore Orchard Facility',
    icon: CheckCircle2,
  },
  {
    key: 'PACKED',
    title: 'Vacuum Packed',
    description: 'Fresh cashews nitrogen flushed & vacuum sealed',
    icon: Package,
  },
  {
    key: 'SHIPPED',
    title: 'Out for Delivery',
    description: 'Handed over to Express Air Courier',
    icon: Truck,
  },
  {
    key: 'DELIVERED',
    title: 'Delivered',
    description: 'Package safely delivered to your doorstep',
    icon: MapPin,
  },
];

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  status,
  createdAt,
  estimatedDelivery,
  trackingNumber = 'VSN-EXP-88902',
  courierName = 'Bluedart Express Priority Air',
}) => {
  if (status === 'CANCELLED') {
    return (
      <div className="p-4 bg-red-950/40 border border-red-500/50 text-red-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-red-300">
          <XCircle className="w-5 h-5 text-red-400" />
          Order Cancelled
        </div>
        <p>This order was cancelled and a full refund (if paid) has been initiated to your original payment method.</p>
      </div>
    );
  }

  // Get current step index (0 to 4)
  const getStepIndex = (st: Order['status']) => {
    switch (st) {
      case 'PENDING':
        return 0;
      case 'CONFIRMED':
        return 1;
      case 'PACKED':
        return 2;
      case 'SHIPPED':
        return 3;
      case 'DELIVERED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(status);

  return (
    <div className="space-y-6 bg-[#0B132B] p-5 border border-[#D4AF37]/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-[#D4AF37]/20 gap-2 text-xs">
        <div>
          <span className="text-gray-400">Current Status: </span>
          <strong className="text-[#F3E5AB] font-serif uppercase text-sm ml-1">
            {status.replace('_', ' ')}
          </strong>
        </div>
        <div className="text-gray-300 font-mono">
          Courier: <span className="text-[#D4AF37] font-semibold">{courierName}</span> ({trackingNumber})
        </div>
      </div>

      {/* Visual Timeline Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-gray-800 -z-0">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-amber-300 transition-all duration-500"
            style={{
              width: `${(currentStepIdx / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const isDone = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;
            const IconComponent = step.icon;

            return (
              <div
                key={step.key}
                className={`flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 ${
                  isDone ? 'text-[#F3E5AB]' : 'text-gray-500'
                }`}
              >
                {/* Step Circle Indicator */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                    isCurrent
                      ? 'border-[#D4AF37] bg-[#1C2541] text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] scale-110'
                      : isDone
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-[#0B132B]'
                      : 'border-gray-700 bg-[#0B132B] text-gray-600'
                  }`}
                >
                  {isDone && !isCurrent ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`font-serif font-bold text-xs ${
                      isCurrent ? 'text-[#D4AF37]' : isDone ? 'text-[#F8F9FA]' : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Estimated Delivery Note */}
      <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-gray-300">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          Dispatched directly from Mangalore Baikampady Estate
        </span>
        <span className="text-[#F3E5AB] font-bold">
          Est. Delivery: {estimatedDelivery}
        </span>
      </div>
    </div>
  );
};
