import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Printer, Search, AlertCircle } from "lucide-react";
import { fetchReceiptData } from "@/lib/api";
import ThermalReceipt from "@/components/thermal-receipt";

export default function ReceiptPage() {
  const { refCode } = useParams<{ refCode: string }>();
  const [, setLocation] = useLocation();

  const {
    data: receiptData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/receipt", refCode],
    queryFn: () => fetchReceiptData(refCode!),
    enabled: !!refCode,
    retry: false,
  });

  const handlePrint = () => {
    // Hide all buttons and controls permanently
    const noPrintElements = document.querySelectorAll('.no-print, button');
    noPrintElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Make receipt container full screen immediately
    const receiptContainer = document.querySelector('.receipt-container') as HTMLElement;
    const body = document.body;
    
    if (receiptContainer) {
      body.style.margin = '0';
      body.style.padding = '0';
      body.style.overflow = 'hidden';
      
      receiptContainer.style.position = 'fixed';
      receiptContainer.style.top = '0';
      receiptContainer.style.left = '0';
      receiptContainer.style.width = '100vw';
      receiptContainer.style.height = '100vh';
      receiptContainer.style.zIndex = '9999';
      receiptContainer.style.background = 'white';
      receiptContainer.style.display = 'flex';
      receiptContainer.style.justifyContent = 'center';
      receiptContainer.style.alignItems = 'center';
      receiptContainer.style.border = 'none';
      receiptContainer.style.borderRadius = '0';
      receiptContainer.style.boxShadow = 'none';
      receiptContainer.style.margin = '0';
      receiptContainer.style.padding = '0';
      
      const thermalReceipt = receiptContainer.querySelector('.thermal-receipt') as HTMLElement;
      if (thermalReceipt) {
        thermalReceipt.style.transform = 'scale(1.5)';
        thermalReceipt.style.padding = '40px';
        thermalReceipt.style.width = '100%';
        thermalReceipt.style.maxWidth = 'none';
      }
    }
    
    // Print after styling is applied
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleNewSearch = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-sm mx-auto">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2 pt-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "ไม่พบข้อมูลใบเสร็จตามหมายเลขอ้างอิงที่ระบุ"}
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleNewSearch} 
          variant="outline" 
          className="w-full"
          data-testid="button-back-to-search"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับสู่หน้าสืบค้น
        </Button>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ไม่พบข้อมูลใบเสร็จในระบบ
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleNewSearch} 
          variant="outline" 
          className="w-full mt-4"
          data-testid="button-back-to-search"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับสู่หน้าสืบค้น
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Control buttons (no-print) */}
      <div className="no-print mb-6 flex justify-center space-x-4">
        <Button 
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white"
          data-testid="button-print"
        >
          <Printer className="w-4 h-4 mr-2" />
          พิมพ์ใบเสร็จรับเงิน
        </Button>
        <Button 
          onClick={handleNewSearch}
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50"
          data-testid="button-new-search"
        >
          <Search className="w-4 h-4 mr-2" />
          สืบค้นใหม่
        </Button>
      </div>

      {/* Thermal Receipt Container */}
      <ThermalReceipt data={receiptData} />
    </div>
  );
}
