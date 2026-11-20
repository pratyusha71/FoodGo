import { Link } from "@tanstack/react-router";
import { PackageSearch } from "lucide-react";

import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/button";

export function OrderNotFound({ orderId }: { orderId: string }) {
  return (
    <div className="px-4 py-20">
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description={`We couldn't find order ${orderId} on this device. Orders are saved in this browser only.`}
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="hero"><Link to="/orders">My Orders</Link></Button>
            <Button asChild variant="outline"><Link to="/menu">Browse menu</Link></Button>
          </div>
        }
      />
    </div>
  );
}
